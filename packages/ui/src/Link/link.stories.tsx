import preview from '#.storybook/preview'
import Link from './link'

const meta = preview.meta({
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
})

export const Default = meta.story()
