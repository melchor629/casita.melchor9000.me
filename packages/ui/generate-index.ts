import { readFile, glob, writeFile } from 'node:fs/promises'
import path from 'node:path'

const excluded = ['**/ReactRouterButton', '**/ReactRouterLink', '**/icons'];
const exportOneRegex = /^export default (\w+)\nexport type { (\w+) } from/m
const exportMultipleRegex = /^export { default as (\w+)((?:, ?type \w+)*) } from '.+?'$/gm

const lines = []
for await (const item of glob('./src/*/index.ts', { cwd: import.meta.dirname, exclude: excluded })) {
  const index = await readFile(path.join(import.meta.dirname, item), { encoding: 'utf8' })
  const relativePath = path.relative('./src', item)
  const exportOneMatch = exportOneRegex.exec(index)
  if (exportOneMatch) {
    const [, compName, propsName] = exportOneMatch
    lines.push(`export { default as ${compName}, type ${propsName} } from './${relativePath}'`)
  } else {
    const exportMultipleMatches = Array.from(index.matchAll(exportMultipleRegex))
    const componentNames = exportMultipleMatches.map((match) => match[1]).join(', ')
    const propsNames = exportMultipleMatches.map((match) => match[2]).join('')
    lines.push(`export { ${componentNames}${propsNames} } from './${relativePath}'`)
  }
}

lines.sort((a, b) => a.slice(a.indexOf('from')).localeCompare(b.slice(b.indexOf('from'))))
await writeFile(path.join(import.meta.dirname, './src/index.ts'), lines.join('\n') + '\n')
