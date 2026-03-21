import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Home, Info } from '../icons'
import Button from './button'

const meta = {
  title: 'atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'neutral', 'warning', 'error'],
    },
    variant: {
      control: 'inline-radio',
      options: ['filled', 'text'],
    },
    size: {
      control: 'inline-radio',
      options: ['large', 'medium', 'small'],
    },
  },
  args: {
    onClick: fn(),
    children: 'Button',
    disabled: false,
    color: 'primary',
    loading: false,
    size: 'medium',
    variant: 'filled',
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithIcon: Story = {
  args: {
    icon: <Home />,
  },
}

export const Icon: Story = {
  args: {
    icon: <Info />,
    children: undefined,
  },
}
