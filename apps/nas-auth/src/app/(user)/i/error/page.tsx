import { Text } from '@melchor629/ui'
import type { ErrorOut } from 'oidc-provider'

export const metadata = {
  title: 'Something went wrong',
}

export default function InteractionErrorPage({ out }: { readonly out: ErrorOut }) {
  return (
    <div>
      <Text size="h1" className="mb-4">oops! something went wrong :(</Text>

      <Text className="mb-2">
        Try again or contact the admin.
      </Text>

      <Text component="div" color="textSecondary">
        <p>{`What: ${out.error}`}</p>
        {out.error_description && <p><small>{`Details: ${out.error_description}`}</small></p>}
        {out.scope && (
          <pre>
            <strong>scope</strong>
            {`: ${out.scope}`}
          </pre>
        )}
        {out.state && (
          <pre>
            <strong>state</strong>
            {`: ${out.state}`}
          </pre>
        )}
      </Text>
    </div>
  )
}
