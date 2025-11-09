import { type Span, type Tracer, trace } from '@opentelemetry/api'
import {
  Job, type Processor, Worker, type WorkerOptions,
} from 'bullmq'
import { BullMQOtel } from 'bullmq-otel'
import packageJson from '../../package.json' with { type: 'json' }
import { redisUrl } from '../config.ts'
import { redisPrefix } from '../core-logic/jobs/constants.ts'
import { addCloseableHandler } from '../utils/stop-signal.ts'

export type TracingContext = {
  span: Span | undefined
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
    const span = trace.getActiveSpan()
    span?.setAttribute('bullmq.job-id', job.id ?? '')
    span?.setAttribute('bullmq.job-token', token ?? '')
    span?.setAttribute('bullmq.job-name', name)
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
  telemetry: new BullMQOtel('nas-fs-worker', packageJson.version),
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
