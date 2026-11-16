import preview from '#.storybook/preview'
import FormControl from './form-control'

const meta = preview.meta({
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
})

export const Default = meta.story({
  render: (args) => (
    <FormControl {...args} htmlFor="text">
      <input type="text" id="text" />
    </FormControl>
  ),
})

export const WithError = meta.story({
  render: (args) => (
    <FormControl {...args} htmlFor="text">
      <input type="text" id="text" required />
    </FormControl>
  ),
  args: {
    error: 'The field is required',
  },
})

export const WithDisabled = meta.story({
  render: (args) => (
    <FormControl {...args} htmlFor="text">
      <input type="text" id="text" disabled />
    </FormControl>
  ),
  args: {},
})
