import type { Meta, StoryObj } from '@storybook/react-vite'
import InputLabel from '../InputLabel'
import Switch from './switch'

const meta = {
  title: 'atoms/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    checked: false,
    disabled: false,
    readOnly: false,
    required: false,
  },
  argTypes: {},
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithLabel: Story = {
  render: (args) =>
    <InputLabel input={<Switch id="checkbox" {...args} />}>Switch label</InputLabel>,
}
