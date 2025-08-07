export interface AdminActivity {
  id: string
  adminId: string
  adminName: string
  adminEmail: string
  action: string
  category: 'auth' | 'jobs' | 'users' | 'settings' | 'security' | 'system'
  resource?: string
  resourceId?: string
  details: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'success' | 'failed' | 'pending'
  timestamp: string
  ipAddress: string
  userAgent: string
  duration?: number
  metadata?: Record<string, any>
}

export interface ActivityStats {
  totalActivities: number
  activeAdmins: number
  recentActivity: number
  failedActions: number
  criticalActions: number
  topActions: Array<{ action: string; count: number }>
  categoryDistribution: Array<{ category: string; count: number; percentage: number }>
  hourlyActivity: Array<{ hour: number; count: number }>
}

export const ACTIVITY_CATEGORIES = {
  auth: 'Authentication',
  jobs: 'Job Management',
  users: 'User Management',
  settings: 'Settings',
  security: 'Security',
  system: 'System'
} as const

export const SEVERITY_COLORS = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
} as const

export const STATUS_COLORS = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
} as const

// Mock activity data generator
export const generateMockActivity = (): AdminActivity => {
  const admins = [
    { id: 'admin_1', name: 'John Smith', email: 'john@zapply.com' },
    { id: 'admin_2', name: 'Sarah Johnson', email: 'sarah@zapply.com' },
    { id: 'admin_3', name: 'Mike Wilson', email: 'mike@zapply.com' },
    { id: 'admin_4', name: 'Lisa Brown', email: 'lisa@zapply.com' }
  ]

  const actions = [
    { action: 'login', category: 'auth', severity: 'low' },
    { action: 'logout', category: 'auth', severity: 'low' },
    { action: 'failed_login', category: 'auth', severity: 'medium' },
    { action: 'create_job', category: 'jobs', severity: 'medium' },
    { action: 'edit_job', category: 'jobs', severity: 'low' },
    { action: 'delete_job', category: 'jobs', severity: 'high' },
    { action: 'suspend_user', category: 'users', severity: 'high' },
    { action: 'edit_user', category: 'users', severity: 'medium' },
    { action: 'change_settings', category: 'settings', severity: 'medium' },
    { action: 'role_change', category: 'security', severity: 'critical' },
    { action: 'backup_created', category: 'system', severity: 'low' },
    { action: 'system_error', category: 'system', severity: 'high' }
  ]

  const statuses = ['success', 'success', 'success', 'failed', 'pending']
  const admin = admins[Math.floor(Math.random() * admins.length)]
  const actionData = actions[Math.floor(Math.random() * actions.length)]
  const status = statuses[Math.floor(Math.random() * statuses.length)]

  return {
    id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    adminId: admin.id,
    adminName: admin.name,
    adminEmail: admin.email,
    action: actionData.action,
    category: actionData.category as AdminActivity['category'],
    resource: actionData.category === 'jobs' ? 'Job Posting' : actionData.category === 'users' ? 'User Account' : undefined,
    resourceId: `${actionData.category}_${Math.floor(Math.random() * 1000)}`,
    details: getActivityDetails(actionData.action, admin.name),
    severity: actionData.severity as AdminActivity['severity'],
    status: status as AdminActivity['status'],
    timestamp: new Date().toISOString(),
    ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    duration: Math.floor(Math.random() * 5000) + 100,
    metadata: {
      browser: 'Chrome',
      os: 'Windows',
      location: 'Harare, Zimbabwe'
    }
  }
}

const getActivityDetails = (action: string, adminName: string): string => {
  const details = {
    login: `${adminName} successfully logged into the admin panel`,
    logout: `${adminName} logged out of the admin panel`,
    failed_login: `Failed login attempt for ${adminName}`,
    create_job: `${adminName} created a new job posting`,
    edit_job: `${adminName} modified a job posting`,
    delete_job: `${adminName} deleted a job posting`,
    suspend_user: `${adminName} suspended a user account`,
    edit_user: `${adminName} updated user profile information`,
    change_settings: `${adminName} modified system settings`,
    role_change: `${adminName} changed admin role permissions`,
    backup_created: `System backup created by ${adminName}`,
    system_error: `System error occurred during ${adminName}'s session`
  }
  return details[action as keyof typeof details] || `${adminName} performed ${action}`
}
