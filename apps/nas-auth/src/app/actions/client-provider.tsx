import { QueryClientProvider } from '@tanstack/react-query'
// eslint-disable-next-line import-x/no-extraneous-dependencies
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { RenderableProps } from 'preact'
import getQueryClient from './client.ts'

export default function ClientProvider({ children }: RenderableProps<object>) {
  // value will depend if it is in the server or the client. avoid using
  // useState as it will break in suspense boundaries.
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}
