import { css, keyframes, styled } from 'styled-components'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  show?: boolean
  color?: string
}

const rotateSpinnerKeyframes = keyframes`
    100% {
        transform: rotate(360deg);
    }
`

const Spinner = styled.div<SpinnerProps>`
    display: inline-block;
    font-size: 10px;
    width: 16px;
    height: 16px;
    position: relative;
    text-indent: -9999em;
    transform: translateZ(0);
    animation-delay: -0.16s;

    > div {
        opacity: 0;
        transition: opacity 250ms;
        animation: ${rotateSpinnerKeyframes} 1s linear;
        animation-iteration-count: infinite;
    }

    ${({ show }) => (show ?? true) && css`
        > div {
            opacity: 1;
        }
    `}

    ${({ size }) => size === 'md' && css`
        width: 24px;
        height: 24px;
    `}

    ${({ size }) => size === 'lg' && css`
        width: 32px;
        height: 32px;
    `}
`

export default Spinner
