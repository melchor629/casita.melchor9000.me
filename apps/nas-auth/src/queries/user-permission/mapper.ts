import { application, permission, user, userPermission } from '@melchor629/orm-nas-auth/schema'
import { makeMapper } from '#queries/base-mapper.ts'

type UserPermissionDto = {
  userName: string
  applicationKey: string
  permissionName: string
  delete: boolean
  write: boolean
}

type UserPermissionRow = {
  userName: string
  applicationKey: string
  permissionName: string
  delete: boolean
  write: boolean
}

const userPermissionMapper = makeMapper<{
  table: 'userPermission'
  dto: UserPermissionDto
  row: UserPermissionRow
  secondaryKey: {
    userName: string
    applicationKey: string
    permissionName: string
  }
}>()({
  select: {
    delete: userPermission.delete,
    applicationKey: application.key,
    permissionName: permission.name,
    userName: user.userName,
    write: userPermission.write,
  },

  fromDtoToInsert: (values) => ({
    delete: values.delete,
    applicationKey: values.applicationKey,
    permissionName: values.permissionName,
    userName: values.userName,
    write: values.write,
  }),

  fromDtoToUpdate: (values) => ({
    delete: values.delete,
    write: values.write,
  }),

  toDto: (values) => ({
    delete: values.delete,
    applicationKey: values.applicationKey,
    permissionName: values.permissionName,
    userName: values.userName,
    write: values.write,
  }),
})

export default userPermissionMapper
