import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import Dialog from './dialog'

const meta = {
  title: 'molecules/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    id: 'test',
    title: 'Dialog Title',
    children: 'Some link',
    show: true,
    onClose: fn(),
    onCloseStart: fn(),
    onCloseEnd: fn(),
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large', 'extra-large'],
    },
  },
} satisfies Meta<typeof Dialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
