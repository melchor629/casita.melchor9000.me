export type HealthCheckStatus = 'healthy' | 'degraded' | 'unhealthy'

export type HealthCheckResult = Readonly<{
  status: HealthCheckStatus
  reason?: string
  data: Record<string, unknown>
}>

export type HealthCheckResponse = Readonly<{
  status: HealthCheckStatus
  duration: number
  checks: Record<string, HealthCheckResult & { readonly duration: number; readonly type: string }>
}>

export type HealthCheckParams = object | void

export type HealthCheckFn<T extends HealthCheckParams> = (
  params: T,
  signal: AbortSignal,
) => Promise<HealthCheckResult>

export type HealthCheck<T extends HealthCheckParams> = HealthCheckFn<T> & {
  type: string
}

export type HealthCheckEntry<T extends HealthCheckParams = HealthCheckParams> = Readonly<{
  key: string
  params: T
  fn: HealthCheck<T>
  failureAs?: HealthCheckStatus
}>
