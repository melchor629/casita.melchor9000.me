import type { HealthCheck } from '@melchor629/fastify-infra/health'
import { plexUrl } from '../../config.ts'
import { identity } from '../media/client/plex/client.ts'

const getPlexHealth: HealthCheck<void> = async () => {
  if (!plexUrl) {
    return {
      status: 'healthy',
      reason: 'Plex is not configured',
      data: {},
    }
  }

  try {
    const res = await identity()
    return {
      status: 'healthy',
      data: {
        version: res?.version,
      },
    }
  } catch (e) {
    return {
      status: 'degraded',
      reason: `Plex seem to be unavailable: ${(e as Error).message}`,
      data: {},
    }
  }
}

getPlexHealth.type = 'plex'

export default getPlexHealth
