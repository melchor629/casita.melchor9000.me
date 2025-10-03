import type { App } from '../../models/app.ts'
import type { AliasEntry } from '../../models/url-alias/alias-entry.ts'

const getUrlAlias = async ({ cache }: App, id: string) => {
  const key = `url-alias:${id}`

  const entries = await cache.get<AliasEntry>(key)
  return entries
}

export default getUrlAlias
