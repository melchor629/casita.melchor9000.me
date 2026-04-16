import type { VirtualElement } from '@floating-ui/react'
import { clsx } from '@melchor629/ui/utils'
import debounce from 'lodash-es/debounce'
import React, {
  type Ref,
  useCallback,
  useRef,
  useState,
} from 'react'
import {
  Virtuoso,
  VirtuosoGrid,
  type ContextProp,
  type ItemProps,
} from 'react-virtuoso'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import ElementContextMenu from '@/components/path-view/element-context-menu'
import usePermission from '@/hooks/use-permission'
import { useSettings } from '@/hooks/use-settings'
import * as path from '@/utils/path'
import SelectionContextMenu from '../../path-view/selection-context-menu'
import Cell from './cell'
import Entry, { type EntryData } from './entry'
import Row from './row'

type Metadata = DirectoryMetadata | FileMetadata

interface DirectoryEntriesProps {
  readonly isRoot: boolean
  readonly module: string
  readonly metadata: DirectoryMetadata
  readonly entries: Metadata[]
  readonly selectedElements: Array<Metadata>
  readonly onEntrySelected: (entry: Metadata, multi?: boolean) => void
  readonly onEntryDeselected: (entry: Metadata) => void
  readonly onEntryRangeSelect: (endRange: number | Metadata) => void
  readonly onEntryMove: (entry: Metadata, destination: DirectoryMetadata) => void
  readonly onEntryOpen: (entry: Metadata) => void
  readonly onUnselectAll: () => void
  readonly ref: Ref<HTMLDivElement>
}

const footerRenderer = () => <div className="entry-footer" />

const gridCellRenderer = (index: number, entry: Metadata, context: EntryData) => (
  <Entry
    Component={Cell}
    data={context}
    entry={entry}
    index={index}
  />
)

const listItemRenderer = (index: number, entry: Metadata, context: EntryData) => (
  <Entry
    Component={Row}
    data={context}
    entry={entry}
    index={index}
  />
)

const ListItem = ({ context: { selectedElements }, item, ...props }: ItemProps<Metadata> & ContextProp<EntryData>) => {
  const isSelected = selectedElements.find((e) => e.path === item.path) !== undefined
  return (
    <div
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      className={clsx(
        'directory-entries-item',
        isSelected && 'selected',
      )}
    />
  )
}

const DirectoryEntries = ({
  entries,
  isRoot,
  metadata,
  module,
  onEntryDeselected,
  onEntryMove,
  onEntryOpen,
  onEntryRangeSelect,
  onEntrySelected,
  onUnselectAll,
  ref: scrollingDiv,
  selectedElements,
}: DirectoryEntriesProps) => {
  const { entryViewType } = useSettings()
  const [draggingElement, setDraggingElement] = useState<Metadata | null>(null)
  const [dragOverElement, setDragOverElement] = useState<Metadata | null>(null)
  const [selectionElement, setSelectionElement] = useState<VirtualElement | null>(null)
  const [folderElement, setFolderElement] = useState<VirtualElement | null>(null)
  const [prevEntries, setPrevEntries] = useState(entries)
  const [prevSelectedElements, setPrevSelectedElements] = useState(selectedElements)
  const permission = usePermission(module)!

  if (entries !== prevEntries) {
    setPrevEntries(entries)
    setDraggingElement(null)
    setDragOverElement(null)
    setSelectionElement(null)
  }

  if (selectedElements !== prevSelectedElements) {
    setPrevSelectedElements(selectedElements)
    if (selectedElements.length === 0) {
      setSelectionElement(null)
    }
  }

  const hasWritePerm = permission.write
  const onDragStart = useCallback((entry: Metadata): React.DragEventHandler => (e) => {
    if (!hasWritePerm) {
      return
    }
    setSelectionElement(null)
    setDraggingElement(entry)
    e.dataTransfer.dropEffect = 'move'
    e.dataTransfer.setData('text/uri-list', `${window.location.toString()}/${path.basename(entry.path)}`)
  }, [hasWritePerm])

  const onDragEnd: React.DragEventHandler = useCallback(() => {
    if (!hasWritePerm) {
      return
    }
    setDraggingElement(null)
  }, [hasWritePerm])

  const onDragOver = useCallback((entry: Metadata): React.DragEventHandler => (e) => {
    if (!hasWritePerm) {
      return
    }
    e.preventDefault()
    if (draggingElement === null) {
      return
    }
    setDragOverElement(entry)
    e.dataTransfer.dropEffect = 'move'
  }, [hasWritePerm, draggingElement])

  const onDragLeave: React.DragEventHandler = useCallback((e) => {
    if (!hasWritePerm) {
      return
    }
    e.preventDefault()
    setDragOverElement(null)
  }, [hasWritePerm])

  const onDrop = useCallback((entry: Metadata): React.DragEventHandler => (e) => {
    if (!hasWritePerm) {
      return
    }
    e.preventDefault()
    if (draggingElement === null || entry.type === 'file') {
      return
    }
    onEntryMove(draggingElement, entry)
    setDragOverElement(null)
  }, [hasWritePerm, draggingElement, onEntryMove])

  const onClickCbkRef = useRef<(() => void) & { cancel: () => void } | null>(null)
  const onDoubleClick = useCallback((entry: Metadata): React.MouseEventHandler => () => {
    if (onClickCbkRef.current) {
      onClickCbkRef.current.cancel()
      onClickCbkRef.current = null
    }
    setSelectionElement(null)
    onEntryOpen(entry)
  }, [onClickCbkRef, onEntryOpen])

  const onClick = useCallback(
    (entry: Metadata, isSelected: boolean): React.MouseEventHandler => (e) => {
      e.persist()
      const cbk = debounce(() => {
        onClickCbkRef.current = null
        if (isSelected) {
          if (e.shiftKey) {
            onEntryRangeSelect(entries.indexOf(entry))
          } else if (e.ctrlKey || e.metaKey) {
            onEntryDeselected(entry)
          } else {
            onEntrySelected(entry, false)
          }
        } else if (e.ctrlKey || e.metaKey) {
          onEntrySelected(entry, true)
        } else if (e.shiftKey) {
          onEntryRangeSelect(entries.indexOf(entry))
        } else {
          onEntrySelected(entry)
        }
      }, 10)

      let shouldCall = true
      if (entryViewType === 'grid') {
        const tagName = (e.target as HTMLElement).tagName.toLowerCase()
        shouldCall = ['abbr', 'span', 'svg', 'path'].includes(tagName)
        shouldCall = shouldCall || (tagName === 'div' && !!(e.target as HTMLDivElement).getAttribute('style'))
      }

      if (!shouldCall) {
        return
      }

      e.stopPropagation()
      setSelectionElement(null)
      cbk()
      onClickCbkRef.current = cbk
    },
    [onEntryRangeSelect, onEntryDeselected, onEntrySelected, entries, entryViewType],
  )

  const onTap = useCallback((
    entry: Metadata,
    isSelected: boolean,
    isParentItem: boolean,
  ) => {
    if (selectedElements.length === 0) {
      onEntryOpen(entry)
    } else if (!isParentItem) {
      if (isSelected) {
        onEntryDeselected(entry)
      } else {
        onEntrySelected(entry, true)
      }
    }
  }, [onEntryOpen, onEntryDeselected, onEntrySelected, selectedElements.length])

  const onLongTap = useCallback((
    entry: Metadata,
    isSelected: boolean,
    isParentItem: boolean,
  ) => {
    if (!isParentItem) {
      if (isSelected) {
        onEntryDeselected(entry)
      } else {
        onEntrySelected(entry, true)
      }
    }
  }, [onEntryDeselected, onEntrySelected])

  const onContextMenu = useCallback((entry: Metadata, isSelected: boolean) =>
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (!isSelected) {
        onEntrySelected(entry)
      }

      const { pageX, pageY } = e
      setSelectionElement({
        getBoundingClientRect: () => ({
          top: pageY,
          left: pageX,
          bottom: 0,
          right: 0,
          x: pageX,
          y: pageY,
          width: 1,
          height: 1,
          toJSON: () => null,
        }),
      })
      setFolderElement(null)
    }
  , [onEntrySelected])

  const onOtherContextMenu = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    onUnselectAll()

    const { pageX, pageY } = e
    setSelectionElement(null)
    setFolderElement({
      getBoundingClientRect: () => ({
        top: pageY,
        left: pageX,
        bottom: 0,
        right: 0,
        x: pageX,
        y: pageY,
        width: 1,
        height: 1,
        toJSON: () => null,
      }),
    })
  }, [onUnselectAll])

  const onScrollerRefUpdated = useCallback((ref: HTMLElement | Window | null) => {
    if (typeof scrollingDiv === 'function') {
      scrollingDiv(ref as unknown as HTMLDivElement | null)
    } else if (scrollingDiv) {
      scrollingDiv.current = ref as unknown as HTMLDivElement | null
    }
  }, [scrollingDiv])

  const initialData = {
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
  }

  return (
    <>
      {entryViewType === 'grid' && (
        <VirtuosoGrid
          className="directory-entries-grid"
          data={entries}
          context={initialData}
          components={{
            Footer: footerRenderer,
          }}
          itemContent={gridCellRenderer}
          scrollerRef={onScrollerRefUpdated}
          onClick={onUnselectAll}
          onContextMenu={onOtherContextMenu}
        />
      )}
      {entryViewType === 'list' && (
        <Virtuoso
          className="directory-entries-list"
          data={entries}
          context={initialData}
          components={{
            Footer: footerRenderer,
            Item: ListItem,
          }}
          itemContent={listItemRenderer}
          computeItemKey={(_, item) => item.path}
          fixedItemHeight={32}
          scrollerRef={onScrollerRefUpdated}
          onClick={onUnselectAll}
          onContextMenu={onOtherContextMenu}
        />
      )}

      <SelectionContextMenu
        buttonElement={selectionElement}
        module={module}
        selectedElements={selectedElements}
        show={!!selectionElement}
        shouldClose={() => setSelectionElement(null)}
        placeStart
      />

      <ElementContextMenu
        buttonElement={folderElement}
        module={module}
        metadata={metadata}
        show={!!folderElement}
        shouldClose={() => setFolderElement(null)}
        placeStart
      />
    </>
  )
}

export default DirectoryEntries
