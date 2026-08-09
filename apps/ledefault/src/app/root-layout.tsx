import { RenderHead, RenderScripts } from '@melchor629/nice-ssr'
import type { PropsWithChildren } from 'react'
import faviconUrl from './favicon.ico'
import '../styles.css'

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html className="h-full" lang="en">
      <head>
        <RenderHead />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href={faviconUrl} rel="icon" />
      </head>
      <body className="body h-full">
        <div id="app" className="h-full">{children}</div>
        <RenderScripts />
      </body>
    </html>
  )
}
