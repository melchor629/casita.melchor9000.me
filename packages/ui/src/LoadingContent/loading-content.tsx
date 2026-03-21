import CircularProgress from '../CircularProgress'
import Text from '../Text'

export type LoadingContentProps = Readonly<{ title: string }>

const LoadingContent = ({ title }: LoadingContentProps) => (
  <div className="flex flex-col items-center gap-3">
    <CircularProgress size="inherit" className="text-h1" />
    <Text size="h3" className="select-none">{title}</Text>
  </div>
)

export default LoadingContent
