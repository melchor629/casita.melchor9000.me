import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { type PropsWithChildren, useLayoutEffect } from 'react'
import queryClient from '../hooks/api/query-client'
import useApiClient from '../hooks/use-api-client'

const localStoragePersister = createAsyncStoragePersister({
  storage: window.localStorage,
  throttleTime: 5_000,
  key: 'nas-web:queries',
})

window.localStorage.removeItem('nas-web:swr')

const NasQueryConfig = ({ children }: PropsWithChildren) => {
  const apiClient = useApiClient()

  useLayoutEffect(() => {
    queryClient.setQueryDefaults(['api-client'], {
      staleTime: Infinity,
      gcTime: Infinity,
    })
    queryClient.setQueryData(['api-client'], apiClient)
  }, [apiClient])

  return (
    <QueryClientProvider client={queryClient}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: localStoragePersister,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        }}
      >
        {children}
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </PersistQueryClientProvider>
    </QueryClientProvider>
  )
}

export default NasQueryConfig
