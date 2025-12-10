import { useEffect, useRef } from 'react'
import { openFileSystemEvents } from '../api/fs'
import FSEvents from '../api/fs/fs-events'
import * as Path from '../utils/path'
import { useStorageMetadata } from './api/use-storage-metadata'
import useApiClient from './use-api-client'

export default function useMetadata(module: string, path: string) {
  const apiClient = useApiClient()
  const {
    data: metadata,
    error,
    isFetching,
    refetch,
  } = useStorageMetadata(module, path)
  const sseRef = useRef<FSEvents>(null!)

  useEffect(() => {
    const sse = openFileSystemEvents(module, apiClient)
    sseRef.current = sse

    sse.on('error', () => {
      if (sse.state === 'closed') {
        setTimeout(() => sse.reconnect(), 2_500)
      }
    })

    if (sse.state === 'closed') {
      sse.reconnect()
    }

    return () => {
      sse.close()
    }
  }, [module, apiClient])

  useEffect(() => {
    const isCurrentPath = (eventPath: string) => (
      eventPath === Path.join('/', path)
    )

    const reloadEvent = (event: { path: string }) => {
      if (isCurrentPath(event.path)) {
        void refetch()
      }
    }

    const removedEvent = (event: { path: string }) => {
      if (isCurrentPath(event.path)) {
        void refetch()
      }
    }

    sseRef.current
      .on('add', reloadEvent)
      .on('addDir', reloadEvent)
      .on('change', reloadEvent)
      .on('unlink', removedEvent)
      .on('unlinkDir', removedEvent)

    return () => {
      sseRef.current
        .off('add', reloadEvent)
        .off('addDir', reloadEvent)
        .off('change', reloadEvent)
        .off('unlink', removedEvent)
        .off('unlinkDir', removedEvent)
    }
  }, [apiClient, module, path, refetch])

  return {
    metadata: metadata || null,
    loading: isFetching,
    error,
  }
}
