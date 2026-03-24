import { notFound } from '@melchor629/nice-ssr'
import { Button, Text } from '@melchor629/ui'

export const metadata = {
  title: 'Sign out',
}

export default function LogoutPage({ form }: { readonly form?: string }) {
  if (!form) {
    notFound()
  }

  return (
    <div>
      <Text size="h2" className="mb-6">Do you want to logout?</Text>

      <div dangerouslySetInnerHTML={{ __html: form }} />

      <div className="flex gap-1.5 justify-center">
        <Button type="submit" form="op.logoutForm" value="yes" name="logout" color="error">
          Sign out
        </Button>
        <Button type="submit" form="op.logoutForm" color="primary">Stay in</Button>
      </div>
    </div>
  )
}
