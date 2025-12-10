import { isRouteErrorResponse, useRouteError } from 'react-router'

export default function ErrorBoundary() {
  const error = useRouteError()
  if (isRouteErrorResponse(error)) {
    return (
      <div className="container pt-5 text-center">
        <h2>Error loading data</h2>
        <p className="lead">
          {`There was an error ${error.status} while fetching data for that page.`}
          Try reloading or contacting the master.
        </p>
      </div>
    )
  }

  if (error instanceof Error) {
    return (
      <div className="container pt-5 text-center">
        <h2>Unexpected error</h2>
        <p className="lead">
          There was an unexpected error in the application. Try reloading or contacting the master.
        </p>
        <p>
          {`${error.name}: ${error.message}`}
        </p>
      </div>
    )
  }

  return (
    <div className="container pt-5 text-center">
      <h2>Unexpected error</h2>
      <p className="lead">
        There was an unexpected error in the application. Try reloading or contacting the master.
      </p>
    </div>
  )
}
