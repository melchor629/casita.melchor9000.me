import { memo, type CSSProperties } from 'react'
import { styled } from 'styled-components'
import Dots, { DotsImpl } from '../dots/dots'

interface LoadingOverlayProps {
  readonly className?: string
  readonly style?: CSSProperties
}

const LoadingOverlayContainer = styled.div<LoadingOverlayProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  > ${DotsImpl} {
    position: sticky !important;
    top: calc(50vh - 50px);
  }
`

const LoadingOverlay = memo(({ className, style }: LoadingOverlayProps) => (
  <LoadingOverlayContainer className={className} style={style}>
    <Dots />
  </LoadingOverlayContainer>
))

export default LoadingOverlay
