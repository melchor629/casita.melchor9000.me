import { css, styled } from 'styled-components'

const ContextMenuItem = styled.button<{ disabled?: boolean }>`
  width: 100%;
  user-select: none;
  padding: 0.25rem 0.5rem;
  border: none;
  background-color: transparent;
  transition: opacity 125ms ease-in-out,
      background-color 125ms ease-in-out;

  ${({ disabled }) => (disabled
    ? css`
      opacity: 0.75;
      pointer-events: none;
    `
    : css`
      cursor: pointer;

      &:hover {
        opacity: 0.95;
        background-color: rgba(var(--bs-secondary-bg-rgb), 0.75);
      }
    `)}
`

export default ContextMenuItem
