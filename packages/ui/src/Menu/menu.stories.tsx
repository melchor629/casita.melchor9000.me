import { fn } from 'storybook/test'
import preview from '#.storybook/preview'
import { Android, Github, Home, Settings } from '../icons'
import Menu from './menu'
import MenuItem from './menu-item'

const meta = preview.meta({
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
})

export const Default = meta.story()
