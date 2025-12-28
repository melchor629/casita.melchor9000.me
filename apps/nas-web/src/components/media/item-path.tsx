import { useCallback, useState } from 'react'
import { getDownloadUrl } from '@/api/fs'
import useApiClient from '@/hooks/use-api-client'
import { basename } from '@/utils/path'
import Button from '../core/button'
import ButtonGroup from '../core/button-group'
import ReactRouterButton from '../core/react-router-button'
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
    <ButtonGroup role="group" aria-label="Links to file and download file">
      <ReactRouterButton to={`/${module}${path}`} size="small" variant="filled" color="secondary">
        <Icon height="0.75rem" />
        &nbsp;
        {basename(path)}
      </ReactRouterButton>
      <Button size="small" color="secondary" disabled={preparing} onClick={download}>
        {preparing ? <Downloading width="0.75rem" /> : <Download width="0.75rem" />}
      </Button>
    </ButtonGroup>
  )
}
