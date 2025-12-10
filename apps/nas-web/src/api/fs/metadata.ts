interface StatTime {
  timestamp: string
  ms: string
}

interface Stat {
  size: number
  accessTime: StatTime
  changeTime: StatTime
  modificationTime: StatTime
  fileMode: number
  uid: number
  gid: number
}

interface MimeTypeInfo {
  mime: string
  isText: boolean
}

export interface Metadata<Type extends string> {
  path: string
  realPath: string
  stat: Stat
  type: Type
  hidden: boolean
  mime?: MimeTypeInfo
}
