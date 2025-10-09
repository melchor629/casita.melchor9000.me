import type { HealthCheck } from '@melchor629/fastify-infra/health'

type PrismaClient = {
  $queryRaw<T = unknown>(query: TemplateStringsArray, ...values: unknown[]): Promise<T>;
}

const dataSourceHealthCheck: HealthCheck<PrismaClient> = async (dataSource) => {
  try {
    await dataSource.$queryRaw`SELECT 1`
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
