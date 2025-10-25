import { useCallback, useMemo } from 'preact/hooks'
import { Dialog, DialogBody, DialogHeader } from '../../ui'

type LoginDataDialogProps = Readonly<{
  data: unknown
  opened: boolean
  setOpened: (v: boolean) => void
}>

const LoginDataDialog = ({ data, opened, setOpened }: LoginDataDialogProps) => {
  const dataAsJson = useMemo(() => JSON.stringify(data, undefined, 2), [data])

  return (
    <Dialog portal size="xl" open={opened}>
      <DialogHeader onClose={useCallback(() => setOpened(false), [setOpened])}>
        Login Data
      </DialogHeader>
      <DialogBody>
        <pre className="overflow-x-auto">
          <code>{dataAsJson}</code>
        </pre>
      </DialogBody>
    </Dialog>
  )
}

export default LoginDataDialog
