import FileAudioSvg from '@svg-icons/fa-regular/file-audio.svg?react'
import FileCodeSvg from '@svg-icons/fa-regular/file-code.svg?react'
import FileImageSvg from '@svg-icons/fa-regular/file-image.svg?react'
import FileVideoSvg from '@svg-icons/fa-regular/file-video.svg?react'
import FileZipperSvg from '@svg-icons/fa-regular/file-zipper.svg?react'
import FileSvg from '@svg-icons/fa-regular/file.svg?react'
import FolderSvg from '@svg-icons/fa-regular/folder.svg?react'
import AndroidSvg from '@svg-icons/material-filled/android.svg?react'
import AppsSvg from '@svg-icons/material-filled/apps.svg?react'
import ArrowUpwardSvg from '@svg-icons/material-filled/arrow-upward.svg?react'
import ContentCopySvg from '@svg-icons/material-filled/content-copy.svg?react'
import ContrastSvg from '@svg-icons/material-filled/contrast.svg?react'
import CreateNewFolderSvg from '@svg-icons/material-filled/create-new-folder.svg?react'
import DarkModeSvg from '@svg-icons/material-filled/dark-mode.svg?react'
import DeleteForeverSvg from '@svg-icons/material-filled/delete-forever.svg?react'
import DeleteSweepSvg from '@svg-icons/material-filled/delete-sweep.svg?react'
import DoneSvg from '@svg-icons/material-filled/done.svg?react'
import DownloadSvg from '@svg-icons/material-filled/download.svg?react'
import DownloadingSvg from '@svg-icons/material-filled/downloading.svg?react'
import ExpandLessSvg from '@svg-icons/material-filled/expand-less.svg?react'
import ExpandMoreSvg from '@svg-icons/material-filled/expand-more.svg?react'
import FileUploadSvg from '@svg-icons/material-filled/file-upload.svg?react'
import GridViewSvg from '@svg-icons/material-filled/grid-view.svg?react'
import HomeSvg from '@svg-icons/material-filled/home.svg?react'
import LaunchSvg from '@svg-icons/material-filled/launch.svg?react'
import LightModeSvg from '@svg-icons/material-filled/light-mode.svg?react'
import LinkSvg from '@svg-icons/material-filled/link.svg?react'
import LiveTvSvg from '@svg-icons/material-filled/live-tv.svg?react'
import LogoutSvg from '@svg-icons/material-filled/logout.svg?react'
import MenuSvg from '@svg-icons/material-filled/menu.svg?react'
import MiscellaneousServicesSvg from '@svg-icons/material-filled/miscellaneous-services.svg?react'
import MoreVertSvg from '@svg-icons/material-filled/more-vert.svg?react'
import MovieSvg from '@svg-icons/material-filled/movie.svg?react'
import MusicNoteSvg from '@svg-icons/material-filled/music-note.svg?react'
import PhotoLibrarySvg from '@svg-icons/material-filled/photo-library.svg?react'
import PlaylistPlaySvg from '@svg-icons/material-filled/playlist-play.svg?react'
import RedoSvg from '@svg-icons/material-filled/redo.svg?react'
import RemoveSvg from '@svg-icons/material-filled/remove.svg?react'
import SearchSvg from '@svg-icons/material-filled/search.svg?react'
import SettingsSvg from '@svg-icons/material-filled/settings.svg?react'
import StopSvg from '@svg-icons/material-filled/stop.svg?react'
import SyncSvg from '@svg-icons/material-filled/sync.svg?react'
import DriveFileRenameOutlineSvg from '@svg-icons/material-outlined/drive-file-rename-outline.svg?react'
import FileBinarySvg from '@svg-icons/octicons/file-binary.svg?react'
import { forwardRef } from 'react'
import { styled } from 'styled-components'

export interface SvgIconProps extends React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> {
  readonly size?: number | string
  readonly title?: string
}

const SvgIconBase = forwardRef<SVGSVGElement, SvgIconProps & { readonly Component: typeof FileSvg }>(({
  Component,
  size,
  title,
  ...props
}, ref) => {
  const moreProps = {
    height: size,
    width: size,
    'aria-hidden': title == null ? true : undefined,
    focusable: false,
    role: title != null ? 'img' : undefined,
    title,
  }

  return <Component {...moreProps} {...props} ref={ref} />
})

const SvgIcon = styled(SvgIconBase)`
  display: inline-block;
  vertical-align: middle;
  overflow: hidden;
  font-size: inherit;
  width: 1em;
  height: 1em;
`

export const File = (props: SvgIconProps) => <SvgIcon Component={FileSvg} {...props} />
export const FileAudio = (props: SvgIconProps) => <SvgIcon Component={FileAudioSvg} {...props} />
export const FileCode = (props: SvgIconProps) => <SvgIcon Component={FileCodeSvg} {...props} />
export const FileImage = (props: SvgIconProps) => <SvgIcon Component={FileImageSvg} {...props} />
export const FileVideo = (props: SvgIconProps) => <SvgIcon Component={FileVideoSvg} {...props} />
export const FileZipper = (props: SvgIconProps) => <SvgIcon Component={FileZipperSvg} {...props} />
export const Folder = (props: SvgIconProps) => <SvgIcon Component={FolderSvg} {...props} />
export const Android = (props: SvgIconProps) => <SvgIcon Component={AndroidSvg} {...props} />
export const Apps = (props: SvgIconProps) => <SvgIcon Component={AppsSvg} {...props} />
export const ArrowUpward = (props: SvgIconProps) => (
  <SvgIcon Component={ArrowUpwardSvg} {...props} />
)
export const ContentCopy = (props: SvgIconProps) => (
  <SvgIcon Component={ContentCopySvg} {...props} />
)
export const Contrast = (props: SvgIconProps) => <SvgIcon Component={ContrastSvg} {...props} />
export const CreateNewFolder = (props: SvgIconProps) => (
  <SvgIcon Component={CreateNewFolderSvg} {...props} />
)
export const DarkMode = (props: SvgIconProps) => <SvgIcon Component={DarkModeSvg} {...props} />
export const DeleteForever = (props: SvgIconProps) => (
  <SvgIcon Component={DeleteForeverSvg} {...props} />
)
export const DeleteSweep = (props: SvgIconProps) => (
  <SvgIcon Component={DeleteSweepSvg} {...props} />
)
export const Done = (props: SvgIconProps) => <SvgIcon Component={DoneSvg} {...props} />
export const Download = (props: SvgIconProps) => <SvgIcon Component={DownloadSvg} {...props} />
export const Downloading = (props: SvgIconProps) => (
  <SvgIcon Component={DownloadingSvg} {...props} />
)
export const DriveFileRenameOutline = (props: SvgIconProps) => (
  <SvgIcon Component={DriveFileRenameOutlineSvg} {...props} />
)
export const ExpandLess = (props: SvgIconProps) => <SvgIcon Component={ExpandLessSvg} {...props} />
export const ExpandMore = (props: SvgIconProps) => <SvgIcon Component={ExpandMoreSvg} {...props} />
export const FileUpload = (props: SvgIconProps) => <SvgIcon Component={FileUploadSvg} {...props} />
export const GridView = (props: SvgIconProps) => <SvgIcon Component={GridViewSvg} {...props} />
export const Home = (props: SvgIconProps) => <SvgIcon Component={HomeSvg} {...props} />
export const Launch = (props: SvgIconProps) => <SvgIcon Component={LaunchSvg} {...props} />
export const LightMode = (props: SvgIconProps) => <SvgIcon Component={LightModeSvg} {...props} />
export const Link = (props: SvgIconProps) => <SvgIcon Component={LinkSvg} {...props} />
export const LiveTv = (props: SvgIconProps) => <SvgIcon Component={LiveTvSvg} {...props} />
export const Logout = (props: SvgIconProps) => <SvgIcon Component={LogoutSvg} {...props} />
export const Menu = (props: SvgIconProps) => <SvgIcon Component={MenuSvg} {...props} />
export const MiscellaneousServices = (props: SvgIconProps) => (
  <SvgIcon Component={MiscellaneousServicesSvg} {...props} />
)
export const MoreVert = (props: SvgIconProps) => <SvgIcon Component={MoreVertSvg} {...props} />
export const Movie = (props: SvgIconProps) => <SvgIcon Component={MovieSvg} {...props} />
export const MusicNote = (props: SvgIconProps) => <SvgIcon Component={MusicNoteSvg} {...props} />
export const PhotoLibrary = (props: SvgIconProps) => (
  <SvgIcon Component={PhotoLibrarySvg} {...props} />
)
export const PlaylistPlay = (props: SvgIconProps) => (
  <SvgIcon Component={PlaylistPlaySvg} {...props} />
)
export const Redo = (props: SvgIconProps) => <SvgIcon Component={RedoSvg} {...props} />
export const Remove = (props: SvgIconProps) => <SvgIcon Component={RemoveSvg} {...props} />
export const Search = (props: SvgIconProps) => <SvgIcon Component={SearchSvg} {...props} />
export const Settings = (props: SvgIconProps) => <SvgIcon Component={SettingsSvg} {...props} />
export const Stop = (props: SvgIconProps) => <SvgIcon Component={StopSvg} {...props} />
export const Sync = (props: SvgIconProps) => <SvgIcon Component={SyncSvg} {...props} />
export const FileBinary = (props: SvgIconProps) => <SvgIcon Component={FileBinarySvg} {...props} />
