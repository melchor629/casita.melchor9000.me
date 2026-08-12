import nasAuthDatabase from '@melchor629/orm-nas-auth'

const findLoginInfoForPasskey = async (loginId: string) => {
  const login = await nasAuthDatabase.query.login.findFirst({
    with: { user: true },
    where: {
      type: 'passkey',
      loginId,
    },
  })

  return login
}

export default findLoginInfoForPasskey
