import { authApiBaseUrl } from '../../config.ts'
import type { AuthHealthCheck, HealthCheck } from '../../models/health/index.ts'

const getAuthServerHealth = async (token?: string): Promise<AuthHealthCheck> => {
  let request: { headers: { Authorization: string } } | undefined
  if (token) {
    request = { headers: { Authorization: token } }
  }

  const startTime = Date.now()
  try {
    const res = await fetch(`${authApiBaseUrl}/health`, request)
    const duration = Date.now() - startTime
    if (!res.headers.get('content-type')?.startsWith('application/json')) {
      return {
        status: 'unhealthy',
        reason: 'Auth API returned invalid status',
        statusCode: res.status,
        body: await res.text(),
        duration,
      }
    }

    const data = (await res.json()) as HealthCheck
    return {
      status: data.status || 'degraded',
      duration,
    }
  } catch (e) {
    const duration = Date.now() - startTime
    return {
      status: 'unhealthy',
      reason: 'Auth API is unavailable',
      body: (e as Error).message,
      duration,
    }
  }
}

export default getAuthServerHealth
