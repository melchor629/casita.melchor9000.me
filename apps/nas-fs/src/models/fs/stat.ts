import { DateTime, Type, type Static } from '../type-helpers.ts'

export const StatTimeSchema = Type.Object({
  timestamp: DateTime(),
  ms: Type.String(),
})

export type StatTime = Static<typeof StatTimeSchema>

export const StatSchema = Type.Object({
  size: Type.Integer(),
  accessTime: StatTimeSchema,
  modificationTime: StatTimeSchema,
  changeTime: StatTimeSchema,
  fileMode: Type.Integer(),
  uid: Type.Integer(),
  gid: Type.Integer(),
  user: Type.Optional(Type.String()),
  group: Type.Optional(Type.String()),
}, {
  title: 'Stat',
  description: 'Represents basic information about the entry',
})

export type Stat = Static<typeof StatSchema>
