/// <reference types="vite/client" />

declare module 'react' {
  import * as preactCompat from 'preact/compat'

  export = preactCompat
}

declare module 'react-dom' {
  import * as preactCompat from 'preact/compat'

  export = preactCompat
}
