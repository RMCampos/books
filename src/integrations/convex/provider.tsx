import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { useAuth } from '@clerk/react'

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL as string
if (!CONVEX_URL) {
  throw new Error('Missing VITE_CONVEX_URL — add it to .env.local')
}

const convex = new ConvexReactClient(CONVEX_URL)

export default function AppConvexProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // During SSR, @clerk/react's useAuth isn't available (no client-side Clerk init).
  // Use a plain provider so the server render succeeds.
  // ConvexProviderWithClerk takes over on the client and attaches Clerk JWTs.
  if (import.meta.env.SSR) {
    return <ConvexProvider client={convex}>{children}</ConvexProvider>
  }

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  )
}
