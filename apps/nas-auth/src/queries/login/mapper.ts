import { login, user } from '@melchor629/orm-nas-auth/schema'
import { makeMapper } from '#queries/base-mapper.ts'

type LoginDto = {
  data: unknown
  disabled: boolean
  type: 'github' | 'google' | 'local' | 'passkey'
  loginId: string
  userName: string
}

type LoginRow = {
  data: unknown
  disabled: boolean
  type: string
  loginId: string
  userName: string
}

const loginMapper = makeMapper<{
  table: 'login'
  dto: LoginDto
  row: LoginRow
  secondaryKey: { type: string, loginId: string, userName: string }
}>()({
  select: {
    data: login.data,
    disabled: login.disabled,
    loginId: login.loginId,
    type: login.type,
    userName: user.userName,
  },

  fromDtoToInsert: (values) => ({
    data: values.data,
    disabled: values.disabled,
    loginId: values.loginId,
    type: values.type,
    userName: values.userName,
  }),

  fromDtoToUpdate: (values) => ({
    data: values.data,
    disabled: values.disabled,
  }),

  toDto: (values) => ({
    data: values.data,
    disabled: values.disabled,
    loginId: values.loginId,
    type: values.type as LoginDto['type'],
    userName: values.userName,
  }),
})

export default loginMapper
