import preview from '#.storybook/preview'
import Text from './text'

const meta = preview.meta({
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
      options: [
        'textMain',
        'textSecondary',
        'contrasted',
        'primary',
        'secondary',
        'warning',
        'error',
        'success',
      ],
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
})

export const Default = meta.story()
