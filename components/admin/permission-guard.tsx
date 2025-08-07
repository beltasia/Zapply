"use client"

import { ReactNode } from 'react'
import { useAdmin } from '@/contexts/admin-context'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield } from 'lucide-react'

interface PermissionGuardProps {
  permission?: string
  permissions?: string[]
  requireAll?: boolean
  children: ReactNode
  fallback?: ReactNode
}

export default function PermissionGuard({ 
  permission, 
  permissions = [], 
  requireAll = false,
  children, 
  fallback 
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission } = useAdmin()

  let hasAccess = false

  if (permission) {
    hasAccess = hasPermission(permission)
  } else if (permissions.length > 0) {
    if (requireAll) {
      hasAccess = permissions.every(p => hasPermission(p))
    } else {
      hasAccess = hasAnyPermission(permissions)
    }
  } else {
    hasAccess = true // No permissions required
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>
    }
    
    return (
      <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access this feature.
        </AlertDescription>
      </Alert>
    )
  }

  return <>{children}</>
}
