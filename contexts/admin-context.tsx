"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { ADMIN_USERS, AdminUser } from '@/lib/roles'

interface AdminContextType {
  currentAdmin: AdminUser | null
  setCurrentAdmin: (admin: AdminUser | null) => void
  isLoading: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // For demo purposes, set the first admin as current admin
    // In a real app, this would be based on authentication
    const admin = ADMIN_USERS[0]
    setCurrentAdmin(admin)
    setIsLoading(false)
  }, [])

  return (
    <AdminContext.Provider value={{
      currentAdmin,
      setCurrentAdmin,
      isLoading
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
