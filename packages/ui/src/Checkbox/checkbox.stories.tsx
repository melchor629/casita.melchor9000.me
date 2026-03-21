import type { Meta, StoryObj } from '@storybook/react-vite'
import InputLabel from '../InputLabel'
import Checkbox from './checkbox'

const meta = {
  title: 'atoms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    checked: false,
    disabled: false,
    readOnly: false,
  },
  argTypes: {},
} satisfies Meta<typeof Checkbox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithLabel: Story = {
  render: (args) =>
    <InputLabel input={<Checkbox id="checkbox" {...args} />}>Checkbox label</InputLabel>,
}
