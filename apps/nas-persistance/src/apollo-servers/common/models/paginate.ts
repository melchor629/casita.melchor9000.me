import { Field, InputType } from 'type-graphql'

@InputType({ description: 'Paginates results' })
export default class Paginate {
  @Field({ defaultValue: 0, description: 'Number of results to skip' })
  skip!: number

  @Field({ defaultValue: 10, description: 'Number of results to return after the skipped ones' })
  take!: number
}
