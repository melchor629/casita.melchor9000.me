import DataLoader from 'dataloader'
import { In, Repository } from 'typeorm'

class BaseRepository<
  EntityType extends { id: EntityKeyType },
  EntityKeyType extends number | string = number,
> {
  #dataLoaders: Map<string, DataLoader<unknown, unknown>>
  #repository: Repository<EntityType>

  constructor(repository: Repository<EntityType>) {
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
    return this.getDataLoader('get', async (keys: readonly EntityKeyType[]) => {
      // @ts-expect-error the types are not working fine when using EntityKeyType
      const results = await this.#repository.findBy({
        id: In(keys),
      })
      return keys.map((k) => results.find(({ id }) => id === k) ?? null)
    })
  }
}

export default BaseRepository
