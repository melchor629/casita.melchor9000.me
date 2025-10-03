import fs from 'node:fs/promises'
import Path from 'node:path'
import sharp from 'sharp'
import parentLogger from '../../logger.ts'

const logger = parentLogger.child({ module: 'core-logic.thumbnail.generate-thumbnail' })

const sizes = Object.freeze({
  xsm: 32,
  sm: 64,
  md: 128,
  lg: 256,
  xlg: 512,
})

const generateThumbnail = async (
  sourcePath: string,
  targetPath: string,
  size: keyof typeof sizes,
  format: 'jpg' | 'webp' | 'png' | 'avif' = 'jpg',
) => {
  const pixels = sizes[size]
  let actions = sharp(sourcePath)
    .rotate()
    .resize({
      width: pixels,
      height: pixels,
      fit: 'contain',
      background: 'rgba(0, 0, 0, 0)',
      withoutEnlargement: true,
    })

  if (format === 'webp') {
    actions = actions.webp()
  } else if (format === 'png') {
    actions = actions.png()
  } else if (format === 'avif') {
    actions = actions.avif()
  } else {
    actions = actions.jpeg()
  }

  logger.debug({
    sourcePath, targetPath, size, format,
  }, 'Generating thumbnail')
  const { data } = await actions.toBuffer({ resolveWithObject: true })
  await fs.mkdir(Path.dirname(targetPath), { recursive: true })
  await fs.writeFile(targetPath, data)
  return data
}

export default generateThumbnail
