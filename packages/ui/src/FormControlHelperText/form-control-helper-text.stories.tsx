import type { Meta, StoryObj } from '@storybook/react-vite'
import FormControlHelperText from './form-control-helper-text'

const meta = {
  title: 'atoms/Form Control Helper Text',
  component: FormControlHelperText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'This is a helper text',
  },
} satisfies Meta<typeof FormControlHelperText>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithError: Story = {
  render: (args) => (
    <div className="group/form-control error">
      <FormControlHelperText {...args}>Error message text</FormControlHelperText>
    </div>
  ),
}
