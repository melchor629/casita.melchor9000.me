import { css, styled } from 'styled-components'

const disableButtonsStyle = css`
    .btn {
        pointer-events: none;
        opacity: 0.65;
    }
`

const ButtonsBarContainer = styled.div.attrs({
  className: 'mb-2',
  role: 'group',
  'aria-label': 'Group of actions for current folder or file',
})<{ disabled: boolean }>`
    overflow-x: auto;
    overflow-y: hidden;
    position: relative;
    max-width: 100%;
    display: flex;

    ${(props) => props.disabled && disableButtonsStyle}

    @media (max-width: 767px) {
        span {
            display: none;
        }
    }
`

ButtonsBarContainer.displayName = 'ButtonsBarContainer'

export default ButtonsBarContainer
