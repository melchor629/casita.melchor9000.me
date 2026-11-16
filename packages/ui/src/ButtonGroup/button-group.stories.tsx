import preview from '#.storybook/preview'
import Button from '../Button'
import { Default as ButtonStoriesMeta } from '../Button/button.stories'
import ButtonGroup from './button-group'

const meta = preview.meta({
  title: 'molecules/Button Group',
  component: ButtonGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    color: 'primary',
    size: 'medium',
    variant: 'filled',
  },
  argTypes: {
    color: ButtonStoriesMeta.meta.input.argTypes!.color,
    size: ButtonStoriesMeta.meta.input.argTypes!.size,
    variant: ButtonStoriesMeta.meta.input.argTypes!.variant,
  },
})

export const Default = meta.story({
  render: (props) => (
    <ButtonGroup {...props}>
      <Button>First</Button>
      <Button>Second</Button>
      <Button>Third</Button>
    </ButtonGroup>
  ),
})
