import LoadingSpinner from './loading-spinner'
import { H3 } from './text'

type LoadingContentProps = Readonly<{ title: string }>

const LoadingContent = ({ title }: LoadingContentProps) => (
  <div className="flex flex-col items-center">
    <LoadingSpinner size="lg" />
    <H3 className="mt-3 select-none">{title}</H3>
  </div>
)

export default LoadingContent
