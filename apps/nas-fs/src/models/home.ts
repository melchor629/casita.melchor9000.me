import { Type, type Static } from './type-helpers.ts'

export const HomeResponseSchema = Type.Object({
  version: Type.String(),
}, { title: 'HomeResponse', description: 'Hello!' })

export type HomeResponse = Static<typeof HomeResponseSchema>
