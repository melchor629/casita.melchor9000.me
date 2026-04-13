import { Component, lazy, Suspense, type FC, type LazyExoticComponent, type MouseEvent, type PropsWithChildren } from 'react'

type ErrorBoundaryProps = Readonly<PropsWithChildren<{
  path: string
}>>

type ErrorBoundaryState = Readonly<{
  hasError: boolean
  error: Error | null
  component: LazyExoticComponent<FC<{ error: Error, reset: () => void }>>
}>

export type ErrorComponentProps = Readonly<{ error: Error, reset: () => void }>

const initialState: ErrorBoundaryState = { hasError: false, error: null, component: null! }

const createErrorComponent = (path: string) =>
  lazy(() => import(/* @vite-ignore */ path).then(mod => ({ default: (mod as { renderPage: FC<ErrorComponentProps> }).renderPage })))

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { ...initialState, component: createErrorComponent(props.path) }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    if (prevProps.path !== this.props.path) {
      this.setState({ component: createErrorComponent(this.props.path) })
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
