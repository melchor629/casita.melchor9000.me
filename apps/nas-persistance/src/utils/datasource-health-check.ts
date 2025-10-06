import type { HealthCheck } from '@melchor629/fastify-infra/health'
import type { DataSource } from 'typeorm'

const dataSourceHealthCheck: HealthCheck<DataSource> = async (dataSource) => {
  try {
    await dataSource.sql`SELECT 1`
    return {
      type: 'type-orm',
      status: 'healthy',
      data: {},
    }
  } catch (e) {
    return {
      type: 'type-orm',
      status: 'degraded',
      reason: (e as Error).message,
      data: {},
    }
  }
}

dataSourceHealthCheck.type = 'typeorm'

export default dataSourceHealthCheck
