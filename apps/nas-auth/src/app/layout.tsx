import { useNavigationStatus } from '@melchor629/nice-ssr'
import { CircularProgress } from '@melchor629/ui'
import { clsx } from 'clsx'
import type { PropsWithChildren } from 'react'
import ClientProvider from '#actions/client-provider.tsx'

export default function Layout({ children }: PropsWithChildren) {
  const status = useNavigationStatus()
  return (
    <ClientProvider>
      <div
        className={clsx(
          'absolute top-1 left-[calc(50%-10px)] transition',
          'opacity-0',
          status === 'navigating' && 'opacity-100',
        )}
      >
        <CircularProgress size="medium" />
      </div>
      {children}
    </ClientProvider>
  )
}
