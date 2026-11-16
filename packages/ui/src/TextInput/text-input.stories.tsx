import preview from '#.storybook/preview'
import Button from '../Button'
import FormControl from '../FormControl'
import { Home } from '../icons'
import TextInput from './text-input'

const meta = preview.meta({
  title: 'atoms/Text Input',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    fullWidth: false,
    size: 'medium',
    type: 'text',
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
    <FormControl htmlFor="text" label="Text Input" helperText="Some text">
      <TextInput {...args} id="text" />
    </FormControl>
  ),
})

export const WithFormControlError = meta.story({
  render: (args) => (
    <FormControl htmlFor="text" label="Text Input" error="Invalid value!">
      <TextInput {...args} id="text" />
    </FormControl>
  ),
  args: {},
})

export const WithStartAdornment = meta.story({
  args: {
    startAdornment: <Home size="medium" className="mx-1" />,
  },
})

export const WithEndAdornment = meta.story({
  args: {
    endAdornment: <Button size="small" icon={<Home />} variant="text" color="neutral" />,
  },
})
