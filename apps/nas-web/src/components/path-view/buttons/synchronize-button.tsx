import { type FC, useCallback } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import useJobHandler from '@/hooks/use-job-handler'
import { Sync } from '../../icons'
import Button from './button'

interface SynchronizeButtonProps {
  readonly module: string
  readonly entries: Array<DirectoryMetadata | FileMetadata>
}

const SynchronizeButton: FC<SynchronizeButtonProps> = ({ entries, module }) => {
  const [jobsActions] = useJobHandler()

  const synchronize = useCallback(() => {
    for (const metadata of entries) {
      jobsActions.register({
        type: 'synchronization',
        module,
        path: metadata.path,
        recursive: false,
      }).catch(() => {})
    }
  }, [module, entries, jobsActions])

  return (
    <Button onClick={synchronize}>
      <Sync width="14px" />
      <span> Synchronize</span>
    </Button>
  )
}

export default SynchronizeButton
