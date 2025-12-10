import { type FC, Fragment, useMemo } from 'react'
import { Link } from 'react-router'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import { humanBytes, unixPermissions } from '@/utils/number-format'
import * as Path from '@/utils/path'
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
  <HeaderContainer className="sticky-top" onClick={onClick}>
    <HeaderTitle>{metadata.path === '/' ? module : Path.basename(metadata.path) || module}</HeaderTitle>
    <HeaderElementsContainer>
      <small>
        {Path.join('/', module, metadata.path)
          .split('/')
          .filter((p) => p)
          .map((p, i, a) => (
            <Fragment key={a.slice(0, i).join('/') || '/'}>
              /
              <Link to={`/${a.slice(0, i + 1).join('/')}`}>{p}</Link>
            </Fragment>
          ))}
      </small>

      <HeaderElement>
        <small>Size</small>
        <span>{useMemo(() => humanBytes(metadata.stat.size), [metadata.stat.size])}</span>
      </HeaderElement>
      <HeaderElement>
        <small>UID</small>
        <span>{metadata.stat.uid}</span>
      </HeaderElement>
      <HeaderElement>
        <small>GID</small>
        <span>{metadata.stat.gid}</span>
      </HeaderElement>
      <HeaderElement>
        <small>Perms</small>
        <span>
          {useMemo(() => unixPermissions(metadata.stat.fileMode), [metadata.stat.fileMode])}
        </span>
      </HeaderElement>
      <HeaderElement>
        <small>Type</small>
        <span>{(metadata.mime && metadata.mime.mime) || metadata.type}</span>
      </HeaderElement>
      <HeaderElement>
        <small>Access Time</small>
        <span>{new Date(metadata.stat.accessTime.timestamp).toLocaleString()}</span>
      </HeaderElement>
      <HeaderElement>
        <small>Change Time</small>
        <span>{new Date(metadata.stat.changeTime.timestamp).toLocaleString()}</span>
      </HeaderElement>
      <HeaderElement>
        <small>Modification Time</small>
        <span>{new Date(metadata.stat.modificationTime.timestamp).toLocaleString()}</span>
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
