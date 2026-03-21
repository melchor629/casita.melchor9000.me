import type { Meta, StoryObj } from '@storybook/react-vite'
import LinearProgress from './linear-progress'

const meta = {
  title: 'atoms/Linear Progress',
  component: LinearProgress,
  render: (props) => <LinearProgress {...props} className="min-w-[80dvw]" />,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    min: 0,
    max: 100,
    value: 33,
    size: 'medium',
    variant: 'indeterminate',
  },
  argTypes: {
    color: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'neutral', 'error'],
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
    },
    variant: {
      control: 'inline-radio',
      options: ['indeterminate', 'determinate'],
    },
  },
} satisfies Meta<typeof LinearProgress>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
