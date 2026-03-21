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
import ElementContextMenu from './element-context-menu'
import SelectionContextMenu from './selection-context-menu'

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
  const [optionsButtonElement, setOptionsButtonElement] = useState<HTMLElement | null>(null)
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)
  const [
    selectionOptionsButtonElement, setSelectionOptionsButtonElement,
  ] = useState<HTMLElement | null>(null)
  const [showSelectionOptionsMenu, setShowSelectionOptionsMenu] = useState(false)

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
            setShowOptionsMenu(false)
            setShowSelectionOptionsMenu((v) => !v)
          }}
          ref={setSelectionOptionsButtonElement}
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
            setShowSelectionOptionsMenu(false)
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
    setShowSelectionOptionsMenu(false)
  }, [metadata])

  useEffect(() => {
    if (selectedElements.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowSelectionOptionsMenu(false)
    }
  }, [selectedElements.length])

  useEffect(() => {
    const handler = () => {
      setShowOptionsMenu(false)
      setShowSelectionOptionsMenu(false)
    }

    window.addEventListener('contextmenu', handler, false)
    return () => window.removeEventListener('contextmenu', handler, false)
  }, [])

  return (
    <ButtonsBarContainer disabled={loading} role="group">
      {items.map((i) => <Fragment key={i.key}>{i}</Fragment>)}

      <ElementContextMenu
        buttonElement={optionsButtonElement}
        metadata={metadata}
        module={module}
        show={showOptionsMenu}
        shouldClose={useCallback(() => setShowOptionsMenu(false), [])}
      />
      <SelectionContextMenu
        buttonElement={selectionOptionsButtonElement}
        module={module}
        selectedElements={selectedElements}
        show={showSelectionOptionsMenu}
        shouldClose={useCallback(() => setShowSelectionOptionsMenu(false), [])}
      />
    </ButtonsBarContainer>
  )
}

export default ButtonsBar
