import events from 'events'
import { type Attributes, type Span, type Tracer, trace } from '@opentelemetry/api'
import {
  ATTR_SERVER_ADDRESS,
  ATTR_SERVER_PORT,
} from '@opentelemetry/semantic-conventions'
import {
  ATTR_DB_NAMESPACE,
} from '@opentelemetry/semantic-conventions/incubating'
import Redis from 'ioredis'

import parentLogger from '../logger.ts'
import type { Cache } from './cache.ts'
import RedisSubscriptorListener from './redis-subscriptor-listener.ts'
import type { SubscriptorListener } from './subscriptor-listener.ts'

const logger = parentLogger.child({ module: 'cache.redis-cache' })

export default class RedisCache implements Cache {
  public readonly client: Redis.default

  private readonly keyPrefix: string

  private readonly tracer: Tracer

  constructor(client: Redis.Redis, keyPrefix: string = '') {
    this.client = client
    this.keyPrefix = keyPrefix.replace(/:$/, '')
    logger.debug(`Created redis cache with keyPrefix ${this.keyPrefix}`)
    this.client.on('error', (e) => logger.error(e))
    this.tracer = trace.getTracer('redis-cache')
  }

  public async get<T>(key: string): Promise<T | null> {
    logger.trace({ op: 'get', key }, `get operation with key ${key}`)
    const res = await this.trace('get', { key }, () => this.client.get(this.key(key)))
    return res ? JSON.parse(res) as T : null
  }

  public async set<T>(key: string, value: T, expiration?: number): Promise<void> {
    if (expiration) {
      logger.trace({ op: 'set', key, expiration }, `set operation with key ${key} and expiration ${expiration}`)
      await this.trace(
        'set px',
        { key, expiration },
        () => this.client.set(this.key(key), JSON.stringify(value), 'PX', expiration),
      )
    } else {
      logger.trace({ op: 'set', key }, `set operation with key ${key}`)
      await this.trace(
        'set',
        { key },
        () => this.client.set(this.key(key), JSON.stringify(value)),
      )
    }
  }

  public async setIfNotExists<T>(key: string, value: T): Promise<boolean> {
    logger.trace({ op: 'setIfNotExists', key }, `setIfNotExists with key ${key}`)
    const result = await this.trace(
      'setnx',
      { key },
      () => this.client.setnx(this.key(key), JSON.stringify(value)),
    )
    return result === 1
  }

  public async remove(...keys: string[]): Promise<number> {
    if (keys.length > 0) {
      logger.trace({ op: 'remove', keys }, `remove operation with keys ${keys.join(', ')}`)
      return this.trace(
        'del',
        { keys },
        () => this.client.del(...(keys.map((key) => this.key(key)))),
      )
    }
    return Promise.resolve(0)
  }

  public async exists(key: string): Promise<boolean> {
    logger.trace({ op: 'exists', key }, `exists operation with key ${key}`)
    const result = await this.trace(
      'exists',
      { key },
      () => this.client.exists(this.key(key)),
    )
    return result === 1
  }

  public async getKeys(pattern: string): Promise<string[]> {
    logger.trace({ op: 'getKeys', pattern }, `getKeys operation with pattern ${pattern}`)
    return this.trace(
      'getKeys',
      { pattern },
      async () => {
        const keys = []
        for await (const key of this.getKeysIterator(pattern, 100)) {
          keys.push(...key)
        }
        return keys
      },
    )
  }

  public async * getKeysIterator(pattern: string, count: number = 10) {
    logger.trace({ op: 'getKeysIterator', pattern, count }, `getKeysIterator operation with pattern ${pattern}`)
    for await (const itKeys of this.client.scanStream({ match: this.key(pattern), count })) {
      yield (itKeys as string[]).map((key) => key.replace(this.key(''), ''))
    }
  }

  public async expire(key: string, expiration?: number): Promise<boolean> {
    logger.trace({ op: 'expire', key, expiration }, `expire operation with key ${key}`)
    if (expiration !== undefined) {
      return (await this.trace(
        'pexpire',
        { key, expiration },
        () => this.client.pexpire(this.key(key), expiration),
      )) === 1
    }
    return (await this.trace(
      'persist',
      { key, expiration },
      () => this.client.persist(this.key(key)),
    )) === 1
  }

  public async publish<T>(channel: string, value: string | T): Promise<boolean> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value)
    logger.trace({ op: 'publish', channel, value }, `publish operation to channel ${channel}`)
    const n = await this.trace(
      'publish',
      { channel },
      () => this.client.publish(this.key(channel), stringValue),
    )
    return n > 0
  }

  public async multipleGet<T>(...keys: string[]): Promise<Array<T | null>> {
    if (!keys.length) {
      return Promise.resolve([])
    }

    const expandedKeys = keys.map((key) => this.key(key))
    logger.trace({ op: 'multipleGet', keys }, `multipleGet operation with keys ${keys.join(',')}`)
    const values = await this.trace(
      'mget',
      { keys },
      () => this.client.mget(...expandedKeys),
    )
    return values.map((value) => (value !== null ? JSON.parse(value) as T : null))
  }

  public async createSubscriptor(signal?: AbortSignal): Promise<SubscriptorListener> {
    const newConnection = this.client.duplicate()
    await events.once(newConnection, 'ready')
    return new RedisSubscriptorListener(newConnection, this.key.bind(this), signal)
  }

  private key(key: string): string {
    return `${this.keyPrefix}:${key}`
  }

  private trace<T>(key: string, attributes: Attributes, fn: (span: Span) => Promise<T> | T) {
    return this.tracer.startActiveSpan(
      key,
      {
        attributes: {
          ...attributes,
          keyPrefix: this.keyPrefix,
          [ATTR_DB_NAMESPACE]: this.client.condition?.select
            ?? this.client.options.db
            ?? 0,
          [ATTR_SERVER_ADDRESS]: this.client.options.host,
          [ATTR_SERVER_PORT]: this.client.options.port || 6379,
        },
      },
      async (span) => {
        try {
          const retValue = await fn(span)
          span.setStatus({ code: 1 })
          return retValue
        } catch (e) {
          span.setStatus({ code: 2, message: (e as Error).message })
          throw e
        } finally {
          span.end()
        }
      },
    )
  }
}
