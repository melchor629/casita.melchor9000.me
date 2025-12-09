import type { PropsWithChildren } from 'react'
import faviconUrl from './favicon.ico'
import '../theme/styles.css'

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html className="h-full" lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href={faviconUrl} rel="icon" />
      </head>
      <body className="h-full text-primary-text bg-primary-bg">
        <div id="app" className="h-full">{children}</div>
      </body>
    </html>
  )
}
