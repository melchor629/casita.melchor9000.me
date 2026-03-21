import { Text } from '@melchor629/ui'
import { isRouteErrorResponse, useRouteError } from 'react-router'

export default function ErrorBoundary() {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) {
    return (
      <div className="w-full mt-navbar text-center">
        <Text size="h2" className="mb-1">Error loading data</Text>
        <Text size="bodyLarge">
          {`There was an error ${error.status} while fetching data for that page.`}
          Try reloading or contacting the master.
        </Text>
      </div>
    )
  }

  if (error instanceof Error) {
    return (
      <div className="w-full mt-navbar text-center">
        <Text size="h2" className="mb-1">Unexpected error</Text>
        <Text size="bodyLarge">
          There was an unexpected error in the application. Try reloading or contacting the master.
        </Text>
        <Text color="textSecondary" italic>
          {`${error.name}: ${error.message}`}
        </Text>
      </div>
    )
  }

  return (
    <div className="w-full mt-navbar text-center">
      <Text size="h2" className="mb-1">Unexpected error</Text>
      <Text size="bodyLarge">
        There was an unexpected error in the application. Try reloading or contacting the master.
      </Text>
    </div>
  )
}
