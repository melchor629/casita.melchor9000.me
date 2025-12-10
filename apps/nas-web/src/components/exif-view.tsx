import { useMemo } from 'react'
import type { FileMetadata } from '../api/fs/file'

function ExifView({ exif }: { readonly exif: FileMetadata['exif'] }) {
  const keys = useMemo(() => (
    Object.entries(exif ?? {})
      .map(([key, obj]) => [
        key,
        (Object.entries(obj) as Array<[string, string | { description?: string, value: string }]>)
          .filter(([k, val]) => val != null && k !== '_raw')
          .sort(([a], [b]) => a.localeCompare(b, undefined, { sensitivity: 'accent' })),
      ] as const)
      .filter(([, obj]) => obj.length > 0)
  ), [exif])

  if (!exif) {
    return null
  }

  return (
    <div>
      <ul>
        {keys
          .map(([key, v]) => (
            <li key={key}>
              <strong>{key}</strong>
              <ul>
                {v.map(([k, vv]) => (
                  <li key={k}>
                    <strong>{k}</strong>
                    <span>
                      {`: ${typeof vv === 'object' ? vv.description || vv.value : vv}`}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default ExifView
