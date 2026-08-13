import { user } from '@melchor629/orm-nas-auth/schema'
import { makeMapper } from '#queries/base-mapper.ts'

type UserDto = {
  disabled: boolean
  displayName: string
  email: string | null
  familyName: string | null
  givenName: string | null
  profileImageUrl: string | null
  userName: string
}

const userMapper = makeMapper<{
  table: 'user'
  dto: UserDto
  secondaryKey: { userName: string }
}>()({
  select: {
    disabled: user.disabled,
    displayName: user.displayName,
    email: user.email,
    familyName: user.familyName,
    givenName: user.givenName,
    profileImageUrl: user.profileImageUrl,
    userName: user.userName,
  },

  fromDtoToInsert: (values) => ({
    disabled: values.disabled,
    displayName: values.displayName,
    email: values.email,
    familyName: values.familyName,
    givenName: values.givenName,
    profileImageUrl: values.profileImageUrl,
    userName: values.userName,
  }),

  fromDtoToUpdate: (values) => ({
    disabled: values.disabled,
    displayName: values.displayName,
    email: values.email,
    familyName: values.familyName,
    givenName: values.givenName,
    profileImageUrl: values.profileImageUrl,
  }),

  toDto: (values) => ({
    disabled: values.disabled,
    displayName: values.displayName,
    email: values.email,
    familyName: values.familyName,
    givenName: values.givenName,
    profileImageUrl: values.profileImageUrl,
    userName: values.userName,
  }),
})

export default userMapper
