import { notFound } from '@melchor629/nice-ssr'
import { Button, H1 } from '#components/ui/index.ts'

export const metadata = {
  title: 'Sign out',
}

export default function LogoutPage({ form }: { readonly form?: string }) {
  if (!form) {
    notFound()
  }

  return (
    <div>
      <H1 className="mb-6">Do you want to logout?</H1>

      <div dangerouslySetInnerHTML={{ __html: form }} />

      <div className="flex justify-between">
        <Button type="submit" form="op.logoutForm" value="yes" name="logout">
          Yes, sign me out
        </Button>
        <Button type="submit" form="op.logoutForm">No, stay signed in</Button>
      </div>
    </div>
  )
}
