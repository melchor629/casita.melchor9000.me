'use server'

import fs from 'node:fs/promises'
import path from 'node:path'
import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { nanoid } from 'nanoid'
import sharp from 'sharp'
import { profileImagesPath } from '../../config.ts'
import { getSession } from './get-session-action'
import { ok, invalid } from './helpers.ts'

async function uploadUserProfilePictureAction(context: PageLoaderContext, data: FormData) {
  const image = data.get('image')
  if (!image || typeof image === 'string') {
    return invalid([
      { name: 'image', messages: ['Field required.'] },
    ])
  }

  const session = await getSession(context)
  if (!session) {
    return invalid([])
  }

  const imageData = await image.arrayBuffer()
  const imageName = path.parse(image.name)

  const userProfilePath = path.join(profileImagesPath, session.accountId)
  await fs.mkdir(userProfilePath, { recursive: true, mode: 0o700 })

  const fileName = `${imageName.name}.${nanoid(11)}.webp`
  const imagePath = path.join(userProfilePath, fileName)
  await sharp(imageData)
    .resize(512, 512, {
      fit: 'cover',
      position: 'centre',
    })
    .webp()
    .toFile(imagePath)

  return ok(fileName)
}

export default uploadUserProfilePictureAction
