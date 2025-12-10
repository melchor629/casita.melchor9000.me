import {
  type FC, useCallback, useEffect, useMemo, useState,
} from 'react'
import { Link } from 'react-router'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import * as Path from '@/utils/path'
import { ArrowUpward, MoreVert } from '../icons'
import ButtonContainer from './button-container'
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

  const buttonClass = 'btn btn-secondary btn-sm'
  const items = useMemo(() => {
    const buttons: Array<React.ReactElement> = []

    const parentUrl = Path.dirname(Path.join('/', module, metadata.path))
    const isRootPath = metadata.path === '/'
    if (!isRootPath) {
      buttons.push(
        <Link to={parentUrl} className={buttonClass} key="parent">
          <ArrowUpward width="18px" />
          <span> Parent</span>
        </Link>,
      )
    } else {
      buttons.push(
        <button type="button" className={buttonClass} disabled key="parent">
          <ArrowUpward width="18px" />
          <span> Parent</span>
        </button>,
      )
    }

    if (metadata.type === 'dir' && selectedElements.length > 0) {
      buttons.push(
        <button
          key="selection-options-menu"
          type="button"
          className={buttonClass}
          onClick={(e) => {
            e.stopPropagation()
            setShowOptionsMenu(false)
            setShowSelectionOptionsMenu((v) => !v)
          }}
          ref={setSelectionOptionsButtonElement}
          disabled={selectedElements.length === 0}
        >
          <MoreVert width="18px" />
          <span>Selection options</span>
        </button>,
      )
    } else {
      buttons.push(
        <button
          key="options-menu"
          type="button"
          className={buttonClass}
          onClick={(e) => {
            e.stopPropagation()
            setShowOptionsMenu((v) => !v)
            setShowSelectionOptionsMenu(false)
          }}
          ref={setOptionsButtonElement}
        >
          <MoreVert width="18px" />
          <span>
            {metadata.type === 'dir' ? 'Folder' : 'File'}
            {' '}
            options
          </span>
        </button>,
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
    <ButtonsBarContainer disabled={loading}>
      {items.map((i) => <ButtonContainer key={i.key}>{i}</ButtonContainer>)}

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
