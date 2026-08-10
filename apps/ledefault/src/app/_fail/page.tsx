import type { PageLoader } from '@melchor629/nice-ssr'

export const loader: PageLoader<{ client: boolean }> = ({ nice: { url } }) => {
  return { client: url.searchParams.get('client') != null }
}

export default function FailPage({ client }: { readonly client: boolean }) {
  if (client && typeof window === 'undefined') {
    return 'helo :_)'
  }

  throw new Error('This page has failed succesfully!')
}
