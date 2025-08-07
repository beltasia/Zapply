export interface ActivityLog {
  id: string
  adminId: string
  adminName: string
  adminRole: string
  action: string
  resource: string
  resourceId?: string
  details: string
  metadata?: Record<string, any>
  ipAddress: string
  userAgent: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'auth' | 'jobs' | 'users' | 'settings' | 'security' | 'system'
  status: 'success' | 'failed' | 'pending'
}

export interface ActivityStats {
  totalActivities: number
  activitiesLast24h: number
  activitiesLast7d: number
  activeAdmins: number
  failedActions: number
  criticalActions: number
  topActions: Array<{ action: string; count: number }>
  activityByHour: Array<{ hour: number; count: number }>
  activityByAdmin: Array<{ adminName: string; count: number; role: string }>
  activityByCategory: Array<{ category: string; count: number }>
}

export interface LiveActivity {
  id: string
  adminName: string
  action: string
  resource: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'success' | 'failed'
}

// Activity action definitions
export const ACTIVITY_ACTIONS = {
  // Authentication
  'auth.login': { label: 'Admin Login', severity: 'low', category: 'auth' },
  'auth.logout': { label: 'Admin Logout', severity: 'low', category: 'auth' },
  'auth.failed_login': { label: 'Failed Login Attempt', severity: 'medium', category: 'auth' },
  'auth.password_change': { label: 'Password Changed', severity: 'medium', category: 'auth' },
  
  // Job Management
  'jobs.create': { label: 'Job Created', severity: 'low', category: 'jobs' },
  'jobs.update': { label: 'Job Updated', severity: 'low', category: 'jobs' },
  'jobs.delete': { label: 'Job Deleted', severity: 'medium', category: 'jobs' },
  'jobs.publish': { label: 'Job Published', severity: 'low', category: 'jobs' },
  'jobs.unpublish': { label: 'Job Unpublished', severity: 'low', category: 'jobs' },
  'jobs.bulk_delete': { label: 'Bulk Job Deletion', severity: 'high', category: 'jobs' },
  
  // User Management
  'users.view': { label: 'User Profile Viewed', severity: 'low', category: 'users' },
  'users.update': { label: 'User Profile Updated', severity: 'medium', category: 'users' },
  'users.suspend': { label: 'User Suspended', severity: 'high', category: 'users' },
  'users.activate': { label: 'User Activated', severity: 'medium', category: 'users' },
  'users.delete': { label: 'User Deleted', severity: 'critical', category: 'users' },
  'users.message': { label: 'Message Sent to User', severity: 'low', category: 'users' },
  
  // Admin Management
  'admins.create': { label: 'Admin Created', severity: 'high', category: 'security' },
  'admins.update': { label: 'Admin Updated', severity: 'medium', category: 'security' },
  'admins.delete': { label: 'Admin Deleted', severity: 'critical', category: 'security' },
  'admins.role_change': { label: 'Admin Role Changed', severity: 'high', category: 'security' },
  
  // Settings
  'settings.update': { label: 'Settings Updated', severity: 'medium', category: 'settings' },
  'settings.scraping_config': { label: 'Scraping Config Changed', severity: 'medium', category: 'settings' },
  
  // System
  'system.backup': { label: 'System Backup', severity: 'low', category: 'system' },
  'system.maintenance': { label: 'Maintenance Mode', severity: 'high', category: 'system' },
  'system.error': { label: 'System Error', severity: 'critical', category: 'system' }
}

// Mock activity data generator
export const generateMockActivities = (count: number = 100): ActivityLog[] => {
  const activities: ActivityLog[] = []
  const adminUsers = [
    { id: '1', name: 'John Administrator', role: 'super_admin' },
    { id: '2', name: 'Sarah Manager', role: 'job_manager' },
    { id: '3', name: 'Mike Moderator', role: 'content_moderator' },
    { id: '4', name: 'Lisa Analyst', role: 'analyst' }
  ]
  
  const actions = Object.keys(ACTIVITY_ACTIONS)
  const resources = ['Job', 'User', 'Admin', 'Settings', 'System']
  const ipAddresses = ['192.168.1.100', '10.0.0.50', '172.16.0.25', '203.0.113.10']
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
  ]

  for (let i = 0; i < count; i++) {
    const admin = adminUsers[Math.floor(Math.random() * adminUsers.length)]
    const action = actions[Math.floor(Math.random() * actions.length)]
    const actionDef = ACTIVITY_ACTIONS[action as keyof typeof ACTIVITY_ACTIONS]
    const resource = resources[Math.floor(Math.random() * resources.length)]
    
    // Generate timestamp within last 7 days
    const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
    
    activities.push({
      id: `activity_${i + 1}`,
      adminId: admin.id,
      adminName: admin.name,
      adminRole: admin.role,
      action,
      resource,
      resourceId: `${resource.toLowerCase()}_${Math.floor(Math.random() * 1000)}`,
      details: `${actionDef.label} - ${resource} #${Math.floor(Math.random() * 1000)}`,
      metadata: {
        browser: userAgents[Math.floor(Math.random() * userAgents.length)],
        duration: Math.floor(Math.random() * 5000) + 100
      },
      ipAddress: ipAddresses[Math.floor(Math.random() * ipAddresses.length)],
      userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
      timestamp,
      severity: actionDef.severity,
      category: actionDef.category,
      status: Math.random() > 0.1 ? 'success' : 'failed'
    })
  }

  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

// Activity analytics functions
export const calculateActivityStats = (activities: ActivityLog[]): ActivityStats => {
  const now = new Date()
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const activitiesLast24h = activities.filter(a => a.timestamp >= last24h).length
  const activitiesLast7d = activities.filter(a => a.timestamp >= last7d).length
  const activeAdmins = new Set(activities.filter(a => a.timestamp >= last24h).map(a => a.adminId)).size
  const failedActions = activities.filter(a => a.status === 'failed').length
  const criticalActions = activities.filter(a => a.severity === 'critical').length

  // Top actions
  const actionCounts = activities.reduce((acc, activity) => {
    const actionDef = ACTIVITY_ACTIONS[activity.action as keyof typeof ACTIVITY_ACTIONS]
    const label = actionDef?.label || activity.action
    acc[label] = (acc[label] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topActions = Object.entries(actionCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([action, count]) => ({ action, count }))

  // Activity by hour (last 24 hours)
  const activityByHour = Array.from({ length: 24 }, (_, i) => {
    const hour = (now.getHours() - i + 24) % 24
    const hourStart = new Date(now)
    hourStart.setHours(hour, 0, 0, 0)
    const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000)
    
    const count = activities.filter(a => 
      a.timestamp >= hourStart && a.timestamp < hourEnd
    ).length

    return { hour, count }
  }).reverse()

  // Activity by admin
  const adminCounts = activities.reduce((acc, activity) => {
    const key = `${activity.adminName}|${activity.adminRole}`
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const activityByAdmin = Object.entries(adminCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([key, count]) => {
      const [adminName, role] = key.split('|')
      return { adminName, count, role }
    })

  // Activity by category
  const categoryCounts = activities.reduce((acc, activity) => {
    acc[activity.category] = (acc[activity.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const activityByCategory = Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)

  return {
    totalActivities: activities.length,
    activitiesLast24h,
    activitiesLast7d,
    activeAdmins,
    failedActions,
    criticalActions,
    topActions,
    activityByHour,
    activityByAdmin,
    activityByCategory
  }
}
