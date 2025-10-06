import type { HealthCheck, HealthCheckResponse } from '../types.ts'

type ExternalHealthCheckOptions = {
  url: URL
  headers?: Headers | Record<string, string>
}

const externalHealthCheck: HealthCheck<ExternalHealthCheckOptions> = async ({ headers, url }, signal) => {
  try {
    const res = await fetch(new URL('./health', url), {
      headers,
      signal,
    })
    if (!res.headers.get('content-type')?.startsWith('application/json')) {
      return {
        status: 'unhealthy',
        reason: 'Service returned invalid status',
        data: {
          statusCode: res.status,
          body: await res.text(),
        },
      }
    }

    const data = (await res.json()) as HealthCheckResponse
    return {
      status: data.status || 'degraded',
      data: {
        statusCode: res.status,
        body: data,
      },
    }
  } catch (e) {
    return {
      status: 'unhealthy',
      reason: 'Service is unavailable',
      body: (e as Error).message,
      data: {},
    }
  }
}

externalHealthCheck.type = 'external'

export default externalHealthCheck
