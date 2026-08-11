'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Legacy login route — redirects to main page.
 * Since v0.3, the splash/login flow is integrated into the root page.
 */
export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/')
  }, [router])

  return null
}
