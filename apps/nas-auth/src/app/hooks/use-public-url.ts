import { useMemo } from 'react'

const usePublicUrl = () => (
  useMemo(
    () => (typeof window !== 'undefined' && window.location.origin) || 'http://localhost:8000',
    [],
  )
)

export default usePublicUrl
