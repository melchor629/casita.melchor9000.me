import { Button, H1 } from '#components/ui/index.ts'

const InternalServerErrorPage = ({ reset }) => (
  <div className="text-center">
    <H1 className="mb-4">Ooops :(</H1>
    <p className="mb-2">Something failed in the server. You are admin, look at it!</p>
    <center>
      <Button type="button" onClick={reset}>Retry</Button>
    </center>
  </div>
)

export default InternalServerErrorPage
