import Icon, { type IconProps as BaseIconProps } from './icon'

export type IconProps<T extends BaseIconProps['type'] = BaseIconProps['type']> = Omit<BaseIconProps & { type: T }, 'icon' | 'type'>

const makeMaterialIcon = (icon: string, title?: string) =>
  (props: IconProps<'material-symbols'>) => <Icon {...props} icon={icon} title={title} type="material-symbols" />
const makeFaRegularIcon = (icon: string, title?: string) =>
  (props: IconProps<'fontawesome-regular'>) => <Icon {...props} icon={icon} title={title} type="fontawesome-regular" />
const makeFaBrandsIcon = (icon: string, title?: string) =>
  (props: IconProps<'fontawesome-brands'>) => <Icon {...props} icon={icon} title={title} type="fontawesome-brands" />

// Material Symbols
export const AccountCircle = makeMaterialIcon('account_circle')
export const Add = makeMaterialIcon('add')
export const Android = makeMaterialIcon('android')
export const Apps = makeMaterialIcon('apps')
export const ArrowLeftAlt = makeMaterialIcon('arrow_left_alt')
export const ArrowRightAlt = makeMaterialIcon('arrow_right_alt')
export const ArrowUpward = makeMaterialIcon('arrow_upward')
export const CheckCircle = makeMaterialIcon('check_circle')
export const ContentCopy = makeMaterialIcon('content_copy')
export const Contrast = makeMaterialIcon('contrast')
export const CreateNewFolder = makeMaterialIcon('create_new_folder')
export const DarkMode = makeMaterialIcon('dark_mode')
export const DeleteForever = makeMaterialIcon('delete_forever')
export const DeleteSweep = makeMaterialIcon('delete_sweep')
export const Done = makeMaterialIcon('done')
export const Download = makeMaterialIcon('download')
export const Downloading = makeMaterialIcon('downloading')
export const DriveFileRenameOutline = makeMaterialIcon('drive_file_rename_outline')
export const Error = makeMaterialIcon('error', 'Icon representing error')
export const ExpandLess = makeMaterialIcon('expand_less')
export const ExpandMore = makeMaterialIcon('expand_more')
export const FileUpload = makeMaterialIcon('file_upload')
export const GridView = makeMaterialIcon('grid_view')
export const Home = makeMaterialIcon('home', 'Icon representing a home')
export const Info = makeMaterialIcon('info', 'Icon representing information')
export const KeyVertical = makeMaterialIcon('key_vertical', 'Icon representing a key in vertical')
export const Launch = makeMaterialIcon('launch')
export const LightMode = makeMaterialIcon('light_mode')
export const Link = makeMaterialIcon('link')
export const LiveTv = makeMaterialIcon('live_tv')
export const Logout = makeMaterialIcon('logout')
export const Manufacturing = makeMaterialIcon('manufacturing')
export const Menu = makeMaterialIcon('menu')
export const MoreVert = makeMaterialIcon('more_vert')
export const Movie = makeMaterialIcon('movie')
export const MusicNote = makeMaterialIcon('music_note')
export const Passkey = makeMaterialIcon('passkey', 'Passkey')
export const PersonEdit = makeMaterialIcon('person_edit')
export const PhotoLibrary = makeMaterialIcon('photo_library')
export const PlaylistPlay = makeMaterialIcon('playlist_play')
export const Redo = makeMaterialIcon('redo')
export const Remove = makeMaterialIcon('remove')
export const Search = makeMaterialIcon('search')
export const Settings = makeMaterialIcon('settings')
export const Stop = makeMaterialIcon('stop')
export const Sync = makeMaterialIcon('sync')
export const Warning = makeMaterialIcon('warning', 'Icon representing warning')

// fontawesome regular
// Note: maybe replace all of these with Material? (code, image, pdf missing)
export const FileAudio = makeFaRegularIcon('\uf1c7', 'Audio file')
export const FileCode = makeFaRegularIcon('\uf1c9', 'Programming code file')
export const FileImage = makeFaRegularIcon('\uf1c5', 'Image file')
export const FileVideo = makeFaRegularIcon('\uf1c8', 'video file')
export const FileZipper = makeFaRegularIcon('\uf1c6', 'Compressed file')
export const FileLines = makeFaRegularIcon('\uf15c', 'Text file')
export const FilePdf = makeFaRegularIcon('\uf1c1', 'PDF file')
export const File = makeFaRegularIcon('\uf15b', 'File')
export const Folder = makeFaRegularIcon('\uf07b', 'Folder')

// fontawesome brands
export const Google = makeFaBrandsIcon('\uf1a0', 'Google logo')
export const Github = makeFaBrandsIcon('\uf09b', 'Github logo')
