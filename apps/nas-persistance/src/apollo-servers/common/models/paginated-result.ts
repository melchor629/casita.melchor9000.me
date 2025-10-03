import {
  Field, Int, ObjectType,
} from 'type-graphql'

const createPaginatedResults = <Model, Class extends { new(): Model } | (() => Model)>(
  classType: Class,
) => {
  @ObjectType(`Paginated${classType.name}Results`, {
    simpleResolvers: true,
    description: 'Information about a disc of an album',
  })
  class PaginatedResultsBase {
    @Field(() => Int, { nullable: false, description: 'Number of results in total' })
    count!: number

    @Field(() => Int, { nullable: false, description: 'Number of pages in total' })
    pages!: number

    @Field(() => [classType], { nullable: false, description: 'Results for that page' })
    data!: Model[]

    constructor(queryResult?: [Model[], number], perPage?: number) {
      if (queryResult) {
        [this.data, this.count] = queryResult
        if (perPage) {
          this.pages = Math.ceil(this.count / perPage)
        } else {
          this.pages = 1
        }
      }
    }
  }

  return PaginatedResultsBase
}

export default createPaginatedResults
