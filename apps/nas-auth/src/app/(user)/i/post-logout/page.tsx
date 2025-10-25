import { H1 } from '#components/ui/index.ts'

export const metadata = {
  title: 'Sign out',
}

type PostLogoutPageProps = Readonly<{
  clientName?: string | null
  clientUri?: string | null
}>

export default function PostLogoutPage({ clientName, clientUri }: PostLogoutPageProps) {
  return (
    <div>
      <H1 className="mb-4">Sign-out succesfully</H1>
      <p>
        Your sign-out
        {clientName ? ` with ${clientName} ` : ' '}
        was succesful.
        {clientUri
          ? (
            <>
              You can now go back to the
              {' '}
              <a href={clientUri} rel="noopener">application page</a>
              or close the tab.
            </>
            )
          : (
            <>
              You can now close the tab.
            </>
            )}
      </p>
    </div>
  )
}
