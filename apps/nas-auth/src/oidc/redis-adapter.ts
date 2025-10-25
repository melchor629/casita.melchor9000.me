import type { Adapter, AdapterPayload } from 'oidc-provider'
import { redisPrefix } from '../config.ts'
import client from '../redis.ts'

const grantable = new Set([
  'access-token',
  'authorization-code',
  'refresh-token',
  'device-code',
  'backchannel-authentication-request',
])

const consumable = new Set([
  'authorization-code',
  'refresh-token',
  'device-code',
  'backchannel-authentication-request',
])

/**
 * Gets the Redis key for a grant key reference list
 * @param grantId The grant id
 * @returns Redis key
 */
const grantKeyFor = (grantId: string) => `${redisPrefix}:oidc:grant:${grantId}:refs` as const

/**
 * Gets the Redis key for a user code reference
 * @param userCode The user code
 * @returns Redis key
 */
const userCodeKeyFor = (userCode: string) => `${redisPrefix}:oidc:user-code:${userCode}` as const

/**
 * Gets the Redis key for a uid reference
 * @param uid uid
 * @returns Redis key
 */
const uidKeyFor = (uid: string) => `${redisPrefix}:oidc:uid:${uid}` as const

/**
 * Converts the string into kebab case
 * @param {string} value String to convert to
 * @returns String converted
 */
const toKebabCase = (value: string) => {
  if (!value) {
    return value
  }

  const regex = /[a-z]([A-Z])/
  let result = value[0].toLowerCase() + value.slice(1)
  let match = regex.exec(result)
  while (match) {
    result = `${result.slice(0, match.index + 1)}-${match[1].toLowerCase()}${result.slice(match.index + 2)}`
    match = regex.exec(result)
  }

  return result
}

export default class RedisAdapter implements Adapter {
  #name
  #grantable
  #consumable

  constructor(name: string) {
    this.#name = toKebabCase(name)
    this.#grantable = grantable.has(this.#name)
    this.#consumable = consumable.has(this.#name)
  }

  /**
   * Inserts or updates an entry of the store
   * @param id ID of the element
   * @param payload The data to store
   * @param expiresIn The time when this data will expire on
   */
  async upsert(id: string, payload: AdapterPayload, expiresIn: number) {
    const key = this.#key(id)
    const multi = client.multi()

    // store the element
    if (this.#consumable) {
      multi.hmset(key, { payload: JSON.stringify(payload) })
    } else {
      multi.set(key, JSON.stringify(payload))
    }

    // set expiration if required
    if (expiresIn > 0) {
      multi.expire(key, expiresIn)
    }

    // if the store is for grant elements, and has a grantId, then store the key in the grant
    // reference list
    if (this.#grantable && payload.grantId) {
      const grantKey = grantKeyFor(payload.grantId)
      multi.rpush(grantKey, key)
      // TODO maybe use LTRIM as well to reduce the list size
      const ttl = await client.ttl(grantKey)
      if (expiresIn > ttl) {
        multi.expire(grantKey, expiresIn)
      }
    }

    // if the store uses user codes, store the reference for quick access
    if (payload.userCode) {
      const userCodeKey = userCodeKeyFor(payload.userCode)
      multi.set(userCodeKey, id)
      multi.expire(userCodeKey, expiresIn)
    }

    // if the store uses uids, store the reference for quick access
    if (payload.uid) {
      const uidKey = uidKeyFor(payload.uid)
      multi.set(uidKey, id)
      multi.expire(uidKey, expiresIn)
    }

    // TODO handle errors
    await multi.exec()
  }

  /**
   * Finds the payload for the given element id
   * @param id The ID of the element
   * @returns The payload of the
   * element if found
   */
  async find(id: string): Promise<AdapterPayload | undefined> {
    if (this.#consumable) {
      const data = await client.hGetAll(this.#key(id))
      if (!Object.keys(data).length) {
        return undefined
      }

      const { payload, ...rest } = data
      return {
        ...rest,
        ...(JSON.parse(payload) as Record<string, unknown>),
      }
    }

    const data = await client.get(this.#key(id))

    if (!data) {
      return undefined
    }

    return JSON.parse(data) as Record<string, unknown>
  }

  /**
   * Given the user code, looks for a payload that relates to it
   * @param userCode User code that relates to an element of the store
   * @returns The payload of the element if found
   */
  async findByUserCode(userCode: string) {
    // use reference to get the payload by userCode
    const key = await client.get(userCodeKeyFor(userCode))
    return key ? this.find(key) : undefined
  }

  /**
   * Given the uid, looks for a payload that relates to it
   * @param uid uid that relates to an element of the store
   * @returns The payload of the element if found
   */
  async findByUid(uid: string) {
    // use reference to get the payload by uid
    const key = await client.get(uidKeyFor(uid))
    return key ? this.find(key) : undefined
  }

  /**
   * Marks the element as consumed
   * @param id ID of the element
   */
  async consume(id: string) {
    // NOTE: only runs on consumable stores
    await client.hset(this.#key(id), 'consumed', Math.floor(Date.now() / 1000))
  }

  /**
   * Removes the payload of the given ID
   * @param id ID of the element
   */
  async destroy(id: string) {
    await client.del(this.#key(id))
  }

  /**
   * Given the grant id, removes all elements that relates to it
   * @param grantId Grant id which is related to a set of elements
   */
  async revokeByGrantId(grantId: string) {
    const multi = client.multi()
    // get all stored keys by grantId
    const tokens = await client.lRange(grantKeyFor(grantId), 0, -1)
    // mark all payloads to be removed
    tokens.forEach((token) => multi.del(token))
    // mark the reference list to be removed as well
    multi.del(grantKeyFor(grantId))
    await multi.exec()
  }

  #key(id: string) {
    return `${redisPrefix}:oidc:${this.#name}:${id}` as const
  }
}
