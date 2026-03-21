import { MenuItem } from '@melchor629/ui'
import { Sync } from '@melchor629/ui/icons'
import { type FC, useCallback } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import useJobHandler from '@/hooks/use-job-handler'

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
    <MenuItem
      onAction={synchronize}
      icon={<Sync />}
      label="Synchronize"
    />
  )
}

export default SynchronizeButton
