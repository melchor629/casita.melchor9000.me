import { glob, rm } from 'node:fs/promises'
import Path from 'node:path'
// eslint-disable-next-line import-x/no-extraneous-dependencies
import { defineConfig } from '@eddeee888/gcg-typescript-resolver-files'
import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'src/apollo-servers/nas-auth/schema/*/schema.graphql',
  generates: {
    'src/apollo-servers/nas-auth/schema': defineConfig({
      typesPluginsConfig: {
        useIndexSignature: true,
        useTypeImports: true,
        enumsAsTypes: true,
        contextType: '../context#NasAuthGraphQLContext',
        defaultScalarType: 'unknown',
        strictScalars: true,
      },
      typeDefsFilePath: './type-defs.generated.ts',
      resolverGeneration: 'disabled',
    }),
  },
  hooks: {
    async afterAllFileWrite() {
      for await (const path of glob('src/apollo-servers/nas-auth/schema/*/resolvers/*.ts')) {
        await rm(Path.dirname(path), { force: true, recursive: true })
      }

      await rm('src/apollo-servers/nas-auth/schema/resolvers.generated.ts')
      await rm('src/apollo-servers/nas-auth/schema/schema.generated.graphqls')
    },
    beforeOneFileWrite(_path: string, contents: string) {
      return `/* eslint-disable */\n${contents}`
        .replaceAll(/from '\.(.+)'/g, 'from \'.$1.ts\'')
    },
  },
}

export default config
