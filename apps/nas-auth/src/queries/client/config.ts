import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: 'http://localhost:8003/nas-auth',
  documents: ['src/queries/*.ts'],
  ignoreNoDocuments: true,
  emitLegacyCommonJSImports: false,
  generates: {
    [`${import.meta.dirname}/`]: {
      preset: 'client',
      hooks: {
        beforeOneFileWrite(path: string, contents: string) {
          if (path.endsWith('index.ts')) {
            return contents
              .replaceAll('"', '\'')
              .replaceAll(';', '')
              + '\n'
          }

          return contents.replace('./graphql.js', './graphql.ts')
        },
      },
      config: {
        documentMode: 'string',
        useTypeImports: true,
        enumsAsTypes: true,
      },
    },
  },
}

export default config
