import type { PgSelectedFieldsFlat } from '@melchor629/orm-nas-auth'
import type * as schema from '@melchor629/orm-nas-auth/schema'

export type Tables = Omit<(typeof schema), 'auth' | 'ApiResourceAccessTokenFormat'>
export type TableNames = keyof Tables

type DefaultKey = Record<string, number | string>
type DefaultRecord = Record<string, unknown>

type OrmMapperMap = {
  table: TableNames
  dto: DefaultRecord
  row?: DefaultRecord
  primaryKey?: DefaultKey
  secondaryKey?: DefaultKey
}

type TDto<TMap extends OrmMapperMap> = TMap['dto']
type TRow<TMap extends OrmMapperMap> = TMap['row'] extends DefaultRecord
  ? NonNullable<TMap['row']>
  : Tables[TMap['table']]['$inferSelect']
type TPKey<TMap extends OrmMapperMap> = TMap['primaryKey'] extends DefaultKey
  ? NonNullable<TMap['primaryKey']>
  : { id: number }
type TSKey<TMap extends OrmMapperMap> = TMap['secondaryKey'] extends DefaultKey
  ? NonNullable<TMap['secondaryKey']>
  : { key: string }

type OrmMapperTypes<T extends OrmMapperMap> = {
  $dto: {
    $select: Readonly<TDto<T> & TSKey<T>>
    $insert: Readonly<TDto<T> & TSKey<T>>
    $update: Readonly<Omit<Partial<TDto<T>>, keyof TSKey<T>>>
  }
  $orm: {
    $select: Readonly<Omit<TRow<T>, keyof TPKey<T>>>
    $insert: Readonly<Omit<TRow<T>, keyof TPKey<T>>>
    $update: Readonly<Partial<Omit<TRow<T>, keyof TPKey<T> | keyof TSKey<T>>>>
  }
  $key: TSKey<T>
}

export type OrmMapper<T extends OrmMapperMap> = Readonly<OrmMapperTypes<T> & {
  /**
   * DB selector that maps to the ORM model.
   */
  select: Record<keyof OrmMapperTypes<T>['$orm']['$select'], PgSelectedFieldsFlat['']>
  toDto: (values: OrmMapperTypes<T>['$orm']['$select']) => OrmMapperTypes<T>['$dto']['$select']
  fromDtoToInsert: (values: OrmMapperTypes<T>['$dto']['$insert']) => OrmMapperTypes<T>['$orm']['$insert']
  fromDtoToUpdate: (values: OrmMapperTypes<T>['$dto']['$update']) => OrmMapperTypes<T>['$orm']['$update']
}>

export const makeMapper = <T extends OrmMapperMap>() =>
  <const M extends Omit<OrmMapper<T>, `$${string}`>>(mapper: M) =>
    mapper as OrmMapper<T> & M
