import React, { useSyncExternalStore } from 'react'
import * as Storage from '../storage'

export interface Settings {
  theme: 'system' | 'light' | 'dark'
  hidden: boolean
  entryViewType: 'grid' | 'list'
  showThumbnails: boolean
}

const settingsChannel = new BroadcastChannel('nas:settings')
let settings: Settings = {
  theme: 'system',
  hidden: false,
  entryViewType: 'list',
  showThumbnails: true,
}
const sameTabListeners: Array<() => void> = []

{
  const storedSettings = Storage.getSettings()
  if (storedSettings) {
    settings = {
      theme: storedSettings.theme ?? 'system',
      entryViewType: storedSettings.entryViewType ?? 'list',
      hidden: storedSettings.hidden ?? false,
      showThumbnails: storedSettings.showThumbnails ?? true,
    }
  }
}

settingsChannel.addEventListener('message', (ev: MessageEvent<Settings>) => {
  settings = ev.data
  sameTabListeners.forEach((fn) => fn())
  settings = Storage.getSettings() ?? settings
})

if (import.meta.hot) {
  import.meta.hot.dispose(() => settingsChannel.close())
}

export function useSettings(): Settings
export function useSettings<T>(map: (settings: Settings) => T): T
export function useSettings<T = Settings>(map?: (settings: Settings) => T): T | Settings {
  return useSyncExternalStore(
    (onChange) => {
      sameTabListeners.push(onChange)
      return () => sameTabListeners.splice(sameTabListeners.indexOf(onChange), 1)
    },
    () => (map ? map(settings) : settings),
  )
}

export const useSettingsContext = () => {
  const values = useSettings()

  return {
    values,
    update: <T extends keyof Settings>(key: T, value: React.SetStateAction<Settings[T]>) => {
      const newValue = typeof value === 'function' ? value(values[key]) : value
      const newSettings = { ...values, [key]: newValue }
      Storage.setSettings(newSettings)
      settings = newSettings
      sameTabListeners.forEach((fn) => fn())
      settingsChannel.postMessage(newSettings)
    },
  }
}
