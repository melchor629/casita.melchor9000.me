import { type Span, type Tracer, trace } from '@opentelemetry/api'
import {
  Job, type Processor, Worker, type WorkerOptions,
} from 'bullmq'
import { redisUrl } from '../../../config.ts'
import { addCloseableHandler } from '../../../utils/stop-signal.ts'
import { redisPrefix } from '../constants.ts'

export type TracingContext = {
  span: Span
  tracer: Tracer
  createSpan<T>(this: void, name: string, fn: () => Promise<T>): Promise<T>
}

type ProcessorWithSpan<DataType, ResultType, NameType extends string> = (
  job: Job<DataType, ResultType, NameType>,
  token: string | undefined,
  tracing: TracingContext,
) => Promise<ResultType>

const jobTracer = trace.getTracer('bullmq-worker')
function decorateProcessor<DataType, ResultType, NameType extends string>(
  name: string,
  processor: ProcessorWithSpan<DataType, ResultType, NameType>,
): Processor<DataType, ResultType, NameType> {
  return async function decorated(job, token) {
    return jobTracer.startActiveSpan(
      `job ${name}`,
      {
        kind: 4, // consumer
        root: true,
        attributes: {
          'bullmq.job-id': job.id,
          'bullmq.job-token': token,
          'bullmq.job-name': name,
        },
      },
      async (span) => {
        try {
          span.setStatus({ code: 1 })
          return await processor(job, token, {
            span,
            tracer: jobTracer,
            async createSpan(name2, fn) {
              return jobTracer.startActiveSpan(name2, async (subSpan) => {
                try {
                  return await fn()
                } finally {
                  subSpan.end()
                }
              })
            },
          })
        } catch (e) {
          span.setStatus({ code: 2 }).recordException(e as Error)
          throw e
        } finally {
          span.end()
        }
      },
    )
  }
}

const redisUrlUrl = new URL(redisUrl!)

const baseOptions: WorkerOptions = {
  connection: {
    host: redisUrlUrl.host,
    port: redisUrlUrl.port ? parseInt(redisUrlUrl.port, 10) : undefined,
    db: parseInt(redisUrlUrl.pathname.substring(1) || '0', 10),
    username: redisUrlUrl.username,
    password: redisUrlUrl.password,
    maxRetriesPerRequest: null,
    enableOfflineQueue: true,
    retryStrategy: (times) => Math.max(Math.min(Math.exp(times), 30_000), 1_000),
  },
  prefix: redisPrefix,
}

export default class BaseWorker<
  DataType = unknown,
  ResultType = unknown,
  NameType extends string = string,
> extends Worker<DataType, ResultType, NameType> {
  constructor(
    name: string,
    processor: ProcessorWithSpan<DataType, ResultType, NameType>,
    opts?: Omit<WorkerOptions, 'connection' | 'prefix'>,
  ) {
    super(name, decorateProcessor(name, processor), { ...baseOptions, ...opts })
    addCloseableHandler(`bullmq:worker:${name}`, () => this.close())
  }
}
