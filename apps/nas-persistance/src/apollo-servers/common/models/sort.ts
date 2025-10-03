import { registerEnumType } from 'type-graphql'

enum Sort {
  asc = 'ASC',
  desc = 'DESC',
}

registerEnumType(Sort, { name: 'Sort', description: 'The order to sort results through a field' })

export default Sort
