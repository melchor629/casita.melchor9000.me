import { useNavigate } from '@melchor629/nice-ssr'
import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Text } from '@melchor629/ui'
import { Add } from '@melchor629/ui/icons'
import { useMemo, useState } from 'react'
import { useEnsureGetSession } from '#actions/queries/get-session.ts'
import AdminBreadcrumb from '#components/admin/admin-breadcrumb.tsx'
import { AddClientDialog } from '#components/admin/client/index.ts'
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
      <div className="flex justify-between items-baseline mb-2">
        <Text size="h2">Clients</Text>
        {permission.write && <Button type="button" size="small" onClick={() => setOpened(true)} icon={<Add />} />}
      </div>

      <Table className="mt-2 mb-4" full hover>
        <TableHead>
          <TableRow>
            <TableHeadCell>ID</TableHeadCell>
            <TableHeadCell>Name</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <TableRow
              key={client.clientId}
              className="cursor-pointer"
              role="button"
              onClick={() => navigate(`/admin/clients/${client.clientId}`)}
            >
              <TableCell>{client.clientId}</TableCell>
              <TableCell>{client.clientName}</TableCell>
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
