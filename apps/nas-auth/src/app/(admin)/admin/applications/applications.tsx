'use client'

import { useNavigate } from '@melchor629/nice-ssr'
import { useMemo, useState } from 'preact/hooks'
import { useEnsureGetSession } from '#actions/queries/get-session.ts'
import AdminBreadcrumb from '#components/admin/admin-breadcrumb.tsx'
import { AddApplicationDialog } from '#components/admin/application/index.ts'
import {
  Button,
  H2,
  Table,
  TableBody,
  TableColumn,
  TableHead,
  TableHeadColumn,
  TableRow,
} from '#components/ui/index.ts'
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
      <div className="flex justify-between mb-2">
        <H2>Applications</H2>
        {permission.write && <Button type="button" size="sm" onClick={() => setOpened(true)}>Add</Button>}
      </div>

      <Table className="mt-2 mb-2">
        <TableHead>
          <TableRow>
            <TableHeadColumn>Key</TableHeadColumn>
            <TableHeadColumn>Name</TableHeadColumn>
          </TableRow>
        </TableHead>
        <TableBody>
          {applications.map((application) => (
            <TableRow
              key={application.key}
              hover
              className="cursor-pointer"
              role="button"
              onClick={() => navigate(`/admin/applications/${application.key}`)}
            >
              <TableColumn>{application.key}</TableColumn>
              <TableColumn>{application.name}</TableColumn>
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
