import { Button, Table, TableBody, TableContainer, TableHead, TableHeadCell, TableRow, Text } from '@melchor629/ui'
import { Add } from '@melchor629/ui/icons'
import { useState } from 'react'
import type { GetApplication } from '../../../../queries/get-application'
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
      <div className="flex justify-between items-baseline mb-2">
        <Text size="h3">API Resources</Text>
        {!readOnly && <Button type="button" size="small" onClick={() => setOpened(true)} icon={<Add />} />}
      </div>
      <TableContainer>
        <Table hover full>
          <TableHead>
            <TableRow>
              <TableHeadCell>Key</TableHeadCell>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Audience</TableHeadCell>
              <TableHeadCell>Scopes</TableHeadCell>
              <TableHeadCell>Token Format</TableHeadCell>
              <TableHeadCell>Token TTL</TableHeadCell>
              <TableHeadCell shrink>Actions</TableHeadCell>
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
      </TableContainer>

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
