import { expect } from 'storybook/test'
import preview from '#.storybook/preview'
import FormControlLabel from './form-control-label'

const meta = preview.meta({
  title: 'atoms/Form Control Label',
  component: FormControlLabel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'Label text',
    margin: 'none',
  },
  argTypes: {
    margin: {
      control: 'inline-radio',
      options: ['none', 'dense', 'normal'],
    },
  },
})

export const Default = meta.story()

export const CssCheck = meta.story({
  args: {
    children: 'Form Label',
  },
  play: async ({ canvas }) => {
    const label = canvas.getByText('Form Label')
    const computedStyle = getComputedStyle(label)
    await expect(computedStyle.fontWeight).toBe('500')
  },
})
