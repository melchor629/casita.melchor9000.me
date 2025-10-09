import DataLoader from 'dataloader'

type PrismaTypeModel<Type extends string | number> = {
  payload: {
    scalars: { id: Type } & Record<string, unknown>
  }
  operations: {
    findMany: {
      args: {
        where?: { id?: Type | { in?: Type[] | object } }
      }
      result: Array<{ id?: Type }>
    }
  }
}
type PrismaDelegateType<
  EntityKeyType extends string | number,
  EntityTypeModel extends PrismaTypeModel<EntityKeyType>,
> = {
  [TOp in 'findMany']: (
    arg: EntityTypeModel['operations'][TOp]['args'],
  ) => Promise<EntityTypeModel['operations'][TOp]['result']>
}

class BaseRepository<
  EntityKeyType extends string | number,
  EntityTypeModel extends PrismaTypeModel<EntityKeyType>,
> {
  #dataLoaders: Map<string, DataLoader<unknown, unknown>>
  #repository

  constructor(repository: PrismaDelegateType<EntityKeyType, EntityTypeModel>) {
    this.#dataLoaders = new Map()
    this.#repository = repository
  }

  public get(key: EntityKeyType) {
    const dataLoader = this.#getDataLoader()
    return dataLoader.load(key)
  }

  public getMany(keys: EntityKeyType[]) {
    const dataLoader = this.#getDataLoader()
    return dataLoader.loadMany(keys)
  }

  protected get repository() {
    return this.#repository
  }

  protected getDataLoader<K, V>(
    key: string,
    loaderFn: DataLoader.BatchLoadFn<K, V>,
    loaderOptions?: DataLoader.Options<K, V>,
  ): DataLoader<K, V> {
    if (!this.#dataLoaders.has(key)) {
      this.#dataLoaders.set(key, new DataLoader(loaderFn, loaderOptions))
    }

    return this.#dataLoaders.get(key)! as DataLoader<K, V>
  }

  #getDataLoader() {
    return this.getDataLoader<EntityKeyType, EntityTypeModel['payload']['scalars'] | null>('get', async (keys) => {
      const results = await this.#repository.findMany({
        where: { id: { in: keys } },
      })
      return keys.map((k) => results.find(({ id }) => id === k) as EntityTypeModel['payload']['scalars'] ?? null)
    })
  }
}

export default BaseRepository
