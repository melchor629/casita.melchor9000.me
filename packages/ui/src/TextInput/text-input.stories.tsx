import type { Meta, StoryObj } from '@storybook/react-vite'
import Button from '../Button'
import FormControl from '../FormControl'
import { Home } from '../icons'
import TextInput from './text-input'

const meta = {
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
} satisfies Meta<typeof TextInput>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithFormControl: Story = {
  render: (args) => <FormControl htmlFor="text" label="Text Input" helperText="Some text"><TextInput {...args} id="text" /></FormControl>,
}

export const WithFormControlError: Story = {
  render: (args) => <FormControl htmlFor="text" label="Text Input" error="Invalid value!"><TextInput {...args} id="text" /></FormControl>,
  args: {},
}

export const WithStartAdornment: Story = {
  args: {
    startAdornment: <Home size="medium" className="mx-1" />,
  },
}

export const WithEndAdornment: Story = {
  args: {
    endAdornment: <Button size="small" icon={<Home />} variant="text" color="neutral" />,
  },
}
