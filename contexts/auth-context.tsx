"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getUserProfile, UserProfile } from '@/lib/auth'

interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  error: string | null
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  error: null,
  refreshProfile: async () => {}
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshProfile = async () => {
    if (user) {
      try {
        const profile = await getUserProfile(user.uid)
        setUserProfile(profile)
        setError(null)
      } catch (err) {
        console.error('Error refreshing profile:', err)
        setError('Failed to load user profile')
      }
    }
  }

  useEffect(() => {
    // Mock auth state change
    const initAuth = async () => {
      try {
        // Simulate checking for existing session
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // For demo purposes, you can uncomment the lines below to simulate a logged-in user
        // const demoUser = {
        //   uid: "demo_user",
        //   email: "demo@zapply.com",
        //   displayName: "Demo User",
        //   photoURL: null
        // }
        // setUser(demoUser)
        // const profile = await getUserProfile(demoUser.uid)
        // setUserProfile(profile)
        
        setError(null)
      } catch (err) {
        console.error('Auth initialization error:', err)
        setError('Authentication service unavailable')
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const value = {
    user,
    userProfile,
    loading,
    error,
    refreshProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
