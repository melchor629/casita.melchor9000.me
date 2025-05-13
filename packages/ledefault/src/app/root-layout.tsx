import type { PropsWithChildren } from 'preact/compat'
import faviconUrl from './favicon.ico'
import './styles.css'

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html class="h-full" lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href={faviconUrl} rel="icon" />
      </head>
      <body class="h-full text-primary-text-light dark:text-primary-text-dark bg-primary-bg-light dark:bg-primary-bg-dark">
        <div id="app" class="h-full">{children}</div>
      </body>
    </html>
  )
}
