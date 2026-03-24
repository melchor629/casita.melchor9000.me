import { useNavigate } from '@melchor629/nice-ssr'
import { Button, Dialog, FormControlLabel, TextInput } from '@melchor629/ui'
import { useCallback, useState, type ChangeEvent, type MouseEvent } from 'react'
import { useAddClient } from '../../../actions/mutations/add-client'

type AddClientDialogProps = Readonly<{
  opened: boolean
  setOpened: (v: boolean) => void
}>

const AddClientDialog = ({ opened, setOpened }: AddClientDialogProps) => {
  const addClientMutation = useAddClient()
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const onClose = useCallback(() => setOpened(false), [setOpened])
  const idChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => setId(e.currentTarget.value), [])
  const nameChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => setName(e.currentTarget.value), [])

  const clearState = useCallback(() => {
    setId('')
    setName('')
    setError(null)
  }, [])

  const save = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!id) {
      setError('ID is required')
      return
    }

    if (!name) {
      setError('Name is required')
      return
    }

    setError(null)
    addClientMutation.mutate({
      clientId: id,
      clientName: name,
    }, {
      onSuccess: (d) => {
        if (d) {
          navigate(`/admin/clients/${id}`)
          setOpened(false)
        }
      },
    })
  }, [id, name, addClientMutation, navigate, setOpened])

  return (
    <Dialog
      id="add-client"
      show={opened}
      size="medium"
      portal
      title="Add Client"
      onClose={onClose}
      onCloseEnd={clearState}
      buttons={[
        <Button key="save" onClick={save} loading={addClientMutation.isPending}>Save</Button>,
      ]}
    >
      <FormControlLabel htmlFor="id">ID</FormControlLabel>
      <TextInput type="text" id="id" value={id} onChange={idChanged} />

      <FormControlLabel htmlFor="name" margin="normal">Name</FormControlLabel>
      <TextInput type="text" id="name" value={name} onChange={nameChanged} />

      {error && <p className="text-orange-700 dark:text-orange-300">{error}</p>}
    </Dialog>
  )
}

export default AddClientDialog
