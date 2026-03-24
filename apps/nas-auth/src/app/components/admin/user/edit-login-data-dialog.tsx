import { Button, Dialog, TextArea } from '@melchor629/ui'
import { useCallback, useEffect, useState, type ChangeEventHandler } from 'react'

type EditLoginDataDialogProps = Readonly<{
  close: (data?: Record<string, unknown> | null) => void
  data: Record<string, unknown> | null
  opened: boolean
}>

const EditLoginDataDialog = ({ close, data, opened }: EditLoginDataDialogProps) => {
  const [dataAsJson, setDataAsJson] = useState(() => JSON.stringify(data, undefined, 2))

  useEffect(() => {
    setDataAsJson(JSON.stringify(data, undefined, 2))
  }, [data])

  return (
    <Dialog
      id="edit-login-data"
      portal
      size="extra-large"
      show={opened}
      onClose={close}
      title="Login Data"
      buttons={[
        <Button key="save" onClick={useCallback(() => close(JSON.parse(dataAsJson || 'null') as Record<string, unknown> | null), [close, dataAsJson])}>
          Save
        </Button>,
      ]}
    >
      <TextArea
        rows={10}
        className="w-full"
        value={dataAsJson}
        onChange={useCallback<ChangeEventHandler<HTMLTextAreaElement>>((e) => setDataAsJson(e.currentTarget.value), [])}
      />
    </Dialog>
  )
}

export default EditLoginDataDialog
