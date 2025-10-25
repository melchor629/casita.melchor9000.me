import type { ErrorOut } from 'oidc-provider'
import { H1 } from '#components/ui/index.ts'

export const metadata = {
  title: 'Something went wrong',
}

export default function InteractionErrorPage({ out }: { readonly out: ErrorOut }) {
  return (
    <div>
      <H1 className="mb-4">oops! something went wrong :(</H1>

      <p className="mb-2">
        Try again or contact the admin.
      </p>

      <div className="opacity-70">
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
      </div>
    </div>
  )
}
