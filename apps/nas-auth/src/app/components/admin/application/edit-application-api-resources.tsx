import { useState } from 'preact/hooks'
import type { GetApplication } from '../../../../queries/get-application'
import {
  Button,
  H3,
  Table,
  TableBody,
  TableHead,
  TableHeadColumn,
  TableRow,
} from '../../ui'
import AddApplicationApiResourceDialog from './add-application-api-resource-dialog'
import EditApplicationApiResourceRow from './edit-application-api-resource-row'

type EditApplicationApiResourcesProps = Readonly<{
  application: GetApplication
  canDelete: boolean
  readOnly: boolean
}>

const EditApplicationApiResources = ({
  application: { apiResources, key: applicationId },
  canDelete,
  readOnly,
}: EditApplicationApiResourcesProps) => {
  const [opened, setOpened] = useState(false)

  return (
    <div className="mt-8 mb-6">
      <div className="flex justify-between mb-2">
        <H3>API Resources</H3>
        {!readOnly && <Button type="button" size="sm" onClick={() => setOpened(true)}>Add</Button>}
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeadColumn>Key</TableHeadColumn>
            <TableHeadColumn>Name</TableHeadColumn>
            <TableHeadColumn>Audience</TableHeadColumn>
            <TableHeadColumn>Scopes</TableHeadColumn>
            <TableHeadColumn>Token Format</TableHeadColumn>
            <TableHeadColumn>Token TTL</TableHeadColumn>
            <TableHeadColumn shrink>Actions</TableHeadColumn>
          </TableRow>
        </TableHead>
        <TableBody>
          {apiResources.map((apiResource) => (
            <EditApplicationApiResourceRow
              key={apiResource.key}
              appId={applicationId}
              apiResource={apiResource}
              canDelete={canDelete}
              readOnly={readOnly}
            />
          ))}
        </TableBody>
      </Table>

      {!readOnly && (
        <AddApplicationApiResourceDialog
          applicationId={applicationId}
          opened={opened}
          setOpened={setOpened}
        />
      )}
    </div>
  )
}

export default EditApplicationApiResources
