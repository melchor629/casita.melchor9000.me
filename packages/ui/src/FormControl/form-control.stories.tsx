import type { Meta, StoryObj } from '@storybook/react-vite'
import FormControl from './form-control'

const meta = {
  title: 'molecules/Form Control',
  component: FormControl,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    fullWidth: false,
    helperText: 'This is a form control with some help text',
    label: 'Form Control',
  },
  argTypes: {},
} satisfies Meta<typeof FormControl>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => <FormControl {...args} htmlFor="text"><input type="text" id="text" /></FormControl>,
}

export const WithError: Story = {
  render: (args) => <FormControl {...args} htmlFor="text"><input type="text" id="text" required /></FormControl>,
  args: {
    error: 'The field is required',
  },
}

export const WithDisabled: Story = {
  render: (args) => <FormControl {...args} htmlFor="text"><input type="text" id="text" disabled /></FormControl>,
  args: {},
}
