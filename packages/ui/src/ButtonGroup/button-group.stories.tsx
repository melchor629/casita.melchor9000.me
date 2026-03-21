import type { Meta, StoryObj } from '@storybook/react-vite'
import Button from '../Button'
import ButtonStoriesMeta from '../Button/button.stories'
import ButtonGroup from './button-group'

const meta = {
  title: 'molecules/ButtonGroup',
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
    color: ButtonStoriesMeta.argTypes.color,
    size: ButtonStoriesMeta.argTypes.size,
    variant: ButtonStoriesMeta.argTypes.variant,
  },
} satisfies Meta<typeof ButtonGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (props) => (
    <ButtonGroup {...props}>
      <Button>First</Button>
      <Button>Second</Button>
      <Button>Third</Button>
    </ButtonGroup>
  ),
}
