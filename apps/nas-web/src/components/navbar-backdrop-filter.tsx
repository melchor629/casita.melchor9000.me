import { styled } from 'styled-components'

const NavbarBackdropFilter = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--me-navbar-height);
  backdrop-filter: blur(20px);
  background-color: rgba(var(--bs-body-bg), 0.75);
  z-index: 1;
`

export default NavbarBackdropFilter
