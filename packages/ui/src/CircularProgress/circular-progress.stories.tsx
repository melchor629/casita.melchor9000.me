import type { Meta, StoryObj } from '@storybook/react-vite'
import CircularProgress from './circular-progress'

const meta = {
  title: 'atoms/Circular Progress',
  component: CircularProgress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    size: 'medium',
    show: true,
    variant: 'indeterminate',
    percentage: 1,
  },
  argTypes: {
    color: {
      control: 'inline-radio',
      options: ['inherit', 'primary', 'secondary', 'error', 'neutral', 'contrasted'],
    },
    size: {
      control: 'inline-radio',
      options: ['large', 'medium', 'small', 'inherit'],
    },
    variant: {
      control: 'inline-radio',
      options: ['indeterminate', 'determinate'],
    },
    percentage: {
      control: 'range',
      min: 0,
      max: 100,
    },
  },
} satisfies Meta<typeof CircularProgress>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
