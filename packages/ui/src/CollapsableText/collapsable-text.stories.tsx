import preview from '#.storybook/preview'
import { Default as TextStories } from '../Text/text.stories'
import CollapsableText from './collapsable-text'

const meta = preview.meta({
  title: 'molecules/Collapsable Text',
  component: CollapsableText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    ...TextStories.meta.input.args,
    maxLines: 3,
    children: Array(50).fill('This is some nice text').join('. ') + '. :)',
  },
  argTypes: {
    ...TextStories.meta.input.argTypes,
    maxLines: {
      control: { type: 'range', min: 1, max: 25 },
    },
  },
})

export const Default = meta.story()
