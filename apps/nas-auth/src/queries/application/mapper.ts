import { application } from '@melchor629/orm-nas-auth/schema'
import { makeMapper } from '#queries/base-mapper.ts'

type ApplicationDto = {
  key: string
  name: string
}

const applicationMapper = makeMapper<{
  table: 'application'
  dto: ApplicationDto
}>()({
  select: {
    key: application.key,
    name: application.name,
  },

  fromDtoToInsert: (values) => ({
    key: values.key,
    name: values.name,
  }),

  fromDtoToUpdate: (values) => ({
    name: values.name,
  }),

  toDto: (values) => ({
    key: values.key,
    name: values.name,
  }),
})

export default applicationMapper
