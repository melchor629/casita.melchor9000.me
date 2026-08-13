import { Text } from '@melchor629/ui'
import { useMemo } from 'react'
import { useEnsureGetSession } from '#actions/queries/get-session.ts'
import AdminBreadcrumb from '#components/admin/admin-breadcrumb.tsx'
import {
  EditApplication,
  EditApplicationApiResources,
  EditApplicationPermissions,
} from '#components/admin/application/index.ts'
import type { GetApplication } from '#queries/application/get-application.ts'

type ApplicationProps = Readonly<{
  application: GetApplication
}>

const Application = ({ application }: ApplicationProps) => {
  const { data: { permissions } } = useEnsureGetSession()

  const breadcrumbSections = useMemo(() => [
    { name: 'Applications', part: 'applications' },
    { name: application.name ?? '', part: application.key ?? '' },
  ], [application])

  const applicationPermission = useMemo(() => permissions.find((p) => p.key === 'application')!, [permissions])

  return (
    <>
      <Text size="h3">
        Application&nbsp;
        {application.name}
      </Text>

      <EditApplication
        application={application}
        canDelete={applicationPermission.delete}
        readOnly={!applicationPermission.write}
      />

      <EditApplicationPermissions
        application={application}
        canDelete={applicationPermission.delete}
        readOnly={!applicationPermission.write}
      />

      <EditApplicationApiResources
        application={application}
        canDelete={applicationPermission.delete}
        readOnly={!applicationPermission.write}
      />

      <AdminBreadcrumb sections={breadcrumbSections} />
    </>
  )
}

export default Application
