import type { BigIntStats } from 'node:fs'
import fs from 'node:fs/promises'
import Path from 'node:path'
import logger from '../logger.ts'
import type { DirectoryEntryBase, DirectoryEntryType } from '../models/fs/directory-entry-base.ts'
import type { DirectoryEntry } from '../models/fs/directory-entry.ts'
import type { Directory } from '../models/fs/directory.ts'
import type { File } from '../models/fs/file.ts'
import type { Symlink } from '../models/fs/symbolic-link.ts'
import { readTags } from './audio-tags.ts'
import readExif from './exif.ts'
import { group, passwd } from './getent.ts'
import mediainfo from './mediainfo.ts'
import getMimeType from './mime.ts'

interface ExtraOptions<V = boolean> {
  detailed?: V
}

const statsToDirectoryEntryType = (stat: BigIntStats): DirectoryEntryType => {
  if (stat.isDirectory()) {
    return 'dir'
  } if (stat.isFile()) {
    return 'file'
  } if (stat.isSymbolicLink()) {
    return 'symlink'
  } if (stat.isBlockDevice()) {
    return 'block-dev'
  } if (stat.isCharacterDevice()) {
    return 'char-dev'
  } if (stat.isSocket()) {
    return 'socket'
  } if (stat.isFIFO()) {
    return 'fifo'
  }

  return 'unknown'
}

const directoryExtend = async (directoryEntry: DirectoryEntryBase): Promise<Directory> => {
  const itemsInDir = await fs.readdir(directoryEntry.realPath)
  const storagePath = directoryEntry.path !== '/'
    ? directoryEntry.realPath.slice(0, -directoryEntry.path.length)
    : directoryEntry.realPath
  return {
    ...directoryEntry,
    type: 'dir',
    contents: await Promise.all(
      itemsInDir.map(async (item) => {
        const info = await fromPath(
          Path.join(directoryEntry.path, item),
          storagePath,
        )
        if (info.type === 'file') {
          return { ...info, mime: await getMimeType(info.realPath) }
        }
        return info
      }),
    ),
  }
}

const fileExtend = async (directoryEntry: DirectoryEntryBase): Promise<File> => {
  const file: File = {
    ...directoryEntry,
    type: 'file',
    mime: await getMimeType(directoryEntry.realPath),
  }
  const { path } = directoryEntry
  if (file.mime) {
    const mimeType = file.mime.mime
    if (mimeType.startsWith('video') || mimeType.startsWith('audio')) {
      file.mediainfo = await mediainfo(file.realPath)
    }

    if (mimeType.startsWith('audio')) {
      try {
        file.audioTags = await readTags(file.realPath)
      } catch (e) {
        logger.error(e, `Could not parse tags for audio file ${path}`, { path })
      }
    }

    if (mimeType.startsWith('image')) {
      try {
        file.exif = await readExif(file.realPath)
      } catch (e) {
        logger.error(e, `Could not parse EXIF tags for image file ${path}`, { path })
      }
    }
  }
  return file
}

const symlinkExtend = async (directoryEntry: DirectoryEntryBase): Promise<Symlink> => {
  const value = await fs.readlink(directoryEntry.realPath)
  const resolved = Path.resolve(value)
  const storagePath = directoryEntry.path !== '/'
    ? directoryEntry.realPath.slice(0, -directoryEntry.path.length)
    : directoryEntry.realPath
  const isRooted = resolved.startsWith(storagePath)
  return {
    ...directoryEntry,
    type: 'symlink',
    value,
    target: isRooted ? Path.relative(resolved, storagePath) : null,
  }
}

export async function fromStat(
  path: string,
  stat: BigIntStats,
  storagePath: string,
  opts: ExtraOptions<true>,
): Promise<DirectoryEntry>
export async function fromStat(
  path: string,
  stat: BigIntStats,
  storagePath: string,
  opts?: ExtraOptions<false>,
): Promise<DirectoryEntryBase>
export async function fromStat(
  path: string,
  stat: BigIntStats,
  storagePath: string,
  opts?: ExtraOptions,
): Promise<DirectoryEntry | DirectoryEntryBase>
export async function fromStat(
  path: string,
  stat: BigIntStats,
  storagePath: string,
  opts: ExtraOptions = {},
): Promise<DirectoryEntry | DirectoryEntryBase> {
  const realPath = Path.join(storagePath, path)
  const mode = Number(stat.mode & BigInt(0o7777))
  const [user, groupName] = await Promise.all([
    passwd(stat.uid)
      .then((ud) => (ud ? ud.username : undefined))
      .catch(() => undefined),
    group(stat.gid)
      .then((gd) => (gd ? gd.groupname : undefined))
      .catch(() => undefined),
  ])

  let obj: DirectoryEntryBase | DirectoryEntry = {
    path,
    realPath,
    stat: {
      size: Number(stat.size),
      accessTime: {
        timestamp: stat.atime,
        ms: stat.atimeMs.toString(),
      },
      modificationTime: {
        timestamp: stat.mtime,
        ms: stat.mtimeMs.toString(),
      },
      changeTime: {
        timestamp: stat.ctime,
        ms: stat.ctimeMs.toString(),
      },
      fileMode: mode,
      uid: Number(stat.uid),
      gid: Number(stat.gid),
      user,
      group: groupName,
    },
    type: statsToDirectoryEntryType(stat),
    hidden: Path.basename(path).startsWith('.'),
  }

  if (opts.detailed === true) {
    if (stat.isDirectory()) {
      obj = await directoryExtend(obj)
    } else if (stat.isFile()) {
      obj = await fileExtend(obj)
    } else if (stat.isSymbolicLink()) {
      obj = await symlinkExtend(obj)
    }
  }

  return obj
}

export async function fromPath(
  path: string,
  storagePath: string,
  opts: ExtraOptions<true>,
): Promise<DirectoryEntry>
export async function fromPath(
  path: string,
  storagePath: string,
  opts?: ExtraOptions<false>,
): Promise<DirectoryEntryBase>
export async function fromPath(
  path: string,
  storagePath: string,
  opts?: ExtraOptions,
): Promise<DirectoryEntry | DirectoryEntryBase>
export async function fromPath(path: string, storagePath: string, opts: ExtraOptions = {}) {
  const realPath = Path.join(storagePath, path)
  const stat = await fs.lstat(realPath, { bigint: true })
  return fromStat(path, stat, storagePath, opts)
}
