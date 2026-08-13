import { Text } from '@melchor629/ui'
import { useMemo } from 'react'
import { useEnsureGetSession } from '#actions/queries/get-session.ts'
import AdminBreadcrumb from '#components/admin/admin-breadcrumb.tsx'
import { EditUser, EditUserLogins, EditUserPermissions } from '#components/admin/user/index.ts'
import type { GetApplications } from '#queries/application/get-applications.ts'
import type { GetPermissions } from '#queries/permission/get-permissions.ts'
import type { GetUserQuery } from '#queries/user/get-user.ts'

const User = ({ applications, permissions, user }: {
  readonly applications: GetApplications
  readonly permissions: GetPermissions
  readonly user: GetUserQuery
}) => {
  const { data: { permissions: userPerms } } = useEnsureGetSession()

  const breadcrumbSections = useMemo(
    () => user ? [{ part: 'users', name: 'Users' }, { part: user.userName, name: user.userName }] : [],
    [user],
  )
  const userPermission = useMemo(() => userPerms.find((p) => p.key === 'user')!, [userPerms])

  return (
    <>
      <Text size="h2">
        User&nbsp;
        {user.userName}
      </Text>

      <EditUser
        canDelete={userPermission.delete}
        readOnly={!userPermission.write}
        user={user}
      />

      <EditUserPermissions
        applications={applications}
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
