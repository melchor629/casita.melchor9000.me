import type { SessionStore } from '@fastify/session'
import type { Session } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'
import { nanoid } from 'nanoid'
import type { RedisClientType } from 'redis'
import { redisPrefix, sessionSignKey } from '../config'
import client from '../redis.ts'

class RedisStore implements SessionStore {
  #client: RedisClientType
  #prefix: string
  #ttl: number

  constructor({
    client, prefix, ttl,
  }: {
    client: RedisClientType
    prefix?: string
    ttl?: number
  }) {
    this.#client = client
    this.#prefix = prefix ?? 'sess:'
    this.#ttl = ttl ?? 86400
  }

  set(sessionStoreId: string, session: Session, callback: (err?: unknown) => void): void {
    const key = this.#prefix + sessionStoreId
    const ttl = this.#ttl
    if (ttl > 0) {
      this.#client.set(key, JSON.stringify(session), {
        expiration: { type: 'EX', value: ttl },
      })
        .then(() => callback(null))
        .catch(callback)
    } else {
      this.destroy(sessionStoreId, callback)
    }
  }

  get(sessionStoreId: string, callback: (err: unknown, result?: Session | null) => void): void {
    const key = this.#prefix + sessionStoreId
    this.#client.get(key)
      .then((data) => callback(null, data ? JSON.parse(data) as Session : null))
      .catch(callback)
  }

  compareAndSet(sessionStoreId: string, expectedGeneration: string, session: Session, callback: (err?: unknown) => void): void {
    const key = this.#prefix + sessionStoreId
    this.#client.get(key)
      .then((data) => {
        if (!data) {
          return callback(Object.assign(new Error('The session does not exist'), { code: 'ENOENT' }))
        }

        const storedSession = JSON.parse(data) as Session
        const currentGeneration = ('__fastifySessionMetadata' in storedSession
          && typeof storedSession.__fastifySessionMetadata === 'object'
          && storedSession.__fastifySessionMetadata != null
          && 'generation' in storedSession.__fastifySessionMetadata
          && storedSession.__fastifySessionMetadata.generation) || sessionStoreId
        if (currentGeneration !== expectedGeneration) {
          return callback(Object.assign(new Error('Session has changed'), { code: 'ENOENT' }))
        }

        this.set(sessionStoreId, session, callback)
      })
      .catch(callback)
  }

  destroy(sessionStoreId: string, callback: (err?: unknown) => void): void {
    const key = this.#prefix + sessionStoreId
    this.#client.del(key)
      .then(() => callback(null))
      .catch(callback)
  }
}

const SessionPlugin = fastifyPlugin(async (app) => {
  await app.register(import('@fastify/session'), {
    secret: sessionSignKey,
    cookieName: 'auth_session',
    cookie: { maxAge: 864e3 },
    idGenerator: () => nanoid(),
    store: new RedisStore({
      client,
      prefix: `${redisPrefix}:session:`,
      ttl: 864e3,
    }),
  })
})

export default SessionPlugin
