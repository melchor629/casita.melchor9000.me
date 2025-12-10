import { memo, type CSSProperties } from 'react'
import SpinThing from './spin-thing'
import SpinnerItself from './spinner'

interface SpinnerProps {
  readonly show?: boolean
  readonly style?: CSSProperties
  readonly color?: string | readonly [r: number, g: number, b: number]
  readonly size?: 'sm' | 'md' | 'lg'
}

const Spinner = memo(({
  color, show, size, style,
}: SpinnerProps) => (
  <SpinnerItself style={style} size={size} show={show}>
    <SpinThing baseColor={color} size={size} />
  </SpinnerItself>
))

export default Spinner
