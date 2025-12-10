import clamp from 'lodash-es/clamp'
import { css, styled } from 'styled-components'

interface SpinThingProps {
  size?: 'sm' | 'md' | 'lg'
  baseColor?: string | readonly [r: number, g: number, b: number]
  borderColor?: string
  borderTopColor?: string
}

const hexColorRegex = /#[a-f0-9]{6}/i
const simpleHexColorRegex = /#[a-f0-9]{3}/i
const rgbaColorRegex = /rgba?\( *(\d{1,3}) *, *(\d{1,3}) *, *(\d{1,3}) *(?:,.+)?\)/
const colorToStyles = (color?: SpinThingProps['baseColor']) => {
  if (!color) {
    return {
      borderColor: 'rgba(var(--bs-body-color-rgb), 0.5)',
      borderTopColor: 'rgb(var(--bs-body-color-rgb))',
    }
  }

  let r = 255
  let g = 255
  let b = 255

  if (typeof color === 'string') {
    if (hexColorRegex.exec(color)) {
      r = parseInt(color.substring(1, 3), 16)
      g = parseInt(color.substring(3, 5), 16)
      b = parseInt(color.substring(5, 7), 16)
    } else if (simpleHexColorRegex.exec(color)) {
      r = parseInt(color.substring(1, 2), 16)
      g = parseInt(color.substring(2, 3), 16)
      b = parseInt(color.substring(3, 4), 16)
      r |= (r << 4)
      g |= (g << 4)
      b |= (b << 4)
    } else if (rgbaColorRegex.exec(color)) {
      const matches = rgbaColorRegex.exec(color)!
      r = clamp(parseInt(matches[1], 10), 0, 255)
      g = clamp(parseInt(matches[2], 10), 0, 255)
      b = clamp(parseInt(matches[3], 10), 0, 255)
    }
  } else {
    [r, g, b] = color
  }

  return {
    borderColor: `rgb(${r} ${g} ${b} / 0.5)`,
    borderTopColor: `rgb(${r} ${g} ${b})`,
  }
}

const SpinThing = styled.div<SpinThingProps>`
  border: 4px solid ${({ baseColor }) => colorToStyles(baseColor).borderColor};
  border-radius: 50%;
  border-top-color: ${({ baseColor }) => colorToStyles(baseColor).borderTopColor};
  position: absolute;
  margin: auto;
  width: 16px;
  height: 16px;

  ${({ size }) => size === 'md' && css`
    width: 24px;
    height: 24px;
    border-width: 5px;
  `}

  ${({ size }) => size === 'lg' && css`
    width: 32px;
    height: 32px;
    border-width: 6px;
  `}
`

export default SpinThing
