import { plexUrl } from '../../config.ts'
import type { PlexHealthCheck } from '../../models/health/plex-health-check.ts'
import { identity } from '../media/client/plex/client.ts'

const getPlexHealth = async (): Promise<PlexHealthCheck> => {
  if (!plexUrl) {
    return {
      status: 'healthy',
      reason: 'Plex is not configured',
      duration: 0,
    }
  }

  const startTime = Date.now()
  try {
    const res = await identity()
    const duration = Date.now() - startTime
    return {
      status: 'healthy',
      version: res?.version,
      duration,
    }
  } catch (e) {
    const duration = Date.now() - startTime
    return {
      status: 'degraded',
      reason: `Plex seem to be unavailable: ${(e as Error).message}`,
      duration,
    }
  }
}

export default getPlexHealth
