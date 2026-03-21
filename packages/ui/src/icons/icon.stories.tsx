import type { Meta, StoryObj } from '@storybook/react-vite'
import Icon from './icon'
import * as icons from './icons'

const meta = {
  title: 'atoms/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    icon: 'home',
    size: 'inherit',
    variant: 'filled',
    type: 'material-symbols',
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['inherit', 'small', 'medium', 'large'],
    },
    variant: {
      control: 'inline-radio',
      options: ['filled', 'outlined'],
    },
    type: {
      control: 'inline-radio',
      options: ['material-symbols', 'fontawesome-regular', 'fontawesome-brands'],
    },
  },
} satisfies Meta<typeof Icon>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const List: Story = {
  render: ({ icon, ...props }) => {
    const Icon = icons[icon as keyof typeof icons] ?? icons.Home
    // @ts-expect-error there are icon types that do not support variant
    return <Icon {...props} />
  },
  args: {
    icon: 'Home',
    size: 'large',
  },
  argTypes: {
    icon: {
      control: 'select',
      options: Object.keys(icons).toSorted(),
    },
  },
}
