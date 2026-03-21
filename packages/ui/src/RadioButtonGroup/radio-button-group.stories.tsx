import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import ButtonStoriesMeta from '../Button/button.stories'
import { RadioButtonGroup, RadioButton } from '.'

const meta = {
  title: 'molecules/RadioButtonGroup',
  component: RadioButtonGroup,
  subcomponents: {
    RadioButton,
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    color: 'primary',
    size: 'medium',
    variant: 'filled',
    name: 'what',
    onChange: fn(),
  },
  argTypes: {
    color: ButtonStoriesMeta.argTypes.color,
    size: ButtonStoriesMeta.argTypes.size,
    variant: ButtonStoriesMeta.argTypes.variant,
  },
} satisfies Meta<typeof RadioButtonGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (props) => (
    <RadioButtonGroup {...props}>
      <RadioButton value="1">First</RadioButton>
      <RadioButton value="2">Second</RadioButton>
      <RadioButton value="3">Third</RadioButton>
    </RadioButtonGroup>
  ),
}
