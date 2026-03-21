import { Text } from '@melchor629/ui'
import { clsx } from '@melchor629/ui/utils'
import DotsAnimationLoader from '../dots'

interface AppLoaderProps {
  readonly navbarMargin?: boolean
  readonly loaderComponent?: React.FC
  readonly message?: string
}

export default function AppLoader({ loaderComponent, message, navbarMargin }: AppLoaderProps) {
  const LoaderComponent = loaderComponent || DotsAnimationLoader
  return (
    <div className={clsx('text-center', navbarMargin ? 'mt-navbar' : 'mt-6')}>
      <LoaderComponent />
      {message && <Text size="h3" weight="medium">{message}</Text>}
    </div>
  )
}
