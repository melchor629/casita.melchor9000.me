import type { Meta, StoryObj } from '@storybook/react-vite'
import Text from './text'

const meta = {
  title: 'atoms/Text',
  component: Text,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    align: {
      control: 'inline-radio',
      options: ['start', 'end', 'center', 'justify'],
    },
    color: {
      control: 'inline-radio',
      options: ['textMain', 'textSecondary', 'contrasted', 'primary', 'secondary', 'neutral', 'warning', 'error'],
    },
    size: {
      control: 'inline-radio',
      options: ['bodySmall', 'body', 'bodyLarge', 'h4', 'h3', 'h2', 'h1'],
    },
    weight: {
      control: 'inline-radio',
      options: ['light', 'normal', 'medium', 'bold'],
    },
  },
  args: {
    children: 'This is some nice text',
    underline: false,
    italic: false,
    ellipsize: false,
  },
} satisfies Meta<typeof Text>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
