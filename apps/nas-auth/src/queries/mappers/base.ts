import type * as schema from '@melchor629/orm-nas-auth/schema'

export type Tables = Omit<(typeof schema), 'auth' | 'ApiResourceAccessTokenFormat'>
export type TableNames = keyof Tables

export type OrmMapper<TTableName extends TableNames, TDto> = Readonly<{
  $dto: TDto
  $select: Tables[TTableName]['$inferSelect']
  $insert: Tables[TTableName]['$inferInsert']
  $update: Partial<Tables[TTableName]['$inferInsert']>

  fromTable: (values: Tables[TTableName]['$inferSelect']) => TDto
}>

export const makeMapper = <TTableName extends TableNames, TDto>() => <const T extends Omit<OrmMapper<TTableName, TDto>, `$${string}`>>(mapper: T) =>
  mapper as OrmMapper<TTableName, TDto> & T
