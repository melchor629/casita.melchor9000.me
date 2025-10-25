import { useMemo } from 'preact/hooks'

const usePublicUrl = () => (
  useMemo(
    () => (typeof window !== 'undefined' && window.location.origin) || 'http://localhost:8000',
    [],
  )
)

export default usePublicUrl
