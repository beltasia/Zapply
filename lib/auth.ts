export interface UserProfile {
  uid: string
  email: string
  name: string
  phone?: string
  location?: string
  skills: string[]
  experience: string
  education: string
  resume?: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthResult {
  success: boolean
  user?: any
  error?: string
}

// Mock authentication functions for development
export const signUp = async (
  email: string, 
  password: string, 
  name: string,
  phone?: string,
  location?: string
): Promise<AuthResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock successful signup
  const mockUser = {
    uid: `user_${Date.now()}`,
    email,
    displayName: name,
    photoURL: null
  }
  
  return { success: true, user: mockUser }
}

export const signIn = async (email: string, password: string): Promise<AuthResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock validation
  if (email === "demo@zapply.com" && password === "demo123") {
    const mockUser = {
      uid: "demo_user",
      email,
      displayName: "Demo User",
      photoURL: null
    }
    return { success: true, user: mockUser }
  }
  
  return { success: false, error: "Invalid email or password" }
}

export const logOut = async (): Promise<AuthResult> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return { success: true }
}

export const resetPassword = async (email: string): Promise<AuthResult> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return { success: true }
}

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  // Mock user profile
  if (uid === "demo_user") {
    return {
      uid,
      email: "demo@zapply.com",
      name: "Demo User",
      phone: "+263 77 123 4567",
      location: "Harare",
      skills: ["JavaScript", "React", "Node.js"],
      experience: "3 years of software development experience",
      education: "Bachelor's in Computer Science",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
  return null
}

export const updateUserProfile = async (
  uid: string, 
  updates: Partial<UserProfile>
): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return true
}
