import { useCallback, useRef } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import useJobHandler from '@/hooks/use-job-handler'
import { FileUpload } from '../../icons'
import Button from './button'

interface UploadButtonProps {
  readonly module: string
  readonly metadata: DirectoryMetadata | FileMetadata
}

export default function UploadButton({ metadata, module }: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [jobsActions] = useJobHandler()

  const startUploading = useCallback((file: File) => {
    jobsActions.register({
      type: 'upload', module, directoryPath: metadata.path, file,
    }).catch(() => {})
  }, [metadata.path, module, jobsActions])

  const onChangeImpl: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    if (e.target.files) {
      startUploading(e.target.files[0])
    }
    e.target.value = e.target.defaultValue
  }, [startUploading])

  const onClickImpl = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }, [])

  return (
    <div className="upload-button">
      <Button onClick={onClickImpl}>
        <FileUpload width="18px" />
        <span> Upload</span>
      </Button>
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
