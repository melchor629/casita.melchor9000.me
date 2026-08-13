import { application, permission } from '@melchor629/orm-nas-auth/schema'
import { makeMapper } from '#queries/base-mapper.ts'

type PermissionDto = {
  name: string
  displayName: string | null
  applicationKey: string
}

type PermissionRow = {
  name: string
  displayName: string | null
  applicationKey: string
}

const permissionMapper = makeMapper<{
  table: 'permission'
  dto: PermissionDto
  row: PermissionRow
  secondaryKey: { name: string, applicationKey: string }
}>()({
  select: {
    name: permission.name,
    displayName: permission.displayName,
    applicationKey: application.key,
  },

  fromDtoToInsert: (values) => ({
    applicationKey: values.applicationKey,
    displayName: values.displayName,
    name: values.name,
  }),

  fromDtoToUpdate: (values) => ({
    displayName: values.displayName,
  }),

  toDto: (values) => ({
    applicationKey: values.applicationKey,
    displayName: values.displayName,
    name: values.name,
  }),
})

export default permissionMapper
