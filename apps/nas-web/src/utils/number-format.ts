export const round = (value: number, roundTo = 2): number => Number(value.toFixed(roundTo))

export const humanNumbers = (value: number, unit: string, p = 1000, roundTo = 2) => {
  if (value < p) {
    return `${round(value, roundTo)}${unit}`
  } if (value < p * p) {
    return `${round(value / p, roundTo)}K${unit}`
  } if (value < p * p * p) {
    return `${round(value / p / p, roundTo)}M${unit}`
  } if (value < p * p * p * p) {
    return `${round(value / p / p / p, roundTo)}G${unit}`
  }
  return `${round(value / p / p / p / p, roundTo)}T${unit}`
}

export const humanBytes = (bytes: number, si = true, roundTo = 2) => {
  const p = si ? 1000 : 1024
  const u = si ? 'B' : 'iB'
  return humanNumbers(bytes, u, p, roundTo)
}

const perm = (a: Record<'r' | 'w' | 'x', boolean>, set: string | false) =>
  `${a.r ? 'r' : '-'}${a.w ? 'w' : '-'}${a.x ? set || 'x' : (set || '-').toUpperCase()}`

export const unixPermissions = (mode: number) => {
  const o = {
    x: (mode & 0o0001) !== 0,
    w: (mode & 0o0002) !== 0,
    r: (mode & 0o0004) !== 0,
  }
  const g = {
    x: (mode & 0o0010) !== 0,
    w: (mode & 0o0020) !== 0,
    r: (mode & 0o0040) !== 0,
  }
  const u = {
    x: (mode & 0o0100) !== 0,
    w: (mode & 0o0200) !== 0,
    r: (mode & 0o0400) !== 0,
  }
  const setuid = (mode & 0o4000) !== 0
  const setgid = (mode & 0o2000) !== 0
  const sticky = (mode & 0o1000) !== 0
  return `${perm(u, setuid && 's')}${perm(g, setgid && 's')}${perm(o, sticky && 't')}`
}

export const humanDuration = (durationInSeconds: number) => {
  const milliseconds = ((durationInSeconds * 1000) % 1000).toFixed(0).padStart(3, '0')
  const seconds = Math.floor(durationInSeconds % 60)
  const minutes = Math.floor(durationInSeconds / 60) % 60
  const hours = Math.floor(durationInSeconds / 3600) % 60
  const tt = (n: number) => (n < 10 ? `0${n}` : n.toString())
  return `${tt(hours)}:${tt(minutes)}:${tt(seconds)}.${milliseconds}`
}
