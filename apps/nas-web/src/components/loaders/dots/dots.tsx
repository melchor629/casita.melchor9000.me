import React, { useMemo } from 'react'
import { css, keyframes, styled } from 'styled-components'

const dotsKeyframes = keyframes`
  0% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  80% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
`

const colorsKeyframes = keyframes`
  0% {
    color: #aaa;
  }
  9% {
    color: #aaa;
  }
  10% {
    color: #f44336;
  }
  19% {
    color: #f44336;
  }
  20% {
    color: #2196f3;
  }
  29% {
    color: #2196f3;
  }
  30% {
    color: #4caf50;
  }
  39% {
    color: #4caf50;
  }
  40% {
    color: #673ab7;
  }
  49% {
    color: #673ab7;
  }
  50% {
    color: #cddc39;
  }
  59% {
    color: #cddc39;
  }
  60% {
    color: #ff9800;
  }
  69% {
    color: #ff9800;
  }
  70% {
    color: #9e9e9e;
  }
  79% {
    color: #9e9e9e;
  }
  80% {
    color: #3f51b5;
  }
  89% {
    color: #3f51b5;
  }
  90% {
    color: #ff5722;
  }
  99% {
    color: #ff5722;
  }
`

const randomStyles = [
  '',
  css`
    animation-delay: -0.16s, ${-1.8 * 2}s;
    &:before { animation-delay: -0.32s, ${-1.8 * 8}s; }
    &:after { animation-delay: 0s, ${-1.8 * 4}s; }
  `,
  css`
    animation-delay: -0.16s, ${-1.8 * 7}s;
    &:before { animation-delay: -0.32s, ${-1.8 * 1}s; }
    &:after { animation-delay: 0s, ${-1.8 * 0}s; }
  `,
  css`
    animation-delay: -0.16s, ${-1.8 * 5}s;
    &:before { animation-delay: -0.32s, ${-1.8 * 1}s; }
    &:after { animation-delay: 0s, ${-1.8 * 9}s; }
  `,
]

export const DotsImpl = styled.div<{ $random: number }>`
  font-size: 10px;
  margin: 80px auto;
  margin-top: 20px;
  position: relative;
  text-indent: -9999em;
  transform: translateZ(0);
  animation-delay: -0.16s;

  &,
  &:after,
  &:before {
    border-radius: 50%;
    width: 2.5em;
    height: 2.5em;
    animation-fill-mode: both;
    animation-name: ${dotsKeyframes}, ${colorsKeyframes};
    animation-duration: 1.8s, ${1.8 * 10}s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }

  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 0;
  }

  &:before {
    left: -3.5em;
    animation-delay: -0.32s, ${-1.8 * 3}s;
  }

  &:after {
    left: 3.5em;
    animation-delay: 0s, ${-1.8 * 5}s;
  }

  ${({ $random }) => randomStyles[$random]}
`

const Dots = React.memo(({ style }: { readonly style?: React.CSSProperties }) => {
  // eslint-disable-next-line react-hooks/purity
  const random = useMemo(() => Math.trunc(Math.random() * 4), [])
  return <DotsImpl $random={random} style={style} />
})

Dots.displayName = 'Dots'

export default Dots
