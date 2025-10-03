import { Type } from '../type-helpers.ts'

const pathWildcardParam = Type.Optional(Type.String({
  description: 'Path to an entry',
  title: 'pathWildcard',
}))

export default pathWildcardParam
