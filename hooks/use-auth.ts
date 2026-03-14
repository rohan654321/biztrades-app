"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  getAccessToken,
  getCurrentUserId,
  getCurrentUserRole,
  getCurrentUserPermissions,
  isAuthenticated,
  clearTokens,
} from "@/lib/api"

export type UseAuthOptions = {
  /** If true, redirect to /login when no token. Default true for protected pages. */
  requireAuth?: boolean
  /** If set, redirect to redirectTo when user role is not in this list. */
  allowedRoles?: string[]
}

export function useAuth(options: UseAuthOptions = {}) {
  const { requireAuth = false, allowedRoles } = options
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const token = typeof window !== "undefined" ? getAccessToken() : null
  const userId = typeof window !== "undefined" ? getCurrentUserId() : null
  const role = typeof window !== "undefined" ? getCurrentUserRole() : null
  const permissions = typeof window !== "undefined" ? getCurrentUserPermissions() : []
  const authenticated = !!token

  useEffect(() => {
    if (typeof window === "undefined") return
    setLoading(false)
    if (!requireAuth) return
    if (!token) {
      router.replace("/login")
      return
    }
    if (allowedRoles?.length && role) {
      const roleUpper = role.toUpperCase()
      const allowed = allowedRoles.map((r) => r.toUpperCase())
      if (!allowed.includes(roleUpper)) {
        router.replace("/login")
      }
    }
  }, [requireAuth, token, role, allowedRoles, router])

  const logout = () => {
    clearTokens()
    router.replace("/login")
  }

  return {
    token,
    userId,
    role,
    permissions,
    authenticated,
    loading,
    logout,
  }
}
