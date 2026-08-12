import nasAuthDatabase from '@melchor629/orm-nas-auth'

type GetUserRelationKeys = 'logins' | 'permissions' | 'userPermissions'
type GetUserRelations = Partial<Record<GetUserRelationKeys, boolean>>
type GetUserQueryLogins = Array<{
  id: number;
  data: unknown;
  type: string;
  loginId: string;
  disabled: boolean;
  userId: number;
}>

type ApplyRelation<Value, Condition extends boolean | undefined> =
  Condition extends true
    ? Value
    : Condition extends boolean
      ? Value | undefined
      : never

export type GetUserQuery<Relations extends GetUserRelations = Record<GetUserRelationKeys, true>> = Readonly<{
  id: number;
  disabled: boolean;
  userName: string;
  displayName: string;
  email: string | null;
  familyName: string | null;
  givenName: string | null;
  profileImageUrl: string | null;
  logins: ApplyRelation<GetUserQueryLogins, Relations['logins']>
  permissions: ApplyRelation<{
    id: number;
    userId: number;
    write: boolean;
    delete: boolean;
    permissionId: number;
    permission: ApplyRelation<{
      id: number;
      name: string;
      displayName?: string | null;
      application: {
        key: string
        name: string
      }
    }, Relations['permissions']>
  }[], Relations['userPermissions']>
}>

const getUser = async <TRel extends GetUserRelations>(
  arg: string | { userName: string } | { id: number },
  { logins, permissions, userPermissions }: TRel,
): Promise<GetUserQuery<TRel> | null> => {
  const result = await nasAuthDatabase.query.user.findFirst({
    with: {
      logins: !!logins,
      userPermissions: userPermissions
        ? {
            with: {
              permission: permissions
                ? {
                    with: { application: { columns: { key: true, name: true } } },
                    columns: { id: true, name: true, displayName: true },
                  }
                : false,
            },
          }
        : false,
    },
    where: typeof arg === 'string' ? { userName: arg } : arg,
  })
  if (!result) {
    return null
  }

  const user: GetUserQuery<TRel> = {
    ...result,
    logins: result.logins as GetUserQuery<TRel>['logins'],
    permissions: result.userPermissions as GetUserQuery<TRel>['permissions'],
  }
  return user
}

export default getUser
