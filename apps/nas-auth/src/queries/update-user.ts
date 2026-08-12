import nasAuthDatabase, { eq } from '@melchor629/orm-nas-auth'
import { user } from '@melchor629/orm-nas-auth/schema'

type UpdateUserInput = {
  disabled?: boolean
  displayName?: string
  email?: string
  familyName?: string
  givenName?: string
  profileImageUrl?: string
  userName?: string
}

const updateUser = async (userId: number, values: UpdateUserInput) => {
  const [updatedUser] = await nasAuthDatabase
    .update(user)
    .set({
      disabled: values.disabled,
      displayName: values.displayName,
      email: values.email,
      familyName: values.familyName,
      givenName: values.givenName,
      profileImageUrl: values.profileImageUrl,
      userName: values.userName,
    })
    .where(eq(user.id, userId))
    .returning()

  return updatedUser
}

export default updateUser
