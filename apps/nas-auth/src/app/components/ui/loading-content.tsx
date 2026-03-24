import { CircularProgress, Text } from '@melchor629/ui'

type LoadingContentProps = Readonly<{ title: string }>

const LoadingContent = ({ title }: LoadingContentProps) => (
  <div className="flex flex-col items-center">
    <CircularProgress size="large" />
    <Text className="mt-3 select-none">{title}</Text>
  </div>
)

export default LoadingContent
