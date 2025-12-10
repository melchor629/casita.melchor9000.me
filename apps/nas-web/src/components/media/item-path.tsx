import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import { getDownloadUrl } from '@/api/fs'
import useApiClient from '@/hooks/use-api-client'
import { basename } from '@/utils/path'
import { Download, Downloading, type SvgIconProps } from '../icons'

type Props = Readonly<{
  module: string
  path: string
  icon: React.FC<SvgIconProps>
}>

export default function ItemPath({ icon: Icon, module, path }: Props) {
  const apiClient = useApiClient()
  const [preparing, setPreparing] = useState(false)

  const download = useCallback(() => {
    setPreparing(true)
    getDownloadUrl(module, path, apiClient)
      .then((url) => {
        window.location.assign(url)
      })
      .catch(() => {})
      .finally(() => setPreparing(false))
  }, [module, path, apiClient])

  return (
    <div className="btn-group btn-group-sm" role="group" aria-label="Links to file and download file">
      <Link to={`/${module}${path}`} className="btn btn-secondary text-decoration-none">
        <Icon height="0.75rem" />
        &nbsp;
        {basename(path)}
      </Link>
      <button className="btn btn-secondary text-decoration-none" disabled={preparing} onClick={download}>
        {preparing ? <Downloading width="0.75rem" /> : <Download width="0.75rem" />}
      </button>
    </div>
  )
}
