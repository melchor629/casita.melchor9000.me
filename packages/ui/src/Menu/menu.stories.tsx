import type { Meta, StoryObj } from '@storybook/react-vite'
import Menu from './menu'
import MenuItem from './menu-item'
import { fn } from 'storybook/test'
import { Android, Github, Home, Settings } from '../icons'

const meta = {
  title: 'molecules/Menu',
  component: Menu,
  subcomponents: {
    MenuItem,
  },
  parameters: {
    layout: 'centered',
  },
  args: {
    items: [
      {
        key: 'home',
        label: 'Home',
        icon: <Home />,
        onAction: fn(),
      },
      {
        key: 'android',
        label: 'Android',
        icon: <Android />,
        onAction: fn(),
      },
      {
        key: 'settings',
        label: 'Settings',
        icon: <Settings />,
        disabled: true,
      },
      {
        key: 'github',
        label: 'Github',
        icon: <Github />,
        selected: true,
      },
      {
        key: 'nothing',
        label: 'Nothing',
        selected: true,
      },
    ],
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Menu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
