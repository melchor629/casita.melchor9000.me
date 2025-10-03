import { nanoid } from 'nanoid'
import type { App } from '../../models/app.ts'
import type { DirectoryEntry } from '../../models/fs/directory-entry.ts'
import type { AliasEntry } from '../../models/url-alias/alias-entry.ts'

const createUrlAlias = async (
  { cache }: App,
  entries: DirectoryEntry[],
  expiresInSeconds = 12 * 60 * 60,
) => {
  let id
  let key
  do {
    id = nanoid()
    key = `url-alias:${id}`
  } while (await cache.exists(key))

  const entry: AliasEntry = {
    version: 1,
    paths: entries.map((e) => e.path),
  }
  await cache.set(key, entry, expiresInSeconds * 1000)

  return id
}

export default createUrlAlias
