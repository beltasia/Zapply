export interface Permission {
  id: string
  name: string
  description: string
  category: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  color: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  lastLogin: string
  createdAt: string
}

// Define all available permissions
export const PERMISSIONS: Permission[] = [
  // Job Management
  { id: 'jobs.view', name: 'View Jobs', description: 'View job listings and details', category: 'Jobs' },
  { id: 'jobs.create', name: 'Create Jobs', description: 'Create new job postings', category: 'Jobs' },
  { id: 'jobs.edit', name: 'Edit Jobs', description: 'Modify existing job postings', category: 'Jobs' },
  { id: 'jobs.delete', name: 'Delete Jobs', description: 'Remove job postings', category: 'Jobs' },
  { id: 'jobs.publish', name: 'Publish Jobs', description: 'Activate/deactivate job postings', category: 'Jobs' },
  { id: 'jobs.bulk', name: 'Bulk Job Operations', description: 'Perform bulk operations on jobs', category: 'Jobs' },
  
  // User Management
  { id: 'users.view', name: 'View Users', description: 'View user profiles and information', category: 'Users' },
  { id: 'users.edit', name: 'Edit Users', description: 'Modify user profiles', category: 'Users' },
  { id: 'users.suspend', name: 'Suspend Users', description: 'Suspend/activate user accounts', category: 'Users' },
  { id: 'users.delete', name: 'Delete Users', description: 'Permanently delete user accounts', category: 'Users' },
  { id: 'users.message', name: 'Message Users', description: 'Send messages to users', category: 'Users' },
  
  // Analytics & Reports
  { id: 'analytics.view', name: 'View Analytics', description: 'Access platform analytics and reports', category: 'Analytics' },
  { id: 'analytics.export', name: 'Export Reports', description: 'Export analytics data and reports', category: 'Analytics' },
  
  // System Settings
  { id: 'settings.view', name: 'View Settings', description: 'View system configuration', category: 'Settings' },
  { id: 'settings.edit', name: 'Edit Settings', description: 'Modify system settings', category: 'Settings' },
  { id: 'settings.scraping', name: 'Manage Scraping', description: 'Configure job scraping sources', category: 'Settings' },
  
  // Admin Management
  { id: 'admins.view', name: 'View Admins', description: 'View admin users and roles', category: 'Admin Management' },
  { id: 'admins.create', name: 'Create Admins', description: 'Create new admin accounts', category: 'Admin Management' },
  { id: 'admins.edit', name: 'Edit Admins', description: 'Modify admin accounts and roles', category: 'Admin Management' },
  { id: 'admins.delete', name: 'Delete Admins', description: 'Remove admin accounts', category: 'Admin Management' },
  { id: 'roles.manage', name: 'Manage Roles', description: 'Create and modify admin roles', category: 'Admin Management' },
  
  // Audit & Security
  { id: 'audit.view', name: 'View Audit Logs', description: 'Access system audit logs', category: 'Security' },
  { id: 'security.manage', name: 'Manage Security', description: 'Configure security settings', category: 'Security' }
]

// Define predefined roles
export const ROLES: Role[] = [
  {
    id: 'super_admin',
    name: 'Super Administrator',
    description: 'Full system access with all permissions',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    permissions: PERMISSIONS.map(p => p.id) // All permissions
  },
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full job and user management access',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    permissions: [
      'jobs.view', 'jobs.create', 'jobs.edit', 'jobs.delete', 'jobs.publish', 'jobs.bulk',
      'users.view', 'users.edit', 'users.suspend', 'users.message',
      'analytics.view', 'analytics.export',
      'settings.view'
    ]
  },
  {
    id: 'job_manager',
    name: 'Job Manager',
    description: 'Manage job postings and applications',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    permissions: [
      'jobs.view', 'jobs.create', 'jobs.edit', 'jobs.publish',
      'users.view', 'users.message',
      'analytics.view'
    ]
  },
  {
    id: 'content_moderator',
    name: 'Content Moderator',
    description: 'Review and moderate job content',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    permissions: [
      'jobs.view', 'jobs.edit', 'jobs.publish',
      'users.view', 'users.suspend',
      'analytics.view'
    ]
  },
  {
    id: 'analyst',
    name: 'Data Analyst',
    description: 'Access analytics and generate reports',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    permissions: [
      'jobs.view',
      'users.view',
      'analytics.view', 'analytics.export'
    ]
  },
  {
    id: 'support',
    name: 'Support Agent',
    description: 'Basic user support and assistance',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    permissions: [
      'jobs.view',
      'users.view', 'users.message'
    ]
  }
]

// Mock admin users
export const ADMIN_USERS: AdminUser[] = [
  {
    id: '1',
    name: 'John Administrator',
    email: 'john@zapply.com',
    role: 'super_admin',
    status: 'active',
    lastLogin: '2024-01-20T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'sarah@zapply.com',
    role: 'job_manager',
    status: 'active',
    lastLogin: '2024-01-20T09:15:00Z',
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    id: '3',
    name: 'Mike Moderator',
    email: 'mike@zapply.com',
    role: 'content_moderator',
    status: 'active',
    lastLogin: '2024-01-19T16:45:00Z',
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '4',
    name: 'Lisa Analyst',
    email: 'lisa@zapply.com',
    role: 'analyst',
    status: 'inactive',
    lastLogin: '2024-01-18T14:20:00Z',
    createdAt: '2024-01-12T00:00:00Z'
  }
]

// Permission checking utilities
export const hasPermission = (userRole: string, permission: string): boolean => {
  const role = ROLES.find(r => r.id === userRole)
  return role ? role.permissions.includes(permission) : false
}

export const hasAnyPermission = (userRole: string, permissions: string[]): boolean => {
  return permissions.some(permission => hasPermission(userRole, permission))
}

export const getRolePermissions = (roleId: string): Permission[] => {
  const role = ROLES.find(r => r.id === roleId)
  if (!role) return []
  
  return PERMISSIONS.filter(p => role.permissions.includes(p.id))
}

export const getPermissionsByCategory = (permissions: Permission[]): Record<string, Permission[]> => {
  return permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = []
    }
    acc[permission.category].push(permission)
    return acc
  }, {} as Record<string, Permission[]>)
}
