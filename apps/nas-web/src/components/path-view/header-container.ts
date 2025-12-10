import { styled } from 'styled-components'

const HeaderContainer = styled('div')`
  top: 0;
  background-color: rgba(var(--bs-body-bg-rgb), 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  margin-left: calc(var(--bs-gutter-x) * -0.5);
  margin-right: calc(var(--bs-gutter-x) * -0.5);
  padding-left: calc(var(--bs-gutter-x) * 0.5);
  padding-right: calc(var(--bs-gutter-x) * 0.5);
  padding-bottom: 0.5rem;
  padding-top: var(--me-navbar-height);
`

HeaderContainer.displayName = 'HeaderContainer'

export default HeaderContainer
