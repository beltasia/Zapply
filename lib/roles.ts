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
  createdAt: string
  lastLogin: string
}

export const PERMISSIONS: Permission[] = [
  // Job Management
  { id: 'jobs.view', name: 'View Jobs', description: 'View job listings and details', category: 'Jobs' },
  { id: 'jobs.create', name: 'Create Jobs', description: 'Create new job postings', category: 'Jobs' },
  { id: 'jobs.edit', name: 'Edit Jobs', description: 'Modify existing job postings', category: 'Jobs' },
  { id: 'jobs.delete', name: 'Delete Jobs', description: 'Remove job postings', category: 'Jobs' },
  { id: 'jobs.publish', name: 'Publish Jobs', description: 'Publish and unpublish jobs', category: 'Jobs' },
  { id: 'jobs.moderate', name: 'Moderate Jobs', description: 'Review and approve job submissions', category: 'Jobs' },

  // User Management
  { id: 'users.view', name: 'View Users', description: 'View user profiles and information', category: 'Users' },
  { id: 'users.edit', name: 'Edit Users', description: 'Modify user profiles and settings', category: 'Users' },
  { id: 'users.suspend', name: 'Suspend Users', description: 'Suspend or ban user accounts', category: 'Users' },
  { id: 'users.delete', name: 'Delete Users', description: 'Permanently delete user accounts', category: 'Users' },
  { id: 'users.impersonate', name: 'Impersonate Users', description: 'Login as other users for support', category: 'Users' },

  // Analytics
  { id: 'analytics.view', name: 'View Analytics', description: 'Access platform analytics and reports', category: 'Analytics' },
  { id: 'analytics.export', name: 'Export Data', description: 'Export analytics data and reports', category: 'Analytics' },

  // Settings
  { id: 'settings.view', name: 'View Settings', description: 'View system configuration', category: 'Settings' },
  { id: 'settings.edit', name: 'Edit Settings', description: 'Modify system settings', category: 'Settings' },
  { id: 'settings.scraping', name: 'Manage Scraping', description: 'Configure job scraping sources', category: 'Settings' },

  // Admin Management
  { id: 'admins.view', name: 'View Admins', description: 'View admin user accounts', category: 'Admin Management' },
  { id: 'admins.create', name: 'Create Admins', description: 'Create new admin accounts', category: 'Admin Management' },
  { id: 'admins.edit', name: 'Edit Admins', description: 'Modify admin user accounts', category: 'Admin Management' },
  { id: 'admins.delete', name: 'Delete Admins', description: 'Remove admin user accounts', category: 'Admin Management' },
  { id: 'roles.manage', name: 'Manage Roles', description: 'Create and modify admin roles', category: 'Admin Management' },

  // Security & Audit
  { id: 'audit.view', name: 'View Audit Logs', description: 'Access system audit logs and activity', category: 'Security' },
  { id: 'security.manage', name: 'Manage Security', description: 'Configure security settings and policies', category: 'Security' }
]

export const ROLES: Role[] = [
  {
    id: 'super_admin',
    name: 'Super Administrator',
    description: 'Full system access with all permissions',
    permissions: PERMISSIONS.map(p => p.id),
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  },
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full job and user management access',
    permissions: [
      'jobs.view', 'jobs.create', 'jobs.edit', 'jobs.delete', 'jobs.publish', 'jobs.moderate',
      'users.view', 'users.edit', 'users.suspend',
      'analytics.view', 'analytics.export',
      'settings.view', 'settings.edit',
      'audit.view'
    ],
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  },
  {
    id: 'job_manager',
    name: 'Job Manager',
    description: 'Manage job postings and applications',
    permissions: [
      'jobs.view', 'jobs.create', 'jobs.edit', 'jobs.publish', 'jobs.moderate',
      'analytics.view'
    ],
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  },
  {
    id: 'content_moderator',
    name: 'Content Moderator',
    description: 'Review and moderate job content',
    permissions: [
      'jobs.view', 'jobs.edit', 'jobs.moderate',
      'users.view'
    ],
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
  },
  {
    id: 'data_analyst',
    name: 'Data Analyst',
    description: 'Access analytics and generate reports',
    permissions: [
      'jobs.view',
      'users.view',
      'analytics.view', 'analytics.export'
    ],
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  },
  {
    id: 'support_agent',
    name: 'Support Agent',
    description: 'Basic user support and assistance',
    permissions: [
      'jobs.view',
      'users.view', 'users.edit'
    ],
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
]

export const ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin_1',
    name: 'John Smith',
    email: 'john@zapply.com',
    role: 'super_admin',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: new Date().toISOString()
  },
  {
    id: 'admin_2',
    name: 'Sarah Johnson',
    email: 'sarah@zapply.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-02T00:00:00Z',
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'admin_3',
    name: 'Mike Wilson',
    email: 'mike@zapply.com',
    role: 'job_manager',
    status: 'active',
    createdAt: '2024-01-03T00:00:00Z',
    lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'admin_4',
    name: 'Lisa Brown',
    email: 'lisa@zapply.com',
    role: 'data_analyst',
    status: 'active',
    createdAt: '2024-01-04T00:00:00Z',
    lastLogin: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'admin_5',
    name: 'David Chen',
    email: 'david@zapply.com',
    role: 'support_agent',
    status: 'inactive',
    createdAt: '2024-01-05T00:00:00Z',
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
]

export function getPermissionsByCategory(permissions: Permission[]): Record<string, Permission[]> {
  return permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = []
    }
    acc[permission.category].push(permission)
    return acc
  }, {} as Record<string, Permission[]>)
}

export function hasPermission(userRole: string, requiredPermission: string): boolean {
  const role = ROLES.find(r => r.id === userRole)
  return role ? role.permissions.includes(requiredPermission) : false
}

export function hasAnyPermission(userRole: string, requiredPermissions: string[]): boolean {
  return requiredPermissions.some(permission => hasPermission(userRole, permission))
}

export function hasAllPermissions(userRole: string, requiredPermissions: string[]): boolean {
  return requiredPermissions.every(permission => hasPermission(userRole, permission))
}
