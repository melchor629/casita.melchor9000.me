import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppMain from './app'

const rootElement = document.getElementById('root')!
const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <AppMain />
  </StrictMode>,
)
