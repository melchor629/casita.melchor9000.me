import type { Meta, StoryObj } from '@storybook/react-vite'
import Checkbox from '../Checkbox'
import Switch from '../Switch'
import InputLabel from './input-label'

const meta = {
  title: 'atoms/Input Label',
  component: InputLabel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'Label text',
    margin: 'none',
  },
  argTypes: {
    margin: {
      control: 'inline-radio',
      options: ['none', 'dense', 'normal'],
    },
  },
} satisfies Meta<typeof InputLabel>

export default meta

type Story = StoryObj<typeof meta>

export const WithCheckbox: Story = {
  args: {
    input: <Checkbox />,
    children: 'Accept terms',
  },
}

export const WithSwitch: Story = {
  args: {
    input: <Switch />,
    children: 'Enable?',
  },
}

export const WithRadio: Story = {
  args: {
    input: <input type="radio" />,
    children: 'sore',
  },
}
