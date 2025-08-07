"use client"

// Simple Firebase configuration without complex initialization
const firebaseConfig = {
  apiKey: "AIzaSyBpQPdqNKwt3te2ozQ2qbOVmwrnACAZXmo",
  authDomain: "zapply-7c4fc.firebaseapp.com",
  databaseURL: "https://zapply-7c4fc-default-rtdb.firebaseio.com",
  projectId: "zapply-7c4fc",
  storageBucket: "zapply-7c4fc.firebasestorage.app",
  messagingSenderId: "769225054547",
  appId: "1:769225054547:web:57b57b9c0a07ef3ca969a6",
  measurementId: "G-P15GTH2VB8"
}

// For now, we'll use a mock implementation to avoid Firebase initialization issues
// This allows the app to work without Firebase while we debug the connection

export const mockAuth = {
  currentUser: null,
  onAuthStateChanged: (callback: (user: any) => void) => {
    // Mock auth state - no user signed in
    callback(null)
    return () => {} // unsubscribe function
  }
}

export const mockDb = {
  collection: () => ({
    doc: () => ({
      set: async () => ({ success: true }),
      get: async () => ({ exists: false, data: () => null }),
      update: async () => ({ success: true })
    })
  })
}

// Export mock services for now
export const auth = mockAuth
export const db = mockDb

// Export config for future use
export { firebaseConfig }
export default { auth: mockAuth, db: mockDb }
