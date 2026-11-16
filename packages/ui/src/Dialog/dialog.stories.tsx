import { fn } from 'storybook/test'
import preview from '#.storybook/preview'
import Dialog from './dialog'

const meta = preview.meta({
  title: 'molecules/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    id: 'test',
    title: 'Dialog Title',
    children: 'Some link',
    show: true,
    onClose: fn(),
    onCloseStart: fn(),
    onCloseEnd: fn(),
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large', 'extra-large'],
    },
  },
})

export const Default = meta.story()
