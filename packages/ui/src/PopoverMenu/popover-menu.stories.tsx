import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import Menu from '../Menu/menu'
import MenuItem from '../Menu/menu-item'
import { Android, Github, Home, Settings } from '../icons'
import PopoverMenu from './popover-menu'

const meta = {
  title: 'molecules/Popover Menu',
  component: PopoverMenu,
  subcomponents: {
    Menu,
    MenuItem,
  },
  parameters: {
    layout: 'centered',
  },
  args: {
    referenceElement: 'contextMenu',
    portal: false,
    unmountWhenHidden: false,
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
} satisfies Meta<typeof PopoverMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
