"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface PostViewTrackerProps {
  postId: string
}

export function PostViewTracker({ postId }: PostViewTrackerProps) {
  useEffect(() => {
    const supabase = createClient()
    const incrementView = async () => {
      const { error } = await supabase.rpc("increment_post_view", { post_id: postId })
      if (error) {
        console.error("Error incrementing post view count:", error.message)
      }
    }
    incrementView()
  }, [postId])

  return null // Este componente não renderiza nada na tela.
}