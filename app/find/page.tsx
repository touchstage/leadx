"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function FindPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the unified ask page
    router.replace('/ask')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900 mx-auto"></div>
        <p className="mt-2 text-stone-600">Redirecting...</p>
          </div>
        </div>
  )
}