import type { Meta, StoryObj } from '@storybook/react-vite'
import TextStories from '../Text/text.stories'
import CollapsableText from './collapsable-text'

const meta = {
  title: 'molecules/Collapsable Text',
  component: CollapsableText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    ...TextStories.args,
    maxLines: 3,
    children: Array(50).fill(TextStories.args.children).join('. ') + '. :)',
  },
  argTypes: {
    ...TextStories.argTypes,
    maxLines: {
      control: { type: 'range', min: 1, max: 25 },
    },
  },
} satisfies Meta<typeof CollapsableText>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
