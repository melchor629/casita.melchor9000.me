import { Button, H1 } from '#components/ui/index.ts'

const InternalServerErrorPage = ({ reset }: { readonly reset: () => void }) => (
  <div className="text-center">
    <H1 className="mb-4">Ooops :(</H1>
    <p className="mb-2">Something failed in the server. You are admin, look at it!</p>
    <div className="flex justify-center">
      <Button type="button" onClick={reset}>Retry</Button>
    </div>
  </div>
)

export default InternalServerErrorPage
