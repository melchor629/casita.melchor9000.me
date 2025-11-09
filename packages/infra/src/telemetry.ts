import {
  context,
  diag,
  DiagLogLevel,
  metrics,
  propagation,
  trace,
  type Attributes,
  type ContextManager,
  type TextMapPropagator,
} from '@opentelemetry/api'
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks'
import { CompositePropagator, W3CTraceContextPropagator } from '@opentelemetry/core'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { registerInstrumentations, type Instrumentation } from '@opentelemetry/instrumentation'
import { FsInstrumentation } from '@opentelemetry/instrumentation-fs'
import { RuntimeNodeInstrumentation } from '@opentelemetry/instrumentation-runtime-node'
import { UndiciInstrumentation } from '@opentelemetry/instrumentation-undici'
import { containerDetector } from '@opentelemetry/resource-detector-container'
import {
  detectResources,
  envDetector,
  resourceFromAttributes,
  type ResourceDetector,
} from '@opentelemetry/resources'
import { MeterProvider, PeriodicExportingMetricReader, type ViewOptions } from '@opentelemetry/sdk-metrics'
import {
  AlwaysOnSampler,
  BasicTracerProvider,
  BatchSpanProcessor,
  RandomIdGenerator,
  type IdGenerator,
  type Sampler,
  type SpanLimits,
} from '@opentelemetry/sdk-trace-node'
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions'
import createLogger from './logger.ts'

const logLevelMap = {
  ALL: DiagLogLevel.ALL,
  VERBOSE: DiagLogLevel.VERBOSE,
  DEBUG: DiagLogLevel.DEBUG,
  INFO: DiagLogLevel.INFO,
  WARN: DiagLogLevel.WARN,
  ERROR: DiagLogLevel.ERROR,
  NONE: DiagLogLevel.NONE,
} satisfies Record<string, DiagLogLevel>

type TelemetryOptions = Readonly<{
  attributes?: Attributes
  contextManager?: ContextManager
  idGenerator?: IdGenerator
  instrumentations?: Instrumentation[]
  service: {
    name: string
    version?: string
  }
  endpoint: {
    url: URL | string
    compression?: 'none' | 'gzip'
  }
  spanLimits?: SpanLimits
  propagators?: TextMapPropagator[]
  resourceDetectors?: ResourceDetector[]
  views?: ViewOptions[]
  traceSampler?: Sampler

  disabled?: boolean
  logLevel?: keyof typeof logLevelMap | Lowercase<keyof typeof logLevelMap>
}>

function createContextManager(contextManager?: ContextManager) {
  if (contextManager == null) {
    diag.debug('Configuring default context manager')
    contextManager = new AsyncLocalStorageContextManager()
  }

  contextManager.enable()
  context.setGlobalContextManager(contextManager)
  return contextManager
}

export default function createTelemetry({
  disabled,
  logLevel,
  ...options
}: TelemetryOptions) {
  if (logLevel) {
    const logger = createLogger('@melchor629/infra/telemetry', 'trace')
    diag.setLogger({
      debug: (message, ...args) => logger.debug({}, message, ...args),
      error: (message, ...args) => logger.error({}, message, ...args),
      info: (message, ...args) => logger.info({}, message, ...args),
      verbose: (message, ...args) => logger.trace({}, message, ...args),
      warn: (message, ...args) => logger.warn({}, message, ...args),
    }, {
      logLevel: logLevelMap[logLevel.toUpperCase() as keyof typeof logLevelMap],
    })
  }

  if (disabled) {
    return
  }

  const contextManager = createContextManager(options.contextManager)
  const idGenerator = options.idGenerator ?? new RandomIdGenerator()

  let resource = resourceFromAttributes({
    [ATTR_SERVICE_NAME]: options.service.name,
    [ATTR_SERVICE_VERSION]: options.service.version,

    'node.env': process.env.NODE_ENV,

    ...options.attributes,
  })
  resource = resource.merge(detectResources({
    detectors: [
      envDetector,
      containerDetector,
      ...(options.resourceDetectors ?? []),
    ],
  }))

  const propagators = options.propagators ?? [new W3CTraceContextPropagator()]
  const traceSampler = options.traceSampler ?? new AlwaysOnSampler()

  const traceProvider = new BasicTracerProvider({
    resource,
    idGenerator,
    sampler: traceSampler,
    spanLimits: options.spanLimits,
    spanProcessors: [
      new BatchSpanProcessor(
        new OTLPTraceExporter({
          url: new URL('./v1/traces', options.endpoint.url).toString(),
          compression: options.endpoint.compression as never,
        }),
      ),
    ],
  })
  trace.setGlobalTracerProvider(traceProvider)
  propagation.setGlobalPropagator(new CompositePropagator({ propagators }))

  const meterProvider = new MeterProvider({
    resource,
    views: options.views ?? [],
    readers: [
      new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
          url: new URL('./v1/metrics', options.endpoint.url).toString(),
          compression: options.endpoint.compression as never,
        }),
      }),
    ],
  })
  metrics.setGlobalMeterProvider(meterProvider)

  const instrumentations = [
    new UndiciInstrumentation({
      enabled: true,
      requireParentforSpans: true,
    }),
    new FsInstrumentation({
      requireParentSpan: true,
    }),
    new RuntimeNodeInstrumentation({
      monitoringPrecision: 1000,
    }),
    ...(options.instrumentations ?? []),
  ]
  const disableInstrumentations = registerInstrumentations({
    instrumentations,
  })

  diag.info('Telemetry started')
  return Object.freeze({
    contextManager,
    traceProvider,
    meterProvider,
    [Symbol.asyncDispose]: async () => {
      diag.info('Shutting down telemetry')
      await Promise.all([
        meterProvider.shutdown(),
        traceProvider.shutdown(),
      ])

      contextManager.disable()
      disableInstrumentations()
      diag.info('Finished shutting down telemetry')
    },
  })
}
