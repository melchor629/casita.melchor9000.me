import preview from '#.storybook/preview'
import FormControl from '../FormControl'
import Select from './select'

const meta = preview.meta({
  title: 'atoms/Select',
  component: Select<string>,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    fullWidth: false,
    size: 'medium',
    disabled: false,
    values: ['a', 'b', 'c'],
    value: '',
    emptyValue: '',
    labelSelector: (value) => value || 'Select one',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['large', 'medium', 'small'],
    },
    value: {
      control: 'inline-radio',
      options: ['empty', 'a', 'b', 'c'],
      mapping: {
        empty: '',
      },
    },
  },
})

export const Default = meta.story()

export const WithFormControl = meta.story({
  render: (args) => (
    <FormControl htmlFor="text" label="Select" helperText="Some text">
      <Select {...args} id="text" />
    </FormControl>
  ),
  args: { fullWidth: true },
})

export const WithFormControlError = meta.story({
  render: (args) => (
    <FormControl htmlFor="text" label="Select" error="Invalid value!">
      <Select {...args} id="text" />
    </FormControl>
  ),
  args: { fullWidth: true },
})
