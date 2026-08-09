import type ownImages from './imgs'

export type Entry = Readonly<{
  id: string
  icon?: `https://${string}` | keyof typeof ownImages
  name: string
  url: string
  label?: string
  limitedTo?: ReadonlyArray<string>
}>

const melchorSubs = ['melchor9000', 'Melchor']

const entries: ReadonlyArray<Entry | 'space'> = Object.freeze([
  {
    id: 'plex',
    icon: 'plex',
    name: 'Plex',
    url: 'https://media.melchor9000.me',
  },
  {
    id: 'nas-web',
    icon: 'https://nas.melchor9000.me/icon-64.png',
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
    icon: 'immich',
    name: 'Immich',
    url: 'https://photos.melchor9000.me',
  },
  {
    id: 'nas-auth',
    icon: 'nasAuth',
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
    id: 'router',
    icon: 'https://192.168.2.1/images/favicon.png',
    name: 'Router',
    url: 'https://192.168.2.1',
    limitedTo: [...melchorSubs],
  },
  {
    id: 'adguard',
    icon: 'https://adguard.melchor9000.me/assets/favicon.png',
    name: 'AdGuard Home',
    url: 'https://adguard.melchor9000.me/',
    limitedTo: [...melchorSubs],
  },
  {
    id: 'traefik',
    icon: 'https://traefik.melchor9000.me/dashboard/icons/apple-icon-152x152.png',
    name: 'Traefik dashboard',
    url: 'https://traefik.melchor9000.me/dashboard/',
  },
  {
    id: 'ddns',
    icon: 'https://ddns.melchor9000.me/static/favicon.svg',
    name: 'DDNS',
    url: 'https://ddns.melchor9000.me',
  },
  {
    id: 'qbittorrent',
    icon: 'qbittorrent',
    name: 'qBittorrent',
    url: 'https://qbittorrent.melchor9000.me/',
    limitedTo: [...melchorSubs],
  },
  {
    id: 'nicotine',
    icon: 'nicotine',
    name: 'Nicotine',
    url: 'https://nicotine.melchor9000.me',
  },
  {
    id: 'esphome',
    icon: 'https://esphome.melchor9000.me/assets/logo/esphome-favicon.svg',
    name: 'esphome',
    url: 'https://esphome.melchor9000.me',
    limitedTo: [...melchorSubs],
  },
  {
    id: 'netdata-pi',
    name: 'Netdata (pi)',
    url: 'https://netdata.melchor9000.me/pi/',
    label: 'pi',
  },
  {
    id: 'netdata-po',
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
    id: 'grafana',
    name: 'Grafana',
    url: 'https://grafana.melchor9000.me',
    icon: 'https://grafana.melchor9000.me/public/img/apple-touch-icon.png',
    limitedTo: [...melchorSubs],
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
  {
    id: 'radarr',
    name: 'radarr',
    url: 'https://radarr.melchor9000.me',
    icon: 'https://radarr.melchor9000.me/Content/Images/Icons/apple-touch-icon.png',
    limitedTo: [...melchorSubs],
  },
  {
    id: 'lidarr',
    name: 'lidarr',
    url: 'https://lidarr.melchor9000.me',
    icon: 'https://lidarr.melchor9000.me/Content/Images/Icons/apple-touch-icon.png',
    limitedTo: [...melchorSubs],
  },
  {
    id: 'seerr',
    name: 'seerr',
    url: 'https://seerr.melchor9000.me/',
    icon: 'https://seerr.melchor9000.me/android-chrome-192x192.png',
  },
  {
    id: 'bubbleupnp',
    name: 'BubbleUPNP',
    url: 'http://192.168.2.3:58050/',
    limitedTo: [...melchorSubs],
  },
] satisfies Array<Entry | 'space'>)

export default entries
