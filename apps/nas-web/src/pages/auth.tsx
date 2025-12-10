import { useMemo } from 'react'
import { Navigate } from 'react-router'

export default function AuthPage() {
  const path = useMemo(() => {
    const redirectPath = sessionStorage.getItem('nas-web:redirect-path')
    sessionStorage.removeItem('nas-web:redirect-path')
    return redirectPath || '/'
  }, [])

  return <Navigate to={path} replace />
}
