import { Dialog } from '@melchor629/ui'
import { useCallback, useMemo } from 'react'

type LoginDataDialogProps = Readonly<{
  data: unknown
  opened: boolean
  setOpened: (v: boolean) => void
}>

const LoginDataDialog = ({ data, opened, setOpened }: LoginDataDialogProps) => {
  const dataAsJson = useMemo(() => JSON.stringify(data, undefined, 2), [data])

  return (
    <Dialog id="show-login-data" portal size="extra-large" title="Login Data" show={opened} onClose={useCallback(() => setOpened(false), [setOpened])}>
      <pre className="overflow-x-auto">
        <code>{dataAsJson}</code>
      </pre>
    </Dialog>
  )
}

export default LoginDataDialog
