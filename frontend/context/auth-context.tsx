"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    const token = localStorage.getItem("token")
    if (token) {
      api.setToken(token)
      // You might want to verify the token with backend here
      // For now, we'll just set a dummy user
      // In production, call /api/auth/me
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const userData = await api.login(email, password)
      setUser(userData)
      router.push("/dashboard")
      return true
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }, [router])

  const signup = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const userData = await api.signup(name, email, password)
      setUser(userData)
      router.push("/dashboard")
      return true
    } catch (error) {
      console.error("Signup failed:", error)
      return false
    }
  }, [router])

  const logout = useCallback(() => {
    setUser(null)
    api.removeToken()
    router.push("/")
  }, [router])

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading,
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}