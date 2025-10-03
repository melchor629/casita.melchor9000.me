import fs from 'node:fs'
import { program } from 'commander'

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8')) as typeof import('../package.json')

const startApi = () => import('./app.ts').then((appApi) => appApi.default())
const startWorker = () => import('./worker.ts').then((worker) => worker.default())

program
  .name(packageJson.name)
  .version(packageJson.version)

program.command('api')
  .description('Runs the API server')
  .action(startApi)

program.command('worker')
  .description('Run background job workers')
  .action(startWorker)

await program.parseAsync()
