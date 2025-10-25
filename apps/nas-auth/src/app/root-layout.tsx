import type { PropsWithChildren } from 'preact/compat'
import favicon from './favicon.ico'
import icon from './icon.png'
import './globals.css'

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#111826" />
        <meta name="description" content="Authentication and login services." />
        <link rel="author" href="https://melchor9000.me" />
        <meta name="author" content="melchor9000" />
        <meta name="referrer" content="origin-when-cross-origin" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href={favicon} type="image/x-icon" sizes="256x256" />
        <link rel="icon" href={icon} type="image/png" sizes="512x512" />
      </head>
      <body>
        <div id="app">
          {children}
        </div>
      </body>
    </html>
  )
}
