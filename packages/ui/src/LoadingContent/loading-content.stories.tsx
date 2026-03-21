import type { Meta, StoryObj } from '@storybook/react-vite'
import LoadingContent from './loading-content'

const meta = {
  title: 'molecules/Loading Content',
  component: LoadingContent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    title: 'Loading...',
  },
} satisfies Meta<typeof LoadingContent>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
