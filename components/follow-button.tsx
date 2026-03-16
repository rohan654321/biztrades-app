"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus, UserCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiFetch } from "@/lib/api"

interface FollowButtonProps {
  userId: string
  currentUserId?: string
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
}

export function FollowButton({ userId, currentUserId, variant = "default", size = "default" }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Check if already following on mount (backend)
  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const data = await apiFetch<{ isFollowing?: boolean }>(
          `/api/follow/${userId}${currentUserId ? `?currentUserId=${currentUserId}` : ""}`,
          { auth: !!currentUserId }
        )
        setIsFollowing(!!data?.isFollowing)
      } catch (error) {
        console.error("[FollowButton] Error checking follow status:", error)
      }
    }

    if (userId && currentUserId && userId !== currentUserId) {
      checkFollowStatus()
    }
  }, [userId, currentUserId])

  const handleFollow = async () => {
    if (!currentUserId) {
      toast({
        title: "Authentication required",
        description: "Please log in to follow exhibitors",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      if (isFollowing) {
        await apiFetch(`/api/follow/${userId}`, { method: "DELETE", auth: true })
        setIsFollowing(false)
        toast({
          title: "Unfollowed",
          description: "You have unfollowed this exhibitor",
        })
      } else {
        await apiFetch(`/api/follow/${userId}`, { method: "POST", auth: true })
        setIsFollowing(true)
        toast({
          title: "Following",
          description: "You are now following this exhibitor",
        })
      }
    } catch (error) {
      console.error("[FollowButton] Error toggling follow:", error)
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Don't show button if viewing own profile
  if (userId === currentUserId) {
    return null
  }

  return (
<button
  onClick={handleFollow}
  disabled={isLoading}
  className={` py-2 rounded-md font-medium ${
    isFollowing
      ? "border border-gray-300 text-gray-700 bg-white hover:bg-gray-100"
      : "text-blue-600"
  }`}
>
  {isFollowing ? "Following" : "Follow"}
</button>

  )
}
