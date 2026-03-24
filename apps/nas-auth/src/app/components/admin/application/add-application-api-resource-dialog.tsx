import { useRevalidator } from '@melchor629/nice-ssr'
import { Button, Dialog, FormControlLabel, TextInput } from '@melchor629/ui'
import type { ChangeEvent, MouseEvent } from 'react'
import { useCallback, useState } from 'react'
import { useAddApiResource } from '../../../actions/mutations/add-api-resource'

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
    <Dialog
      id="add-application-api-resource"
      show={opened}
      size="medium"
      portal
      title="Add API Resource"
      onClose={onClose}
      onCloseEnd={clearState}
      buttons={[
        <Button key="save" onClick={save} loading={addApiResourceMutation.isPending}>Save</Button>,
      ]}
    >
      <FormControlLabel htmlFor="api-resource-key">Key</FormControlLabel>
      <TextInput type="text" id="api-resource-key" value={key} onChange={keyChanged} />

      <FormControlLabel htmlFor="api-resource-name" margin="normal">Name</FormControlLabel>
      <TextInput type="text" id="api-resource-name" value={name} onChange={nameChanged} />

      <FormControlLabel htmlFor="api-resource-audience" margin="normal">Audience</FormControlLabel>
      <TextInput type="text" id="api-resource-audience" value={audience} onChange={audienceChanged} />

      {error && <p className="text-orange-700 dark:text-orange-300">{error}</p>}
      {addApiResourceMutation.error && <p className="text-orange-700 dark:text-orange-300">{addApiResourceMutation.error.message}</p>}
    </Dialog>
  )
}

export default AddApplicationApiResourceDialog
