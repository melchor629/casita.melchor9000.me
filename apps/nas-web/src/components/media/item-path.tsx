import { Button, ButtonGroup } from '@melchor629/ui'
import ReactRouterButton from '@melchor629/ui/ReactRouterButton'
import { Download, Downloading, type IconProps } from '@melchor629/ui/icons'
import { useCallback, useState } from 'react'
import { getDownloadUrl } from '@/api/fs'
import useApiClient from '@/hooks/use-api-client'
import { basename } from '@/utils/path'

type Props = Readonly<{
  module: string
  path: string
  icon: React.FC<IconProps>
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
    <ButtonGroup
      aria-label="Links to file and download file"
      variant="filled"
      color="secondary"
      size="small"
    >
      <ReactRouterButton to={`/${module}${path}`} icon={<Icon />}>
        &nbsp;
        {basename(path)}
      </ReactRouterButton>
      <Button
        disabled={preparing}
        onClick={download}
        icon={preparing ? <Downloading /> : <Download />}
      />
    </ButtonGroup>
  )
}
