import { css, styled } from 'styled-components'

const ContextMenuContainer = styled.div<{ $show: boolean }>`
  z-index: 1035;
  visibility: hidden;
  min-width: 150px;
  max-height: 70vh;
  overflow-y: auto;
  border-radius: 0.25rem;
  background-color: rgb(var(--bs-body-bg-rgb), 0.75);
  border: 1px solid rgb(150 150 150 / 0.75);
  backdrop-filter: blur(3px);
  transform: translateY(15px);
  opacity: 0;
  box-shadow: 0 5px 14px 5px rgba(0, 0, 0, 0.35);
  transition: transform .125s ease-in-out,
              opacity .125s ease-in-out,
              visibility .01s .125s;

  ${(props) => props.$show && css`
    visibility: visible;
    transform: translateY(0px);
    opacity: 1;
    transition: transform .125s ease-in-out,
                opacity .125s ease-in-out,
                visibility .01s;
  `}
`

export default ContextMenuContainer
