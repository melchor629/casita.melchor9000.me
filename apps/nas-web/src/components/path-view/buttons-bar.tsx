import { Button } from '@melchor629/ui'
import ReactRouterButton from '@melchor629/ui/ReactRouterButton'
import { ArrowUpward, MoreVert } from '@melchor629/ui/icons'
import {
  type FC, Fragment, useCallback, useEffect, useMemo, useState,
} from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import * as Path from '@/utils/path'
import ButtonsBarContainer from './buttons-bar-container'
import EntriesContextMenu from './entries-context-menu'

interface ButtonsBarProps {
  readonly metadata: DirectoryMetadata | FileMetadata
  readonly module: string
  readonly loading: boolean
  readonly selectedElements: Array<DirectoryMetadata | FileMetadata>
}

const ButtonsBar: FC<ButtonsBarProps> = ({
  loading,
  metadata,
  module,
  selectedElements,
}) => {
  const currentThing = metadata.type === 'dir' && selectedElements.length > 0 ? selectedElements : metadata
  const [optionsButtonElement, setOptionsButtonElement] = useState<HTMLElement | null>(null)
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)
  const [thing, setThing] = useState(currentThing)

  if (thing !== currentThing) {
    if (showOptionsMenu) {
      setShowOptionsMenu(false)
    } else {
      setThing(currentThing)
    }
  }

  const items = useMemo(() => {
    const buttons: Array<React.ReactElement> = []

    const parentUrl = Path.dirname(Path.join('/', module, metadata.path))
    const isRootPath = metadata.path === '/'
    if (!isRootPath) {
      buttons.push(
        <ReactRouterButton
          to={parentUrl}
          variant="filled"
          color="secondary"
          key="parent"
          icon={<ArrowUpward />}
        >
          <span>Parent</span>
        </ReactRouterButton>,
      )
    } else {
      buttons.push(
        <Button
          type="button"
          variant="filled"
          color="secondary"
          disabled
          key="parent"
          icon={<ArrowUpward />}
        >
          Parent
        </Button>,
      )
    }

    if (metadata.type === 'dir' && selectedElements.length > 0) {
      buttons.push(
        <Button
          key="selection-options-menu"
          type="button"
          color="secondary"
          onClick={(e) => {
            e.stopPropagation()
            setShowOptionsMenu((v) => !v)
          }}
          ref={setOptionsButtonElement}
          disabled={selectedElements.length === 0}
          icon={<MoreVert />}
        >
          <span>Selection options</span>
        </Button>,
      )
    } else {
      buttons.push(
        <Button
          key="options-menu"
          type="button"
          color="secondary"
          onClick={(e) => {
            e.stopPropagation()
            setShowOptionsMenu((v) => !v)
          }}
          ref={setOptionsButtonElement}
          icon={<MoreVert />}
        >
          <span>
            {metadata.type === 'dir' ? 'Folder' : 'File'}
            {' '}
            options
          </span>
        </Button>,
      )
    }

    return buttons
  }, [module, metadata.path, metadata.type, selectedElements.length])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowOptionsMenu(false)
  }, [metadata])

  useEffect(() => {
    if (selectedElements.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowOptionsMenu(false)
    }
  }, [selectedElements.length])

  useEffect(() => {
    const ctrl = new AbortController()
    window.addEventListener('contextmenu', () => setShowOptionsMenu(false), { capture: false, signal: ctrl.signal })
    return () => ctrl.abort()
  }, [])

  return (
    <ButtonsBarContainer disabled={loading} role="group">
      {items.map((i) => <Fragment key={i.key}>{i}</Fragment>)}

      <EntriesContextMenu
        referenceElement={optionsButtonElement}
        entries={selectedElements.length > 0 ? selectedElements : metadata}
        module={module}
        show={showOptionsMenu}
        shouldClose={useCallback(() => setShowOptionsMenu(false), [])}
        onClosed={useCallback(() => setThing(currentThing), [currentThing])}
      />
    </ButtonsBarContainer>
  )
}

export default ButtonsBar
