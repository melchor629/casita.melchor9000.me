import type { Meta, StoryObj } from '@storybook/react-vite'
import { BrowserRouter } from 'react-router'
import ReactRouterLink from './react-router-link'

const meta = {
  title: 'atoms/React Router Link',
  component: ReactRouterLink,
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
    children: 'Link',
    underline: 'never',
  },
  argTypes: {
    underline: {
      control: 'inline-radio',
      options: ['never', 'hover', 'always'],
    },
  },
} satisfies Meta<typeof ReactRouterLink>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
