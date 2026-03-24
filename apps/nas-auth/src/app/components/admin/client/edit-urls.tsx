import { Button, TextInput } from '@melchor629/ui'
import type { ClientMetadata } from 'oidc-provider'
import { useCallback, type KeyboardEvent } from 'react'

type EditUrlsProps = Readonly<{
  client: ClientMetadata
  field: keyof ClientMetadata
  setClient: (fn: (client: ClientMetadata) => ClientMetadata) => void
}>

const EditUrls = ({ client, field, setClient }: EditUrlsProps) => {
  const valueKeyUp = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    if (e.key === 'Enter') {
      e.currentTarget.value = ''
      if (URL.canParse(value)) {
        setClient((c) => ({ ...c, [field]: [...(c[field] as string[] || []), value] }))
      }
    }
  }, [field, setClient])

  const removeValue = useCallback((value: string) => {
    setClient((c) => {
      const array = c[field] as string[]
      const idx = array.indexOf(value)
      return {
        ...c,
        [field]: [
          ...array.slice(0, idx),
          ...array.slice(idx + 1),
        ],
      }
    })
  }, [setClient, field])

  if (typeof field !== 'string') return null
  const fieldValue = (client[field] ?? []) as readonly string[]
  return (
    <div className="mb-4">
      {fieldValue.map((value) => (
        <div key={value} className="m-1">
          <Button size="small" variant="text" color="error" onClick={() => removeValue(value)}>&times;</Button>
          <span>{` ${value}`}</span>
        </div>
      ))}
      {fieldValue.length === 0 && (
        <div className="m-1 text-center select-none opacity-75 pb-1">
          Empty (fill the input and press enter to add one)
        </div>
      )}

      <TextInput size="small" type="url" id={field} onKeyUp={valueKeyUp} placeholder="URL (press enter to add)" />
    </div>
  )
}

export default EditUrls
