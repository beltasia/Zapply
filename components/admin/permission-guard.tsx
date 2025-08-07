"use client"

import { ReactNode } from 'react'
import { useAdmin } from '@/contexts/admin-context'
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@/lib/roles'

interface PermissionGuardProps {
  children: ReactNode
  permission?: string
  permissions?: string[]
  requireAll?: boolean
  fallback?: ReactNode
}

export default function PermissionGuard({ 
  children, 
  permission, 
  permissions, 
  requireAll = false,
  fallback = null 
}: PermissionGuardProps) {
  const { currentAdmin, isLoading } = useAdmin()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!currentAdmin) {
    return fallback
  }

  let hasAccess = false

  if (permission) {
    hasAccess = hasPermission(currentAdmin.role, permission)
  } else if (permissions) {
    hasAccess = requireAll 
      ? hasAllPermissions(currentAdmin.role, permissions)
      : hasAnyPermission(currentAdmin.role, permissions)
  } else {
    hasAccess = true // No permission requirements
  }

  return hasAccess ? <>{children}</> : fallback
}
