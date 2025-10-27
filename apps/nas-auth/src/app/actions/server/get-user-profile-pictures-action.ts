'use server'

import { readdir } from 'node:fs/promises'
import path from 'node:path'
import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { profileImagesPath } from '../../../config.ts'
import { getSession } from './get-session-action.ts'
import { ok, type FailableResult } from './helpers.ts'

async function getUserProfilePicturesAction(req: PageLoaderContext): Promise<FailableResult<string[]>> {
  const session = await getSession(req)
  if (!session) {
    return ok([])
  }

  const userProfilePath = path.join(profileImagesPath, session.accountId)
  const pictures = (
    await readdir(userProfilePath, { withFileTypes: true })
      .catch((e) => {
        if (e instanceof Error && 'code' in e && e.code === 'ENOENT') {
          return []
        }

        throw e
      })
  )
    .filter((ent) => ent.isFile())
    .filter((ent) => ent.name.endsWith('.webp'))
    .map((ent) => ent.name)
  return ok(pictures)
}

export default getUserProfilePicturesAction
