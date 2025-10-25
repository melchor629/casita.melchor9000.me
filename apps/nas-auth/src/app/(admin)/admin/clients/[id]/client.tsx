import type { ClientMetadata } from 'oidc-provider'
import { useMemo } from 'preact/hooks'
import { useEnsureGetSession } from '#actions/queries/get-session.ts'
import AdminBreadcrumb from '#components/admin/admin-breadcrumb.tsx'
import { EditClient } from '#components/admin/client/index.ts'
import { H2 } from '#components/ui/index.ts'

type ClientProps = Readonly<{
  apiResources: ReadonlyArray<{ key: string, name: string }>
  client: ClientMetadata
}>

const Client = ({ apiResources, client }: ClientProps) => {
  const { data: { permissions } } = useEnsureGetSession()

  const breadcrumbSections = useMemo(() => [
    { name: 'Clients', part: 'clients' },
    { name: client?.client_name ?? '', part: client?.client_id ?? '' },
  ], [client])
  const permission = useMemo(() => permissions.find((p) => p.key === 'client')!, [permissions])

  return (
    <>
      <H2>
        Client&nbsp;
        {client.client_name}
      </H2>

      <EditClient
        apiResources={apiResources}
        client={client}
        canDelete={permission.delete}
        readOnly={!permission.write}
      />

      <AdminBreadcrumb sections={breadcrumbSections} />
    </>
  )
}

export default Client
