import type { GenericEventHandler } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  TextArea,
} from '../../ui'

type EditLoginDataDialogProps = Readonly<{
  close: (data?: unknown) => void
  data: unknown
  opened: boolean
}>

const EditLoginDataDialog = ({ close, data, opened }: EditLoginDataDialogProps) => {
  const [dataAsJson, setDataAsJson] = useState(() => JSON.stringify(data, undefined, 2))

  useEffect(() => {
    setDataAsJson(JSON.stringify(data, undefined, 2))
  }, [data])

  return (
    <Dialog portal size="xl" open={opened}>
      <DialogHeader onClose={useCallback(() => close(), [close])}>
        Login Data
      </DialogHeader>
      <DialogBody>
        <TextArea
          rows={10}
          className="w-full"
          value={dataAsJson}
          onChange={useCallback<GenericEventHandler<HTMLTextAreaElement>>((e) => setDataAsJson(e.currentTarget.value), [])}
        />
      </DialogBody>
      <DialogFooter className="text-end">
        <Button onClick={useCallback(() => close(JSON.parse(dataAsJson || 'null') as unknown), [close, dataAsJson])}>
          Save
        </Button>
        &nbsp;
        <Button onClick={useCallback(() => close(), [close])}>Cancel</Button>
      </DialogFooter>
    </Dialog>
  )
}

export default EditLoginDataDialog
