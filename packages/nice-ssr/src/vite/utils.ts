import fs from 'node:fs/promises'
import path from 'node:path'
import { cwd } from 'node:process'

export const unsafeExists = (path: string) =>
  fs.access(path).then(() => true).catch(() => false)

export const getSourcePath = (...parts: string[]) =>
  path.resolve(cwd(), 'src', ...parts)

export const getAppPath = (...parts: string[]) =>
  getSourcePath('app', ...parts)

export const getRelativeSourcePath = (absolutePath: string) =>
  path.relative(cwd(), absolutePath)

export const getRootLayoutPath = () => getAppPath('root-layout.tsx')
export const getMiddlewarePath = () => getAppPath('middleware.ts')

export const ssrRoutesModuleId = 'virtual:ssr/routes'
export const csrPageModuleId = (pagePath: string) =>
  path.join('virtual:csr', pagePath).replace(/\/$/, '')
