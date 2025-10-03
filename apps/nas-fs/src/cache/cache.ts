import type { SubscriptorListener } from './subscriptor-listener.ts'

export interface Cache {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<void>
  set<T>(key: string, value: T, expiration: number): Promise<void>
  setIfNotExists<T>(key: string, value: T): Promise<boolean>
  remove(key: string): Promise<number>
  remove(...keys: string[]): Promise<number>
  exists(key: string): Promise<boolean>
  getKeys(pattern: string): Promise<string[]>
  getKeysIterator(pattern: string, count?: number): AsyncGenerator<string[], void, undefined>
  expire(key: string, expiration?: number): Promise<boolean>
  publish<T>(channel: string, value: T): Promise<boolean>
  publish(channel: string, value: string): Promise<boolean>
  multipleGet<T>(...keys: string[]): Promise<Array<T | null>>
  createSubscriptor(signal?: AbortSignal): Promise<SubscriptorListener>
}
