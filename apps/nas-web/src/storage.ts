import type { Settings } from './hooks/use-settings'

type SwrCacheEntry<TData = unknown> = {
  v: '1'
  k: string
  d?: TData
  a: number
}

const getKey = (key: string) => `nas-web:${key}`

const getItem = <T>(key: string): T | null => {
  const value = localStorage.getItem(getKey(key))
  return value ? JSON.parse(value) as T : null
}

const setItem = <T>(key: string, value: T): T => {
  localStorage.setItem(getKey(key), JSON.stringify(value))
  return value
}

export const getSettings = (): Settings | null => getItem('settings')

export const setSettings = (value: Settings): Settings => setItem('settings', value)

export const getSwrCache = (): SwrCacheEntry[] => getItem('swr') ?? []
