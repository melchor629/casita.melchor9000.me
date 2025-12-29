import { type FC, memo } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'

type Metadata = FileMetadata | DirectoryMetadata
type EntryProps = Readonly<{
  index: number
  data: EntryData
  Component: FC<(React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) & {
    entry: Metadata
    isParentItem: boolean
    module: string
    onTap?: (e: React.TouchEvent) => void
    onLongTap?: (e: React.TouchEvent) => void
    onContextMenu?: (e: React.MouseEvent) => void
  }>
  entry: Metadata
}>
export type EntryData = Readonly<{
  dragOverElement?: Metadata | null
  draggingElement?: Metadata | null
  entries: Metadata[]
  hasWritePerm: boolean
  isRoot: boolean
  module: string
  onClick: (entry: Metadata, isSelected: boolean) => React.MouseEventHandler
  onContextMenu: (entry: Metadata, isSelected: boolean) => React.MouseEventHandler
  onDoubleClick: (entry: Metadata) => React.MouseEventHandler
  onDragEnd: React.DragEventHandler
  onDragLeave: React.DragEventHandler
  onDragOver: (entry: Metadata) => React.DragEventHandler
  onDragStart: (entry: Metadata) => React.DragEventHandler
  onDrop: (entry: Metadata) => React.DragEventHandler
  onLongTap: (
    entry: Metadata,
    isSelected: boolean,
    isParentItem: boolean,
  ) => void
  onTap: (
    entry: Metadata,
    isSelected: boolean,
    isParentItem: boolean,
  ) => void
  selectedElements: Metadata[]
}>

const Entry = memo(({ Component, data, entry, index }: EntryProps) => {
  const {
    dragOverElement,
    draggingElement,
    entries,
    hasWritePerm,
    isRoot,
    module,
    onClick,
    onContextMenu,
    onDoubleClick,
    onDragEnd,
    onDragLeave,
    onDragOver,
    onDragStart,
    onDrop,
    onLongTap,
    onTap,
    selectedElements,
  } = data

  const acceptsDraggedElements = entry.type === 'dir'
    && (!draggingElement || entry.path !== draggingElement.path)
  const isSelected = selectedElements.find((e) => e.path === entry.path) !== undefined
  const isParentItem = index === 0 && !isRoot
  const parentItemShouldNotBeSelected = isParentItem && selectedElements.length > 0
  const isLastSelectedInGroup = isSelected && !selectedElements.includes(entries[index + 1])
  return (
    <Component
      key={entry.path}
      entry={entry}
      isParentItem={isParentItem}
      module={module}
      className={[
        draggingElement && entry.type === 'file' && entry.path !== draggingElement.path
          ? 'off'
          : '',
        draggingElement && entry.path === draggingElement.path ? 'off' : '',
        parentItemShouldNotBeSelected ? 'off' : '',
        dragOverElement && entry.type === 'dir' && dragOverElement.path === entry.path
          && 'drag-over',
        isSelected ? 'selected' : '',
        isLastSelectedInGroup ? 'last-selected' : '',
      ].filter((s) => !!s).join(' ')}
      onClick={isParentItem ? undefined : onClick(entry, isSelected)}
      onDoubleClick={onDoubleClick(entry)}
      draggable={hasWritePerm}
      onDragStart={onDragStart(entry)}
      onDragEnd={onDragEnd}
      onDragOver={acceptsDraggedElements ? onDragOver(entry) : undefined}
      onDragLeave={acceptsDraggedElements ? onDragLeave : undefined}
      onDrop={acceptsDraggedElements ? onDrop(entry) : undefined}
      onTap={() => onTap(entry, isSelected, isParentItem)}
      onLongTap={
        !parentItemShouldNotBeSelected ? () => onLongTap(entry, isSelected, isParentItem) : undefined
      }
      onContextMenu={isParentItem ? undefined : onContextMenu(entry, isSelected)}
    />
  )
})

Entry.displayName = 'Entry'

export default Entry
