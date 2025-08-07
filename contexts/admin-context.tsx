"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import { ADMIN_USERS, AdminUser, hasPermission, hasAnyPermission } from '@/lib/roles'

interface AdminContextType {
  currentAdmin: AdminUser | null
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  setCurrentAdmin: (admin: AdminUser | null) => void
}

const AdminContext = createContext<AdminContextType>({
  currentAdmin: null,
  hasPermission: () => false,
  hasAnyPermission: () => false,
  setCurrentAdmin: () => {}
})

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

interface AdminProviderProps {
  children: ReactNode
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  // For demo purposes, set the first admin as current
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(ADMIN_USERS[0])

  const checkPermission = (permission: string): boolean => {
    if (!currentAdmin) return false
    return hasPermission(currentAdmin.role, permission)
  }

  const checkAnyPermission = (permissions: string[]): boolean => {
    if (!currentAdmin) return false
    return hasAnyPermission(currentAdmin.role, permissions)
  }

  const value = {
    currentAdmin,
    hasPermission: checkPermission,
    hasAnyPermission: checkAnyPermission,
    setCurrentAdmin
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}
