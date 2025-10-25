import { useRevalidator } from '@melchor629/nice-ssr'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { useEditApplication } from '../../../actions/mutations/edit-application'
import { useRemoveApplication } from '../../../actions/mutations/remove-application'
import {
  Button,
  Input,
  Label,
} from '../../ui'

const EditApplication = ({ application, canDelete, readOnly }) => {
  const editApplicationMutation = useEditApplication()
  const removeApplicationMutation = useRemoveApplication()
  const revalidate = useRevalidator()
  const [name, setName] = useState(application.name || '')

  const save = useCallback((e) => {
    e.preventDefault()

    if (readOnly) {
      return
    }

    editApplicationMutation.mutate({
      key: application.key,
      name,
    }, { onSuccess: revalidate })
  }, [
    application.key, readOnly,
    editApplicationMutation, revalidate,
    name,
  ])

  const remove = useCallback((e) => {
    e.preventDefault()

    if (readOnly || !canDelete) {
      return
    }

    removeApplicationMutation.mutate(application.key)
  }, [readOnly, canDelete, removeApplicationMutation, application.key])

  useEffect(() => {
    setName(application.name || '')
  }, [application])

  return (
    <fieldset className="my-2" disabled={readOnly || editApplicationMutation.isPending || removeApplicationMutation.isPending}>
      <Label htmlFor="key">Key</Label>
      <Input
        type="text"
        id="key"
        value={application.key}
        readOnly
      />

      <Label htmlFor="name">Name</Label>
      <Input
        type="text"
        id="name"
        value={name}
        readOnly={readOnly}
        onChange={useCallback((e) => setName(e.target.value), [])}
      />

      <div className="flex justify-end gap-2 mt-4">
        {!readOnly && (
          <Button
            type="button"
            disabled={removeApplicationMutation.isPending}
            loading={editApplicationMutation.isPending}
            onClick={save}
          >
            Save
          </Button>
        )}
        {!readOnly && canDelete && (
          <Button
            type="button"
            disabled={editApplicationMutation.isPending}
            loading={removeApplicationMutation.isPending}
            onClick={remove}
          >
            Delete
          </Button>
        )}
      </div>
    </fieldset>
  )
}

export default EditApplication
