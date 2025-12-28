import { type FC, Fragment, useMemo } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import { humanBytes, unixPermissions } from '@/utils/number-format'
import * as Path from '@/utils/path'
import ReactRouterLink from '../core/react-router-link'
import ButtonsBar from './buttons-bar'
import HeaderContainer from './header-container'
import HeaderElement from './header-element'
import HeaderElementsContainer from './header-elements-container'
import HeaderTitle from './header-title'

interface HeaderProps {
  readonly module: string
  readonly metadata: DirectoryMetadata | FileMetadata
  readonly onClick: (e: React.MouseEvent) => void
  readonly loading: boolean
  readonly selectedElements: Array<DirectoryMetadata | FileMetadata>
}

const Header: FC<HeaderProps> = ({
  loading,
  metadata,
  module,
  onClick,
  selectedElements,
}) => (
  <HeaderContainer className="sticky z-10" onClick={onClick}>
    <HeaderTitle>{metadata.path === '/' ? module : Path.basename(metadata.path) || module}</HeaderTitle>
    <HeaderElementsContainer>
      <div className="text-body-small w-full mb-2">
        {Path.join('/', module, metadata.path)
          .split('/')
          .filter((p) => p)
          .map((p, i, a) => (
            <Fragment key={a.slice(0, i).join('/') || '/'}>
              /
              <ReactRouterLink to={`/${a.slice(0, i + 1).join('/')}`}>{p}</ReactRouterLink>
            </Fragment>
          ))}
      </div>

      <HeaderElement label="Size">
        {useMemo(() => humanBytes(metadata.stat.size), [metadata.stat.size])}
      </HeaderElement>
      <HeaderElement label="UID">
        {metadata.stat.uid}
      </HeaderElement>
      <HeaderElement label="GID">
        {metadata.stat.gid}
      </HeaderElement>
      <HeaderElement label="Perms">
        {useMemo(() => unixPermissions(metadata.stat.fileMode), [metadata.stat.fileMode])}
      </HeaderElement>
      <HeaderElement label="Type">
        {(metadata.mime && metadata.mime.mime) || metadata.type}
      </HeaderElement>
      <HeaderElement label="Access Time">
        {new Date(metadata.stat.accessTime.timestamp).toLocaleString()}
      </HeaderElement>
      <HeaderElement label="Change Time">
        {new Date(metadata.stat.changeTime.timestamp).toLocaleString()}
      </HeaderElement>
      <HeaderElement label="Modification Time">
        {new Date(metadata.stat.modificationTime.timestamp).toLocaleString()}
      </HeaderElement>
    </HeaderElementsContainer>

    <ButtonsBar
      loading={loading}
      module={module}
      metadata={metadata}
      selectedElements={selectedElements}
    />
  </HeaderContainer>
)

export default Header
