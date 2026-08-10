import { Component, Suspense, type FC, type MouseEvent, type PropsWithChildren } from 'react'

type ErrorBoundaryProps = Readonly<PropsWithChildren<{
  path: FC<ErrorComponentProps>
  error?: CsrError | null
}>>

export type CsrError = Readonly<{
  /**
   * The message from the error
   */
  message: string
  /**
   * Includes the stack trace only in dev
   */
  stack?: string
  /**
   * An identifier to correlate the error with logs.
   */
  digest: string
  /**
   * The cause of the error if there is one.
   */
  cause?: CsrError | null
}>

type ErrorBoundaryState = Readonly<{
  hasError: boolean
  error: CsrError | null
  component: FC<ErrorComponentProps>
}>

export type ErrorComponentProps = Readonly<{
  /**
   * The error from the server, stripped of unsecure information.
   */
  error: CsrError
  /**
   * Removes the error and tries to render the page again.
   */
  reset: () => void
}>

const initialState: ErrorBoundaryState = { hasError: false, error: null, component: null! }

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      ...initialState,
      component: props.path,
      hasError: props.error != null,
      error: props.error ?? null,
    }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (prevProps.path !== this.props.path) {
      this.setState({
        component: this.props.path,
      })
    }
  }

  render() {
    if (this.state.hasError) {
      const Component = this.state.component
      return (
        <Suspense>
          <Component error={this.state.error!} reset={this.#resetErrorBoundary} />
        </Suspense>
      )
    }

    return this.props.children
  }

  handleResetButton = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    this.#resetErrorBoundary()
  }

  #resetErrorBoundary = () => {
    const { error } = this.state

    if (error != null) {
      this.setState({ ...initialState, component: this.state.component })
    }
  }
}
