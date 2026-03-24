import { useRevalidator } from '@melchor629/nice-ssr'
import { Button, FormControlLabel, TextInput } from '@melchor629/ui'
import { useCallback, useEffect, useState, type ChangeEvent, type MouseEvent } from 'react'
import { useEditApplication } from '../../../actions/mutations/edit-application'
import { useRemoveApplication } from '../../../actions/mutations/remove-application'

type EditApplicationProps = Readonly<{
  application: { key: string, name: string }
  canDelete: boolean
  readOnly: boolean
}>

const EditApplication = ({ application, canDelete, readOnly }: EditApplicationProps) => {
  const editApplicationMutation = useEditApplication()
  const removeApplicationMutation = useRemoveApplication()
  const revalidate = useRevalidator()
  const [name, setName] = useState(application.name || '')

  const save = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (readOnly) {
      return
    }

    editApplicationMutation.mutate({
      key: application.key,
      name,
    }, { onSuccess: () => { revalidate().catch(() => {}) } })
  }, [
    application.key, readOnly,
    editApplicationMutation, revalidate,
    name,
  ])

  const remove = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (readOnly || !canDelete) {
      return
    }

    removeApplicationMutation.mutate(application.key)
  }, [readOnly, canDelete, removeApplicationMutation, application.key])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(application.name || '')
  }, [application])

  return (
    <fieldset className="my-2" disabled={readOnly || editApplicationMutation.isPending || removeApplicationMutation.isPending}>
      <FormControlLabel htmlFor="key">Key</FormControlLabel>
      <TextInput
        type="text"
        id="key"
        value={application.key}
        readOnly
      />

      <FormControlLabel htmlFor="name" margin="normal">Name</FormControlLabel>
      <TextInput
        type="text"
        id="name"
        value={name}
        readOnly={readOnly}
        onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => setName(e.target.value), [])}
      />

      <div className="flex justify-end gap-2 mt-4">
        {!readOnly && (
          <Button
            type="button"
            disabled={removeApplicationMutation.isPending}
            loading={editApplicationMutation.isPending}
            onClick={save}
            variant="text"
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
            variant="text"
            color="error"
          >
            Delete
          </Button>
        )}
      </div>
    </fieldset>
  )
}

export default EditApplication
