import nasAuthDatabase, { eq } from '@melchor629/orm-nas-auth'
import { login } from '@melchor629/orm-nas-auth/schema'

type UpdateLoginInput = {
  data?: Record<string, unknown>
  disabled?: boolean
}

const updateLogin = async (loginId: number, data: UpdateLoginInput) => {
  const [updatedLogin] = await nasAuthDatabase
    .update(login)
    .set({
      data: data.data,
      disabled: data.disabled,
    })
    .where(eq(login.id, loginId))
    .returning()

  return updatedLogin
}

export default updateLogin
