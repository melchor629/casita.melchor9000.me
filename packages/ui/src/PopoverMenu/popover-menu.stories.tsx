import { fn } from 'storybook/test'
import preview from '#.storybook/preview'
import Menu from '../Menu/menu'
import MenuItem from '../Menu/menu-item'
import { Android, Github, Home, Settings } from '../icons'
import PopoverMenu from './popover-menu'

const meta = preview.meta({
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
})

export const Default = meta.story()
