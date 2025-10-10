import plexImage from './plex.png'
import qbittorrentImage from './qbittorrent.svg'

export type Entry = Readonly<{
  id: string
  icon?: string
  name: string
  url: string
  label?: string
  limitedTo?: ReadonlyArray<string>
}>

const melchorSubs = ['melchor9000', 'Melchor']

const entries: ReadonlyArray<Entry | 'space'> = Object.freeze([
  {
    id: 'plex',
    icon: plexImage,
    name: 'Plex',
    url: 'https://media.melchor9000.me',
  },
  {
    id: 'nas-web',
    icon: '//nas.melchor9000.me/icon-64.png',
    name: 'NAS Web',
    url: 'https://nas.melchor9000.me',
  },
  {
    id: 'home-assistant',
    icon: 'https://assistant.melchor9000.me/static/icons/favicon.ico',
    name: 'Home Assistant',
    url: 'https://assistant.melchor9000.me',
  },
  {
    id: 'immich',
    icon: 'https://photos.melchor9000.me/favicon-96.png',
    name: 'Immich',
    url: 'https://photos.melchor9000.me',
  },
  {
    id: 'nas-auth',
    icon: 'https://auth.melchor9000.me/icon.png',
    name: 'NAS Auth',
    url: 'https://auth.melchor9000.me',
  },
  {
    id: 'pubgatus',
    icon: 'https://status.melchor9000.me/img/logo.svg',
    name: 'gatus (public)',
    url: 'https://status.melchor9000.me',
  },
  'space',
  {
    id: 'traefik',
    icon: 'https://traefik.melchor9000.me/dashboard/icons/apple-icon-152x152.png',
    name: 'Traefik dashboard',
    url: 'https://traefik.melchor9000.me/dashboard/',
  },
  {
    id: 'ddns',
    name: 'DDNS',
    url: 'https://ddns.melchor9000.me',
  },
  {
    id: 'qbittorrent',
    icon: qbittorrentImage,
    name: 'qBittorrent',
    url: 'https://qbittorrent.melchor9000.me/',
    limitedTo: [...melchorSubs],
  },
  {
    id: 'nicotine',
    icon: 'https://nicotine.melchor9000.me/favicon.ico',
    name: 'Nicotine',
    url: 'https://nicotine.melchor9000.me',
  },
  {
    id: 'esphome',
    icon: 'https://esphome.melchor9000.me/static/images/favicon.ico',
    name: 'esphome',
    url: 'https://esphome.melchor9000.me',
    limitedTo: [...melchorSubs],
  },
  {
    id: 'netdata-pi',
    icon: 'https://netdata.melchor9000.me/pi/v2/favicon.ico',
    name: 'Netdata (pi)',
    url: 'https://netdata.melchor9000.me/pi/',
    label: 'pi',
  },
  {
    id: 'netdata-po',
    icon: 'https://netdata.melchor9000.me/pi/v2/favicon.ico',
    name: 'Netdata (po)',
    url: 'https://netdata.melchor9000.me/po/',
    label: 'po',
  },
  {
    id: 'gatus',
    icon: 'https://gatus.melchor9000.me/img/logo.svg',
    name: 'gatus',
    url: 'https://gatus.melchor9000.me',
  },
  {
    id: 'sonarr',
    name: 'sonarr',
    url: 'https://sonarr.melchor9000.me',
    icon: 'https://sonarr.melchor9000.me/Content/Images/Icons/apple-touch-icon.png',
    limitedTo: [...melchorSubs],
  },
  {
    id: 'prowlarr',
    name: 'prowlarr',
    url: 'https://prowlarr.melchor9000.me',
    icon: 'https://prowlarr.melchor9000.me/Content/Images/Icons/apple-touch-icon.png',
    limitedTo: [...melchorSubs],
  },
] satisfies Array<Entry | 'space'>)

export default entries
