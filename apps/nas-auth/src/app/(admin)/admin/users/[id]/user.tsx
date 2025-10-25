import { useMemo } from 'preact/hooks'
import { useEnsureGetSession } from '#actions/queries/get-session.ts'
import AdminBreadcrumb from '#components/admin/admin-breadcrumb.tsx'
import { EditUser, EditUserLogins, EditUserPermissions } from '#components/admin/user/index.ts'
import { H2 } from '#components/ui/index.ts'
import type { GetPermissions } from '#queries/get-permissions.ts'
import type { GetUserQuery } from '#queries/get-user.ts'

const User = ({ permissions, user }: {
  readonly permissions: GetPermissions
  readonly user: GetUserQuery
}) => {
  const { data: { permissions: userPerms } } = useEnsureGetSession()

  const breadcrumbSections = useMemo(
    () => user ? [{ part: 'users', name: 'Users' }, { part: user.id.toString(), name: user.userName }] : [],
    [user],
  )
  const userPermission = useMemo(() => userPerms.find((p) => p.key === 'user')!, [userPerms])

  return (
    <>
      <H2>
        User&nbsp;
        {user.userName}
      </H2>

      <EditUser
        canDelete={userPermission.delete}
        readOnly={!userPermission.write}
        user={user}
      />

      <EditUserPermissions
        canDelete={userPermission.delete}
        readOnly={!userPermission.write}
        user={user}
        permissions={permissions}
      />

      <EditUserLogins
        canDelete={userPermission.delete}
        readOnly={!userPermission.write}
        user={user}
      />

      <AdminBreadcrumb sections={breadcrumbSections} />
    </>
  )
}

export default User
