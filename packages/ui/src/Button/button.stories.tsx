import { fn } from 'storybook/test'
import preview from '#.storybook/preview'
import { Home, Info } from '../icons'
import Button from './button'

const meta = preview.meta({
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
})

export const Default = meta.story()

export const WithIcon = meta.story({
  args: {
    icon: <Home />,
  },
})

export const Icon = meta.story({
  args: {
    icon: <Info />,
    children: undefined,
  },
})
