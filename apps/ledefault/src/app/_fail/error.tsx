import type { ErrorComponentProps } from '@melchor629/nice-ssr'
import Button from '@melchor629/ui/Button'
import Text from '@melchor629/ui/Text'

export default function ErrorComponent({ error, reset }: ErrorComponentProps) {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center">
      <Text size="h1">Something failed :(</Text>
      <Text>The application failed with an error: {error.message}</Text>
      <Button
        onClick={reset}
        className="mt-4"
      >
        Reset
      </Button>
    </div>
  )
}
