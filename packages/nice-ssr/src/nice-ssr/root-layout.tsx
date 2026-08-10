import type { ReactNode } from 'react'
import { RenderHead, RenderScripts } from './navigation'

const rootLayoutMaybe: Record<
  `./root-layout.${'t' | 'j'}sx`,
  { default: typeof DefaultRootLayout }
> = import.meta.glob(
  '/src/app/root-layout.{t,j}sx',
  { eager: true, base: '/src/app' },
)
const DefaultRootLayout = ({ children }: { readonly children: ReactNode }) => (
  <html lang="en">
    <head><RenderHead /></head>
    <body id="app">
      {children}
      <RenderScripts />
    </body>
  </html>
)
const RootLayout: typeof DefaultRootLayout = rootLayoutMaybe['./root-layout.jsx']?.default
  ?? rootLayoutMaybe['./root-layout.tsx']?.default
  ?? DefaultRootLayout

export default RootLayout
