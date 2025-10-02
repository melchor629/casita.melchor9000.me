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

export const getRootLayoutPath = (): string => getAppPath('root-layout.tsx')
export const getMiddlewarePath = (): string => getAppPath('middleware.ts')

export const ssrRoutesModuleId = 'virtual:ssr/routes'
export const csrPageModuleId = (pagePath: string): string =>
  path.join('virtual:csr', pagePath).replace(/\/$/, '')
export const partialSsrPageModuleId = (pagePath: string): string =>
  path.join('virtual:partial-ssr', pagePath).replace(/\/$/, '')
