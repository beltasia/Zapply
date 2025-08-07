"use client"

import { useState, useEffect, useCallback } from 'react'
import { ActivityLog, LiveActivity, ActivityStats, generateMockActivities, calculateActivityStats, ACTIVITY_ACTIONS } from '@/lib/activity-types'

export const useActivityMonitor = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [liveActivities, setLiveActivities] = useState<LiveActivity[]>([])
  const [stats, setStats] = useState<ActivityStats | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(true)

  // Initialize with mock data
  useEffect(() => {
    const mockActivities = generateMockActivities(200)
    setActivities(mockActivities)
    setStats(calculateActivityStats(mockActivities))
    setLoading(false)
    setIsConnected(true)
  }, [])

  // Simulate real-time activity updates
  useEffect(() => {
    if (!isConnected) return

    const interval = setInterval(() => {
      // Generate new activity
      const adminUsers = [
        { id: '1', name: 'John Administrator', role: 'super_admin' },
        { id: '2', name: 'Sarah Manager', role: 'job_manager' },
        { id: '3', name: 'Mike Moderator', role: 'content_moderator' },
        { id: '4', name: 'Lisa Analyst', role: 'analyst' }
      ]

      const actions = Object.keys(ACTIVITY_ACTIONS)
      const resources = ['Job', 'User', 'Admin', 'Settings']
      
      const admin = adminUsers[Math.floor(Math.random() * adminUsers.length)]
      const action = actions[Math.floor(Math.random() * actions.length)]
      const actionDef = ACTIVITY_ACTIONS[action as keyof typeof ACTIVITY_ACTIONS]
      const resource = resources[Math.floor(Math.random() * resources.length)]

      const newActivity: ActivityLog = {
        id: `activity_${Date.now()}_${Math.random()}`,
        adminId: admin.id,
        adminName: admin.name,
        adminRole: admin.role,
        action,
        resource,
        resourceId: `${resource.toLowerCase()}_${Math.floor(Math.random() * 1000)}`,
        details: `${actionDef.label} - ${resource} #${Math.floor(Math.random() * 1000)}`,
        metadata: {
          browser: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          duration: Math.floor(Math.random() * 2000) + 100
        },
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: new Date(),
        severity: actionDef.severity,
        category: actionDef.category,
        status: Math.random() > 0.05 ? 'success' : 'failed'
      }

      // Add to live activities
      const liveActivity: LiveActivity = {
        id: newActivity.id,
        adminName: newActivity.adminName,
        action: actionDef.label,
        resource: newActivity.resource,
        timestamp: newActivity.timestamp,
        severity: newActivity.severity,
        status: newActivity.status
      }

      setLiveActivities(prev => [liveActivity, ...prev.slice(0, 9)]) // Keep last 10
      
      // Add to main activities
      setActivities(prev => {
        const updated = [newActivity, ...prev]
        setStats(calculateActivityStats(updated))
        return updated
      })
    }, Math.random() * 5000 + 2000) // Random interval between 2-7 seconds

    return () => clearInterval(interval)
  }, [isConnected])

  const filterActivities = useCallback((
    filters: {
      adminId?: string
      category?: string
      severity?: string
      status?: string
      dateRange?: { start: Date; end: Date }
      search?: string
    }
  ) => {
    return activities.filter(activity => {
      if (filters.adminId && activity.adminId !== filters.adminId) return false
      if (filters.category && activity.category !== filters.category) return false
      if (filters.severity && activity.severity !== filters.severity) return false
      if (filters.status && activity.status !== filters.status) return false
      if (filters.dateRange) {
        if (activity.timestamp < filters.dateRange.start || activity.timestamp > filters.dateRange.end) {
          return false
        }
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        return (
          activity.adminName.toLowerCase().includes(searchLower) ||
          activity.action.toLowerCase().includes(searchLower) ||
          activity.resource.toLowerCase().includes(searchLower) ||
          activity.details.toLowerCase().includes(searchLower)
        )
      }
      return true
    })
  }, [activities])

  const exportActivities = useCallback((filteredActivities: ActivityLog[]) => {
    const csvContent = [
      ['Timestamp', 'Admin', 'Role', 'Action', 'Resource', 'Details', 'Status', 'Severity', 'IP Address'].join(','),
      ...filteredActivities.map(activity => [
        activity.timestamp.toISOString(),
        activity.adminName,
        activity.adminRole,
        activity.action,
        activity.resource,
        `"${activity.details}"`,
        activity.status,
        activity.severity,
        activity.ipAddress
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `admin-activity-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  return {
    activities,
    liveActivities,
    stats,
    isConnected,
    loading,
    filterActivities,
    exportActivities,
    setIsConnected
  }
}
