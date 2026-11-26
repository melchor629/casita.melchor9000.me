import { useEffect, useEffectEvent, useRef } from 'react'
import { openFileSystemEvents } from '../api/fs'
import FSEvents from '../api/fs/fs-events'
import * as Path from '../utils/path'
import { useStorageMetadata } from './api/use-storage-metadata'
import useApiClient from './use-api-client'

export default function useMetadata(module: string, path: string) {
  const apiClient = useApiClient()
  const { data: metadata, error, isFetching, refetch } = useStorageMetadata(module, path)
  const sseRef = useRef<FSEvents>(null!)

  const handleEvent = useEffectEvent(({ path: eventPath }: { path: string }) => {
    if (eventPath === Path.join('/', path)) {
      void refetch()
    }
  })

  useEffect(() => {
    const sse = openFileSystemEvents(module, apiClient)
    sseRef.current = sse

    sse.on('error', () => {
      if (sse.state === 'closed') {
        setTimeout(() => sse.reconnect(), 2_500)
      }
    })

    sse
      .on('add', handleEvent)
      .on('addDir', handleEvent)
      .on('change', handleEvent)
      .on('unlink', handleEvent)
      .on('unlinkDir', handleEvent)

    if (sse.state === 'closed') {
      sse.reconnect()
    }

    return () => {
      sse.close()
    }
  }, [module, apiClient])

  return {
    metadata: metadata || null,
    loading: isFetching,
    error,
  }
}
