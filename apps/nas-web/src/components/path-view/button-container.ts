import { styled } from 'styled-components'

const ButtonContainer = styled.div.attrs({
  className: 'col-auto',
})`
    padding-left: 5px;
    padding-right: 5px;

    &:first-of-type {
      padding-left: 0;
    }

    &:last-of-type {
      padding-right: 0;
    }
`

ButtonContainer.displayName = 'ButtonContainer'

export default ButtonContainer
