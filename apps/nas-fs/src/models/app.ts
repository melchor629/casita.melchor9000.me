import type { BaseLogger } from 'pino'
import type { Cache } from '../cache/cache.ts'
import type { getNotifier } from '../core-logic/fs/fs-watcher.ts'
import { Type } from './type-helpers.ts'

/**
 * Default pino logger type
 * @internal
 */
interface Logger extends Omit<BaseLogger, 'msgPrefix'> {
  child(bindings: Record<string, unknown>): Logger
}

/**
 * Application (tenant) services
 * @internal
 */
export interface App {
  readonly identifier: string
  readonly storagePath: string
  readonly thumbnailPath: string
  readonly uploadPath: string
  readonly cache: Cache
  readonly notifier: ReturnType<typeof getNotifier>
  readonly logger: Logger,
  readonly mediaLibrary: {
    readonly plex?: string
    readonly jellyfin?: string
  }
}

export const applicationKeyParam = Type.String({
  minLength: 1,
  pattern: '^[a-z0-9_-]+$',
  title: 'applicationKey',
  description: 'The application key',
})
