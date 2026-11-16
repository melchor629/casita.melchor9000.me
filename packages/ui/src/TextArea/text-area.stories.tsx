import preview from '#.storybook/preview'
import FormControl from '../FormControl'
import TextArea from './text-area'

const meta = preview.meta({
  title: 'atoms/Text Area',
  component: TextArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    fullWidth: false,
    size: 'medium',
    disabled: false,
    readOnly: false,
    placeholder: '',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['large', 'medium', 'small'],
    },
  },
})

export const Default = meta.story()

export const WithFormControl = meta.story({
  render: (args) => (
    <FormControl htmlFor="text" label="Text Area" helperText="Some text">
      <TextArea {...args} id="text" />
    </FormControl>
  ),
})

export const WithFormControlError = meta.story({
  render: (args) => (
    <FormControl htmlFor="text" label="Text Area" error="Invalid value!">
      <TextArea {...args} id="text" />
    </FormControl>
  ),
  args: {},
})
