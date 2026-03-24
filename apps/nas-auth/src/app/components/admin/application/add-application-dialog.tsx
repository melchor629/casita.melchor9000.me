import { useNavigate } from '@melchor629/nice-ssr'
import { Button, Dialog, FormControlLabel, TextInput } from '@melchor629/ui'
import type { ChangeEvent, MouseEvent } from 'react'
import { useCallback, useState } from 'react'
import { useAddApplication } from '../../../actions/mutations/add-application'

type AddApplicationDialogProps = Readonly<{
  opened: boolean
  setOpened: (v: boolean) => void
}>

const AddApplicationDialog = ({ opened, setOpened }: AddApplicationDialogProps) => {
  const addApplicationMutation = useAddApplication()
  const [key, setKey] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const onClose = useCallback(() => setOpened(false), [setOpened])
  const keyChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => setKey(e.currentTarget.value), [])
  const nameChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => setName(e.currentTarget.value), [])

  const clearState = useCallback(() => {
    setKey('')
    setName('')
    setError(null)
    addApplicationMutation.reset()
  }, [addApplicationMutation])

  const save = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!key) {
      setError('Key is required')
      return
    }

    if (!name) {
      setError('Name is required')
      return
    }

    setError(null)
    addApplicationMutation.mutate(
      { key, name },
      {
        onSuccess: (app) => {
          if (app) {
            setOpened(false)
            navigate(`/admin/applications/${app.key}`)
          }
        },
      },
    )
  }, [setOpened, navigate, addApplicationMutation, key, name])

  return (
    <Dialog
      id="add-application"
      show={opened}
      size="medium"
      portal
      title="Add Application"
      onClose={onClose}
      onCloseEnd={clearState}
      buttons={[
        <Button key="save" onClick={save} loading={addApplicationMutation.isPending}>Save</Button>,
      ]}
    >
      <FormControlLabel htmlFor="key">Key</FormControlLabel>
      <TextInput type="text" id="key" value={key} onChange={keyChanged} />

      <FormControlLabel htmlFor="name" margin="normal">Name</FormControlLabel>
      <TextInput type="text" id="name" value={name} onChange={nameChanged} />

      {error && <p className="text-orange-700 dark:text-orange-300">{error}</p>}
    </Dialog>
  )
}

export default AddApplicationDialog
