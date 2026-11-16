import preview from '#.storybook/preview'
import Alert from './alert'

const meta = preview.meta({
  title: 'molecules/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    severity: 'default',
    title: 'Alert title',
    children: 'Alert description',
  },
  argTypes: {
    severity: {
      control: 'inline-radio',
      options: ['default', 'error', 'warning', 'success'],
    },
  },
})

export const Default = meta.story()
