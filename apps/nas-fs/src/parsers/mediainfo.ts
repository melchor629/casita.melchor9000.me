import { type Result, execa } from 'execa'
import type { MediaInfo } from '../models/mediainfo.ts'

class MediaInfoError extends Error {
  public readonly exitCode: number

  public readonly stdout: string

  public readonly stderr: string

  constructor(res: Result<{ encoding: 'utf8', reject: false }>) {
    super('Failed running mediainfo')
    this.exitCode = res.exitCode ?? -1
    this.stdout = res.stdout
    this.stderr = res.stderr
  }
}

/** Executes mediainfo for that file and returns a Promise. * */
const mediainfo = async (path: string) => {
  const mi = execa(
    'mediainfo',
    [path, '--Output=JSON'],
    { encoding: 'utf8', reject: false },
  )
  const res = await mi
  if (!res.failed) {
    return JSON.parse(res.stdout) as MediaInfo
  }
  throw new MediaInfoError(res)
}

/**
 * Executes mediainfo over a file and returns useful information for it.
 * @param {string} path - A path to a file to obtain the info.
 * @return {Promise} A promise with the information.
 * */
export default async (path: string): Promise<MediaInfo> => {
  const object = await mediainfo(path)
  return object
}
