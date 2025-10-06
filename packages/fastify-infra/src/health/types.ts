export type HealthCheckStatus = 'healthy' | 'degraded' | 'unhealthy'

export type HealthCheckResult = Readonly<{
  status: HealthCheckStatus
  reason?: string
  data: Record<string, unknown>
}>

export type HealthCheckResponse = Readonly<{
  status: HealthCheckStatus
  duration: number
  checks: Record<string, HealthCheckResult & { readonly duration: number, readonly type: string }>
}>

export type HealthCheck<T> = ((params: T, signal: AbortSignal) => Promise<HealthCheckResult>) & {
  type: string
}

export type HealthCheckEntry<T = unknown> = Readonly<{
  key: string
  params: T
  fn: HealthCheck<T>
  failureAs?: HealthCheckStatus
}>
