import { useNavigationStatus } from '@melchor629/nice-ssr'
import { clsx } from 'clsx'
import type { PropsWithChildren } from 'preact/compat'
import ClientProvider from '#actions/client-provider.tsx'
import { LoadingSpinner } from '#components/ui/index.ts'

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
        <LoadingSpinner size="md" />
      </div>
      {children}
    </ClientProvider>
  )
}
