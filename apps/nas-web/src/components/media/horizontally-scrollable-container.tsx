import { styled } from 'styled-components'

const HorizontallyScrollableContainer = styled.div.attrs((props) => ({
  className: `d-flex flex-row gap-4 px-4 py-3 overflow-auto ${props.className || ''}`.trim(),
  role: 'grid',
}))`
  // removes gutter from container-fluid
  margin-left: calc(var(--bs-gutter-x) * -0.5);
  margin-right: calc(var(--bs-gutter-x) * -0.5);

  // scroll snap
  scroll-snap-type: x proximity;
  scroll-padding-left: 1.5rem;
  > div {
    scroll-snap-align: start;
  }
`

export default HorizontallyScrollableContainer
