import preview from '#.storybook/preview'
import Icon from './icon'
import * as icons from './icons'

const meta = preview.meta({
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
})

export const Default = meta.story()

export const List = meta.story({
  render: ({ icon, ...props }) => {
    // oxlint-disable-next-line import/namespace
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
})
