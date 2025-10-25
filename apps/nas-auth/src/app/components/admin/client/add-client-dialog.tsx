import { useNavigate } from '@melchor629/nice-ssr'
import type { ChangeEvent, MouseEvent } from 'preact/compat'
import { useCallback, useState } from 'preact/hooks'
import { useAddClient } from '../../../actions/mutations/add-client'
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Label,
} from '../../ui'

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
    <Dialog open={opened} size="md" portal onClosed={clearState}>
      <DialogHeader onClose={onClose}>Add Client</DialogHeader>
      <DialogBody>
        <Label htmlFor="id">ID</Label>
        <Input type="text" id="id" value={id} onChange={idChanged} />

        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" value={name} onChange={nameChanged} />

        {error && <p className="text-orange-700 dark:text-orange-300">{error}</p>}
      </DialogBody>
      <DialogFooter className="text-end">
        <Button onClick={save} loading={addClientMutation.isPending}>Save</Button>
      </DialogFooter>
    </Dialog>
  )
}

export default AddClientDialog
