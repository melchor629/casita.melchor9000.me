import type { Meta, StoryObj } from '@storybook/react-vite'
import FormControl from '../FormControl'
import TextArea from './text-area'

const meta = {
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
} satisfies Meta<typeof TextArea>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithFormControl: Story = {
  render: (args) => <FormControl htmlFor="text" label="Text Area" helperText="Some text"><TextArea {...args} id="text" /></FormControl>,
}

export const WithFormControlError: Story = {
  render: (args) => <FormControl htmlFor="text" label="Text Area" error="Invalid value!"><TextArea {...args} id="text" /></FormControl>,
  args: {},
}
