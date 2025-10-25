import { useNavigate } from '@melchor629/nice-ssr'
import type { ChangeEvent, MouseEvent } from 'preact/compat'
import { useCallback, useState } from 'preact/hooks'
import { useAddApplication } from '../../../actions/mutations/add-application'
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Label,
} from '../../ui'

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
    <Dialog open={opened} size="md" portal onClosed={clearState}>
      <DialogHeader onClose={onClose}>Add Application</DialogHeader>
      <DialogBody>
        <Label htmlFor="key">Key</Label>
        <Input type="text" id="key" value={key} onChange={keyChanged} />

        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" value={name} onChange={nameChanged} />

        {error && <p className="text-orange-700 dark:text-orange-300">{error}</p>}
      </DialogBody>
      <DialogFooter className="text-end">
        <Button onClick={save} loading={addApplicationMutation.isPending}>Save</Button>
      </DialogFooter>
    </Dialog>
  )
}

export default AddApplicationDialog
