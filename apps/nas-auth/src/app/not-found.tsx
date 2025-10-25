import type { Metadata } from '@melchor629/nice-ssr'
import Layout from '#components/layout.tsx'
import { H1 } from '#components/ui/index.ts'

const NotFoundPage = () => (
  <Layout>
    <div className="text-center">
      <H1 className="mb-4">404</H1>
      <p>This page could not be found.</p>
    </div>
  </Layout>
)

export const metadata: Metadata = {
  title: 'Not Found',
}

export default NotFoundPage
