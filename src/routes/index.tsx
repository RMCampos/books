import { createFileRoute } from '@tanstack/react-router'
import { useConvexAuth, useQuery } from 'convex/react'
import { RedirectToSignIn, UserButton } from '@clerk/react'
import { useState, useEffect } from 'react'
import { api } from '../../convex/_generated/api'
import { WishlistPage } from '../components/WishlistPage'

export const Route = createFileRoute('/')({ component: Home })

// SSR renders this shell. After hydration, Dashboard takes over client-side.
function Home() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    )
  }

  return <Dashboard />
}

// All Convex and Clerk hooks live here — never called during SSR.
function Dashboard() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const user = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : 'skip',
  )

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <RedirectToSignIn />
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Bookshelf</h1>
          <UserButton />
        </div>
        <p className="mt-2 text-muted-foreground">
          Welcome, {user?.name ?? user?.email ?? 'reader'}.
        </p>
        <WishlistPage />
      </div>
    </div>
  )
}
