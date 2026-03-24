import type { Metadata } from '@melchor629/nice-ssr'
import { Text } from '@melchor629/ui'
import Layout from '#components/layout.tsx'

const NotFoundPage = () => (
  <Layout>
    <div className="text-center">
      <Text size="h4" className="mb-4">404</Text>
      <Text>This page could not be found.</Text>
    </div>
  </Layout>
)

export const metadata: Metadata = {
  title: 'Not Found',
}

export default NotFoundPage
