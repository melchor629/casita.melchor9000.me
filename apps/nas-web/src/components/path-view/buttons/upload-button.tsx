import { MenuItem } from '@melchor629/ui'
import { FileUpload } from '@melchor629/ui/icons'
import { useCallback, useRef } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import useJobHandler from '@/hooks/use-job-handler'

interface UploadButtonProps {
  readonly module: string
  readonly metadata: DirectoryMetadata | FileMetadata
}

export default function UploadButton({ metadata, module }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [jobsActions] = useJobHandler()

  const startUploading = useCallback((file: File) => {
    jobsActions.register({
      type: 'upload',
      module,
      directoryPath: metadata.path,
      file,
    }).catch(() => {})
  }, [metadata.path, module, jobsActions])

  const onChangeImpl: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    if (e.target.files) {
      startUploading(e.target.files[0])
    }
    e.target.value = e.target.defaultValue
  }, [startUploading])

  const onClickImpl = useCallback(() => {
    inputRef.current?.click()
  }, [])

  return (
    <div>
      <MenuItem
        onAction={onClickImpl}
        icon={<FileUpload />}
        label="Upload"
      />
      <input
        type="file"
        id="upload-file-input"
        className="hidden"
        ref={inputRef}
        onChange={onChangeImpl}
      />
    </div>
  )
}
