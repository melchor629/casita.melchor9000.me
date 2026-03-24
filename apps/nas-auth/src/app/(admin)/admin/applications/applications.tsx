import { useNavigate } from '@melchor629/nice-ssr'
import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Text } from '@melchor629/ui'
import { Add } from '@melchor629/ui/icons'
import { useMemo, useState } from 'react'
import { useEnsureGetSession } from '#actions/queries/get-session.ts'
import AdminBreadcrumb from '#components/admin/admin-breadcrumb.tsx'
import { AddApplicationDialog } from '#components/admin/application/index.ts'
import type { GetApplications } from '#queries/get-applications.ts'

const breadcrumbSections = [{ name: 'Applications', part: 'applications' }]

type ApplicationsProps = Readonly<{
  applications: GetApplications
}>

const Applications = ({ applications }: ApplicationsProps) => {
  const { data: { permissions } } = useEnsureGetSession()
  const [opened, setOpened] = useState(false)
  const permission = useMemo(() => permissions.find((p) => p.key === 'application')!, [permissions])
  const navigate = useNavigate()

  return (
    <>
      <div className="flex justify-between items-baseline mb-2">
        <Text size="h2">Applications</Text>
        {permission.write && <Button type="button" size="small" onClick={() => setOpened(true)} icon={<Add />} />}
      </div>

      <Table className="mt-2 mb-4" hover full>
        <TableHead>
          <TableRow>
            <TableHeadCell>Key</TableHeadCell>
            <TableHeadCell>Name</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.map((application) => (
            <TableRow
              key={application.key}
              className="cursor-pointer"
              role="button"
              onClick={() => navigate(`/admin/applications/${application.key}`)}
            >
              <TableCell>{application.key}</TableCell>
              <TableCell>{application.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {permission.write && <AddApplicationDialog opened={opened} setOpened={setOpened} />}

      <AdminBreadcrumb sections={breadcrumbSections} />
    </>
  )
}

export default Applications
