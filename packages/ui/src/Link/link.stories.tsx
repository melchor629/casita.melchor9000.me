import type { Meta, StoryObj } from '@storybook/react-vite'
import Link from './link'

const meta = {
  title: 'atoms/Link',
  component: Link,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'Some link',
    href: 'https://example.com',
    underline: 'never',
    target: '_blank',
  },
  argTypes: {
    underline: {
      control: 'inline-radio',
      options: ['never', 'hover', 'always'],
    },
  },
} satisfies Meta<typeof Link>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
