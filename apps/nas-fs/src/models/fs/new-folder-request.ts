import { Type, type Static } from '../type-helpers.ts'

export const NewFolderRequestSchema = Type.Object({
  folderName: Type.String({
    description: 'The name of the new directory',
    examples: ['new-dir'],
  }),
  path: Type.String({
    description: 'Path where to place the new directory',
    examples: ['/some/dir'],
  }),
}, {
  title: 'NewFolderRequest',
  description: 'New Folder request',
})

export type NewFolderRequest = Static<typeof NewFolderRequestSchema>

export const NewFolderResponseSchema = Type.Object({
  done: Type.Boolean({
    description: 'Operation done',
  }),
  path: Type.String({
    description: 'Path where the directory has been created to',
    examples: ['/some/dir/new-dir'],
  }),
}, {
  title: 'NewFolderResponse',
  description: 'Response for new folder operation completed',
})

export type NewFolderResponse = Static<typeof NewFolderResponseSchema>
