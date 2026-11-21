import { Button, Text } from '@melchor629/ui'

const InternalServerErrorPage = ({ reset }: { readonly reset: () => void }) => (
  <div className="text-center">
    <Text
      size="h1"
      className="mb-4"
    >
      Ooops :(
    </Text>
    <Text className="mb-2">Something failed in the server. You are admin, look at it!</Text>
    <div className="flex justify-center">
      <Button
        type="button"
        onClick={reset}
      >
        Retry
      </Button>
    </div>
  </div>
)

export default InternalServerErrorPage
