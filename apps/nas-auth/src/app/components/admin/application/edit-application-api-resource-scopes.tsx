import { Button, Dialog, TextInput } from '@melchor629/ui'
import type { KeyboardEvent } from 'react'
import { useCallback, useState } from 'react'
import usePropState from '../../../hooks/use-sync-prop-state'

type EditApplicationApiResourceScopesProps = Readonly<{
  close: (scopes?: EditApplicationApiResourceScopesProps['scopes']) => void
  opened: boolean
  scopes: readonly string[]
}>

const EditApplicationApiResourceScopes = ({ close, opened, scopes }: EditApplicationApiResourceScopesProps) => {
  const [state, setState] = useState(scopes)
  usePropState(scopes, setState)

  const newScopeKeyUp = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      const value = e.currentTarget.value.trim()
      e.currentTarget.value = ''
      if (value) {
        setState((s) => [...new Set([...s, value])])
      }
    } else if (e.key === 'Escape') {
      e.stopPropagation()
      e.currentTarget.value = ''
    }
  }, [])

  const deleteScope = useCallback((scope: string) => setState((s) => {
    const idx = s.indexOf(scope)
    return [
      ...s.slice(0, idx),
      ...s.slice(idx + 1),
    ]
  }), [])

  return (
    <Dialog
      id="edit-applicaiton-api-resource-scopes"
      show={opened}
      portal
      size="extra-large"
      title="Scopes"
      onClose={useCallback(() => close(), [close])}
      buttons={[
        <Button key="save" onClick={useCallback(() => close(state), [close, state])}>
          Save
        </Button>,
      ]}
    >
      <div className="px-3 pt-2 pb-1 mb-2 border rounded-sm flex flex-wrap">
        {state.map((scope) => (
          <div key={scope} className="px-2 py-1 mr-1 mb-1 border rounded-sm select-none">
            {scope}
            &nbsp;
            <button type="button" onClick={() => deleteScope(scope)}>&times;</button>
          </div>
        ))}
        {state.length === 0 && <div className="text-body text-text-secondary">No scopes defined</div>}
      </div>
      <TextInput type="text" onKeyUp={newScopeKeyUp} />
    </Dialog>
  )
}

export default EditApplicationApiResourceScopes
