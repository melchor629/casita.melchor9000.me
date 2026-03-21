import type { Meta, StoryObj } from '@storybook/react-vite'
import FormControl from '../FormControl'
import Select from './select'

const meta = {
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
} satisfies Meta<typeof Select<string>>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithFormControl: Story = {
  render: (args) => <FormControl htmlFor="text" label="Select" helperText="Some text"><Select {...args} id="text" /></FormControl>,
  args: { fullWidth: true },
}

export const WithFormControlError: Story = {
  render: (args) => <FormControl htmlFor="text" label="Select" error="Invalid value!"><Select {...args} id="text" /></FormControl>,
  args: { fullWidth: true },
}
