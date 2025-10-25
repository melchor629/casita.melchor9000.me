import type { KeyboardEvent } from 'preact/compat'
import { useCallback, useEffect, useState } from 'preact/hooks'
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
} from '../../ui'

type EditApplicationApiResourceScopesProps = Readonly<{
  close: (scopes?: EditApplicationApiResourceScopesProps['scopes']) => void
  opened: boolean
  scopes: readonly string[]
}>

const EditApplicationApiResourceScopes = ({ close, opened, scopes }: EditApplicationApiResourceScopesProps) => {
  const [state, setState] = useState(scopes)

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

  useEffect(() => {
    setState(scopes)
  }, [scopes])

  return (
    <Dialog portal size="xl" open={opened}>
      <DialogHeader onClose={useCallback(() => close(), [close])}>
        Scopes
      </DialogHeader>
      <DialogBody>
        <div className="px-3 pt-2 pb-1 mb-2 border rounded-sm flex flex-wrap">
          {state.map((scope) => (
            <div key={scope} className="px-2 py-1 mr-1 mb-1 border rounded-sm select-none">
              {scope}
              &nbsp;
              <button type="button" onClick={() => deleteScope(scope)}>&times;</button>
            </div>
          ))}
        </div>
        <Input type="text" onKeyUp={newScopeKeyUp} />
      </DialogBody>
      <DialogFooter className="text-end">
        <Button onClick={useCallback(() => close(state), [close, state])}>
          Save
        </Button>
        &nbsp;
        <Button onClick={useCallback(() => close(), [close])}>Cancel</Button>
      </DialogFooter>
    </Dialog>
  )
}

export default EditApplicationApiResourceScopes
