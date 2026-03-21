import type { Meta, StoryObj } from '@storybook/react-vite'
import Alert from './alert'

const meta = {
  title: 'molecules/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    severity: 'default',
    title: 'Alert title',
    children: 'Alert description',
  },
  argTypes: {
    severity: {
      control: 'inline-radio',
      options: ['default', 'error'],
    },
  },
} satisfies Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
