import type { Meta, StoryObj } from '@storybook/react-vite'
import { BrowserRouter } from 'react-router'
import ButtonStory from '../Button/button.stories.tsx'
import ReactRouterButton from './react-router-button'

const meta = {
  title: 'atoms/React Router Button',
  component: ReactRouterButton,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    to: '/',
    children: 'Link Button',
    color: 'primary',
    variant: 'text',
    size: 'medium',
  },
  argTypes: ButtonStory.argTypes,
} satisfies Meta<typeof ReactRouterButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
