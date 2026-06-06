import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import FormControlLabel from './form-control-label'

const meta = {
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
} satisfies Meta<typeof FormControlLabel>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CssCheck: Story = {
  args: {
    children: 'Form Label',
  },
  play: async ({ canvas }) => {
    const label = canvas.getByText('Form Label')
    const computedStyle = getComputedStyle(label)
    await expect(computedStyle.fontWeight).toBe('500')
  },
}
