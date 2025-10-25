import { useRevalidator } from '@melchor629/nice-ssr'
import type { ChangeEvent, MouseEvent } from 'preact/compat'
import { useCallback, useState } from 'preact/hooks'
import { useAddApiResource } from '../../../actions/mutations/add-api-resource'
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Label,
} from '../../ui'

type AddApplicationApiResourceDialogProps = Readonly<{
  applicationId: string
  opened: boolean
  setOpened: (v: boolean) => void
}>

const AddApplicationApiResourceDialog = ({ applicationId, opened, setOpened }: AddApplicationApiResourceDialogProps) => {
  const addApiResourceMutation = useAddApiResource()
  const revalidate = useRevalidator()
  const [key, setKey] = useState('')
  const [name, setName] = useState('')
  const [audience, setAudience] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onClose = useCallback(() => setOpened(false), [setOpened])
  const keyChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => setKey(e.currentTarget.value), [])
  const nameChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => setName(e.currentTarget.value), [])
  const audienceChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => setAudience(e.currentTarget.value), [])

  const clearState = useCallback(() => {
    setKey('')
    setName('')
    setAudience('')
    setError(null)
    addApiResourceMutation.reset()
  }, [addApiResourceMutation])

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

    if (!audience) {
      setError('Audience is required')
      return
    }

    setError(null)
    addApiResourceMutation.mutate({
      appId: applicationId,
      audience,
      key,
      name,
    }, { onSuccess: () => { setOpened(false); void revalidate() } })
  }, [key, name, audience, addApiResourceMutation, applicationId, setOpened, revalidate])

  return (
    <Dialog open={opened} size="md" portal onClosed={clearState}>
      <DialogHeader onClose={onClose}>Add API Resource</DialogHeader>
      <DialogBody>
        <Label htmlFor="api-resource-key">Key</Label>
        <Input type="text" id="api-resource-key" value={key} onChange={keyChanged} />

        <Label htmlFor="api-resource-name">Name</Label>
        <Input type="text" id="api-resource-name" value={name} onChange={nameChanged} />

        <Label htmlFor="api-resource-audience">Audience</Label>
        <Input type="text" id="api-resource-audience" value={audience} onChange={audienceChanged} />

        {error && <p className="text-orange-700 dark:text-orange-300">{error}</p>}
        {addApiResourceMutation.error && <p className="text-orange-700 dark:text-orange-300">{addApiResourceMutation.error.message}</p>}
      </DialogBody>
      <DialogFooter className="text-end">
        <Button onClick={save} loading={addApiResourceMutation.isPending}>Save</Button>
      </DialogFooter>
    </Dialog>
  )
}

export default AddApplicationApiResourceDialog
