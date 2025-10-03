import fs from 'node:fs/promises'
import { execa } from 'execa'

import memoize from '../utils/memoize.ts'

const extractDarwin = (line: string) => {
  const [
    username, password, userIdentifier, groupIdentifier,,,, fullName, homeDirectory, shell,
  ] = line.split(' ')

  return {
    username,
    password,
    userIdentifier: BigInt(userIdentifier),
    groupIdentifier: BigInt(groupIdentifier),
    fullName,
    homeDirectory,
    shell,
  }
}

const extractLinux = (line: string) => {
  const [
    username, password, userIdentifier, groupIdentifier, fullName, homeDirectory, shell,
  ] = line.split(' ')

  return {
    username,
    password,
    userIdentifier: BigInt(userIdentifier),
    groupIdentifier: BigInt(groupIdentifier),
    fullName: fullName?.split(',')[0],
    homeDirectory,
    shell,
  }
}

const getUser = (passwd: string, username: number | bigint | string) => passwd.split('\n')
  .map(process.platform === 'linux' ? extractLinux : extractDarwin)
  .find((user) => user.username === username || user.userIdentifier === BigInt(username))

export const passwd = memoize(async (username: number | bigint | string) => {
  if (process.platform === 'linux') {
    return getUser(await fs.readFile('/etc/passwd', 'utf-8'), username)
  }

  if (process.platform === 'darwin') {
    const { stdout } = await execa('/usr/bin/id', ['-P', username.toString()])
    return getUser(stdout, username)
  }

  throw new Error('Platform not supported')
})

export const group = memoize(async (groupId: bigint | number | string) => {
  const lines = await fs.readFile('/etc/group', 'utf8')
  const entries = lines
    .split('\n')
    .filter((entry) => entry && !entry.startsWith('#'))
    .map((entry) => entry.split(':'))
    .map((entry) => ({
      groupname: entry[0],
      password: entry[1],
      groupIdentifier: BigInt(entry[2]),
      members: entry[3] ? entry[3].split(',') : [],
    }))
  return entries.find((entry) => (
    entry.groupname === groupId || entry.groupIdentifier === BigInt(groupId)
  ))
})
