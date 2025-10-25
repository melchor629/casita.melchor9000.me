'use client'

import { useNavigate } from '@melchor629/nice-ssr'
import { useMemo, useState } from 'preact/hooks'
import { useEnsureGetSession } from '#actions/queries/get-session.ts'
import AdminBreadcrumb from '#components/admin/admin-breadcrumb.tsx'
import { AddClientDialog } from '#components/admin/client/index.ts'
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
import type { GetClients } from '#queries/get-clients.ts'

const breadcrumbSections = [{ name: 'Clients', part: 'clients' }]

type ClientsProps = Readonly<{
  clients: GetClients
}>

const Clients = ({ clients }: ClientsProps) => {
  const [opened, setOpened] = useState(false)
  const { data: { permissions } } = useEnsureGetSession()
  const navigate = useNavigate()

  const permission = useMemo(() => permissions.find((p) => p.key === 'client')!, [permissions])

  return (
    <>
      <div className="flex justify-between mb-2">
        <H2>Clients</H2>
        {permission.write && <Button type="button" size="sm" onClick={() => setOpened(true)}>Add</Button>}
      </div>

      <Table className="mt-2 mb-2">
        <TableHead>
          <TableRow>
            <TableHeadColumn>ID</TableHeadColumn>
            <TableHeadColumn>Name</TableHeadColumn>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <TableRow
              key={client.clientId}
              hover
              className="cursor-pointer"
              role="button"
              onClick={() => navigate(`/admin/clients/${client.clientId}`)}
            >
              <TableColumn>{client.clientId}</TableColumn>
              <TableColumn>{client.clientName}</TableColumn>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {permission.write && <AddClientDialog opened={opened} setOpened={setOpened} />}

      <AdminBreadcrumb sections={breadcrumbSections} />
    </>
  )
}

export default Clients
