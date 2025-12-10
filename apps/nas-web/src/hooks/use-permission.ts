import { useMemo } from 'react'
import { useTokenInfo } from './use-token-info'

const usePermission = (name: string) => {
  const { permissions } = useTokenInfo()

  return useMemo(() => permissions.find((p) => p.name === name), [permissions, name])
}

export default usePermission
