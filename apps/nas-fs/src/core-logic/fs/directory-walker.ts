import fs from 'node:fs/promises'
import Path from 'node:path'

import type { App } from '../../models/app.ts'
import { normalize } from './fs-watcher.ts'
import { ensureExists } from './utils.ts'

type EntryType = 'directory' | 'file' | 'symlink' | 'block-device' | 'character-device' | 'fifo' | 'socket' | 'other'
interface DirectoryWalkerOptions {
  /** Keeps recursing child directories (by default true) */
  recursive?: boolean
  /** If defined, these paths will be excluded from the results */
  excludedPaths?: string[]
}

async function * directoryWalkerRecursive(
  app: App,
  path: string,
  options?: DirectoryWalkerOptions,
): AsyncGenerator<readonly [string, EntryType], void> {
  const recursive = options?.recursive ?? true
  const excludedPaths = options?.excludedPaths?.map((p) => Path.join(app.storagePath, p))
    ?? [app.thumbnailPath, app.uploadPath]

  const fullPath = Path.join(app.storagePath, path)
  const dirEntries = await fs.opendir(fullPath, { encoding: 'utf-8' })
  const recurseTheseDirectoriesAsWell: string[] = []

  for await (const dirEntry of dirEntries) {
    const dirEntryPath = Path.join(path, dirEntry.name)
    const realPath = Path.join(app.storagePath, dirEntryPath)
    const type = (dirEntry.isDirectory() && 'directory')
      || (dirEntry.isFile() && 'file')
      || (dirEntry.isSymbolicLink() && 'symlink')
      || (dirEntry.isBlockDevice() && 'block-device')
      || (dirEntry.isCharacterDevice() && 'character-device')
      || (dirEntry.isFIFO() && 'fifo')
      || (dirEntry.isSocket() && 'socket')
      || 'other'

    if (type === 'directory' && !excludedPaths.includes(realPath)) {
      if (recursive) {
        recurseTheseDirectoriesAsWell.push(dirEntryPath)
      } else {
        yield [dirEntryPath, type]
      }
    } else if (type !== 'directory') {
      yield [dirEntryPath, type]
    }
  }

  for (const dirEntryPath of recurseTheseDirectoriesAsWell) {
    yield [dirEntryPath, 'directory']
    yield * directoryWalkerRecursive(app, dirEntryPath, options)
  }
}

const directoryWalker = async (app: App, path: string, options?: DirectoryWalkerOptions) => {
  const normalizedPath = normalize(path)
  const fullPath = Path.join(app.storagePath, normalizedPath)

  await ensureExists(fullPath)

  return directoryWalkerRecursive(app, normalizedPath, options)
}

export default directoryWalker
