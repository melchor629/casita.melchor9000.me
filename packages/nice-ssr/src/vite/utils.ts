import fs from 'node:fs/promises'
import path from 'node:path'
import { cwd } from 'node:process'

export const unsafeExists = (path: string): Promise<boolean> =>
  fs.access(path).then(() => true).catch(() => false)

export const getSourcePath = (...parts: string[]): string =>
  path.resolve(cwd(), 'src', ...parts)

export const getAppPath = (...parts: string[]): string =>
  getSourcePath('app', ...parts)

export const getRelativeSourcePath = (absolutePath: string): string =>
  path.relative(cwd(), absolutePath)

export const ssrRoutesModuleId = 'virtual:ssr/routes'
export const csrEntryModuleId = 'virtual:entry-csr'
export const csrPageModuleId = (pagePath: string): string =>
  path.join('virtual:csr', pagePath).replace(/\/$/, '')

export const ssrRoutesFilePath = path.join(import.meta.dirname, 'virtual', 'ssr-routes.js')
export const csrEntryFilePath = path.join(import.meta.dirname, 'virtual', 'csr-entry.js')
