export const sep = '/'

const normalizePosix = (path: string, allowAboveRoot: boolean) => {
  let dots = 0
  let lastSlash = -1
  let result = ''
  let lastSegmentLength = 0

  for (let i = 0; i <= path.length; i += 1) {
    const char = i < path.length ? path[i] : sep
    if (char === sep) {
      if (lastSlash === i - 1 || dots === 1) {
        // do nothing
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (result.length < 2 || lastSegmentLength !== 2 || result[result.length - 1] !== '.' || result[result.length - 2] !== '.') {
          if (result.length > 2) {
            const lastSlashIndex = result.lastIndexOf(sep)
            if (lastSlashIndex !== result.length - 1) {
              if (lastSlashIndex === -1) {
                result = ''
                lastSegmentLength = 0
              } else {
                result = result.slice(0, lastSlashIndex)
                lastSegmentLength = result.length - 1 - result.lastIndexOf(sep)
              }

              lastSlash = i
              dots = 0

              continue
            }
          } else if (result.length === 2 || result.length === 1) {
            result = ''
            lastSegmentLength = 0
            lastSlash = i
            dots = 0

            continue
          }
        }

        if (allowAboveRoot) {
          if (result.length > 0) {
            result += '/..'
          } else {
            result = '..'
          }
          lastSegmentLength = 2
        }
      } else {
        if (result.length > 0) {
          result += `/${path.slice(lastSlash + 1, i)}`
        } else {
          result = path.slice(lastSlash + 1, i)
        }
        lastSegmentLength = i - lastSlash - 1
      }

      lastSlash = i
      dots = 0
    } else if (char === '.' && dots !== -1) {
      dots += 1
    } else {
      dots = -1
    }
  }

  return result
}

export const normalize = (path: string) => {
  if (path.length === 0) {
    return '.'
  }

  if (path === sep) {
    return sep
  }

  const isAbsolute = path[0] === sep
  const trailingSeparator = path[path.length - 1] === sep

  let normalized = normalizePosix(path, !isAbsolute)

  if (path.length === 0 && !isAbsolute) {
    normalized = '.'
  }
  if (path.length > 0 && trailingSeparator) {
    normalized += sep
  }

  if (isAbsolute) {
    return `/${normalized}`
  }

  return normalized
}

export const join = (...paths: string[]) => {
  if (paths.length === 0) {
    return '.'
  }

  const joined = paths
    .filter((path) => path.length > 0)
    .join(sep)

  return normalize(joined)
}

export const dirname = (path: string) => {
  if (path.length === 0) {
    return '.'
  }

  const hasRoot = path[0] === sep
  const end = path.slice(1).lastIndexOf(sep)

  if (end === -1) {
    return hasRoot ? '/' : '.'
  }
  if (hasRoot && end === 1) {
    return '//'
  }
  return path.slice(0, end + 1)
}

export const basename = (path: string) => {
  if (path.length < 2) {
    return path
  }

  let start = 0; let end = -1; let
    matchedSlash = true
  for (let i = path.length - 1; i >= 0; i -= 1) {
    if (path[i] === sep) {
      if (!matchedSlash) {
        start = i + 1
        break
      }
    } else if (end === -1) {
      matchedSlash = false
      end = i + 1
    }
  }

  if (end === -1) {
    return ''
  }

  return path.slice(start, end)
}
