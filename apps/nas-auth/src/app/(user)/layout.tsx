import type { PropsWithChildren } from 'react'
import Layout from '#components/layout.tsx'

export default function DefaultLayout({ children }: PropsWithChildren) {
  return (
    <Layout>
      {children}
    </Layout>
  )
}
