import { useState, useEffect, useCallback } from 'react'
import { AdminActivity, ActivityStats, generateMockActivity } from '@/lib/activity-types'

export function useActivityMonitor() {
  const [activities, setActivities] = useState<AdminActivity[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [stats, setStats] = useState<ActivityStats | null>(null)

  // Initialize with mock data
  useEffect(() => {
    const initialActivities = Array.from({ length: 50 }, () => {
      const activity = generateMockActivity()
      // Spread timestamps over the last 24 hours
      const hoursAgo = Math.floor(Math.random() * 24)
      activity.timestamp = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()
      return activity
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    setActivities(initialActivities)
    setIsConnected(true)
  }, [])

  // Simulate real-time updates
  useEffect(() => {
    if (!isConnected) return

    const interval = setInterval(() => {
      const newActivity = generateMockActivity()
      setActivities(prev => [newActivity, ...prev.slice(0, 99)]) // Keep last 100 activities
    }, Math.random() * 5000 + 2000) // Random interval between 2-7 seconds

    return () => clearInterval(interval)
  }, [isConnected])

  // Calculate stats whenever activities change
  useEffect(() => {
    if (activities.length === 0) return

    const now = new Date()
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    const recentActivities = activities.filter(
      activity => new Date(activity.timestamp) >= last24Hours
    )

    const uniqueAdmins = new Set(
      recentActivities.map(activity => activity.adminId)
    ).size

    const failedActions = recentActivities.filter(
      activity => activity.status === 'failed'
    ).length

    const criticalActions = recentActivities.filter(
      activity => activity.severity === 'critical'
    ).length

    // Top actions
    const actionCounts = recentActivities.reduce((acc, activity) => {
      acc[activity.action] = (acc[activity.action] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topActions = Object.entries(actionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([action, count]) => ({ action, count }))

    // Category distribution
    const categoryCounts = recentActivities.reduce((acc, activity) => {
      acc[activity.category] = (acc[activity.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const totalCategoryCount = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0)
    const categoryDistribution = Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / totalCategoryCount) * 100)
    }))

    // Hourly activity
    const hourlyActivity = Array.from({ length: 24 }, (_, hour) => {
      const hourActivities = recentActivities.filter(activity => {
        const activityHour = new Date(activity.timestamp).getHours()
        return activityHour === hour
      })
      return { hour, count: hourActivities.length }
    })

    setStats({
      totalActivities: activities.length,
      activeAdmins: uniqueAdmins,
      recentActivity: recentActivities.length,
      failedActions,
      criticalActions,
      topActions,
      categoryDistribution,
      hourlyActivity
    })
  }, [activities])

  const exportToCsv = useCallback((filteredActivities: AdminActivity[]) => {
    const headers = [
      'Timestamp',
      'Admin',
      'Action',
      'Category',
      'Resource',
      'Status',
      'Severity',
      'IP Address',
      'Details'
    ]

    const csvContent = [
      headers.join(','),
      ...filteredActivities.map(activity => [
        activity.timestamp,
        activity.adminName,
        activity.action,
        activity.category,
        activity.resource || '',
        activity.status,
        activity.severity,
        activity.ipAddress,
        `"${activity.details}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `admin-activity-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [])

  return {
    activities,
    stats,
    isConnected,
    exportToCsv
  }
}
