import { styled } from 'styled-components'
import DotsAnimationLoader from '../dots'

const AppLoaderContainer = styled.div<{ $navbarMargin?: boolean }>`
  margin-top: ${({ $navbarMargin }) => ($navbarMargin ? 'var(--me-navbar-height)' : '1.5rem')};
  text-align: center;
`

interface AppLoaderProps {
  readonly navbarMargin?: boolean
  readonly loaderComponent?: React.FC
  readonly message?: string
}

export default function AppLoader({ loaderComponent, message, navbarMargin }: AppLoaderProps) {
  const LoaderComponent = loaderComponent || DotsAnimationLoader
  return (
    <AppLoaderContainer $navbarMargin={navbarMargin}>
      <LoaderComponent />
      {message && <h3>{message}</h3>}
    </AppLoaderContainer>
  )
}
