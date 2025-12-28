import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import { basename } from '@/utils/path'
import ClampedText from '../../clamped-text'
import withTouchEvents from '../../touch-events'
import DirectoryEntryIconView from '../directory-entry-icon-view'

const Cell = withTouchEvents(({
  className, entry, isParentItem, module, style, ...props
}: Readonly<React.ComponentPropsWithoutRef<'div'> & {
  entry: DirectoryMetadata | FileMetadata
  isParentItem: boolean
  module: string
}>) => (
  <div
    className={`entry text-center ${className ?? ''}`}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    <DirectoryEntryIconView module={module} size="grid" entry={entry} />
    <span className="w-full">
      <ClampedText lines={2}>{isParentItem ? '..' : basename(entry.path)}</ClampedText>
    </span>
  </div>
))

Cell.displayName = 'Cell'

export default Cell
