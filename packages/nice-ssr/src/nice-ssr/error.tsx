import { Component, type Context, type FC, type PropsWithChildren } from 'react'
import { SsrRouterContext } from './navigation'

type ErrorBoundaryProps = Readonly<PropsWithChildren<{
  component: FC<ErrorComponentProps>
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
  static contextType = SsrRouterContext

  declare context: typeof SsrRouterContext extends Context<infer F> ? F : never

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      ...initialState,
      component: props.component,
      hasError: props.error != null,
      error: props.error ?? null,
    }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (prevProps.component !== this.props.component) {
      this.setState({
        component: this.props.component,
      })
    }
  }

  render() {
    if (this.state.hasError) {
      const Component = this.state.component
      return (
        <Component error={this.state.error!} reset={this.#resetErrorBoundary} />
      )
    }

    return this.props.children
  }

  #resetErrorBoundary = () => {
    const { error } = this.state

    if (this.props.error && this.props.error === this.state.error) {
      // this is an error page, reload page is better
      const { state, url } = this.context.store.getState()
      if (state === 'inactive') {
        this.context.actions.loadPage(url, true)
          .catch(() => {})
      }
    }

    if (error != null) {
      this.setState({ ...initialState, component: this.state.component })
    }
  }
}
