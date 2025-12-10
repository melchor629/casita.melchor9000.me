import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import { basename } from '@/utils/path'
import withTouchEvents from '../../touch-events'
import DirectoryEntryIconView from '../directory-entry-icon-view'

const Row = withTouchEvents(({
  entry, isParentItem, module, ...props
}: Readonly<React.ComponentPropsWithoutRef<'div'> & {
  entry: DirectoryMetadata | FileMetadata
  isParentItem: boolean
  module: string
}>) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div {...props}>
    <DirectoryEntryIconView module={module} size={16} entry={entry} />
    {' '}
    <span className="text-truncate">{isParentItem ? '..' : basename(entry.path)}</span>
  </div>
))

Row.displayName = 'Row'

export default Row
