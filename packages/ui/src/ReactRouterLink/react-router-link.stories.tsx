import { BrowserRouter } from 'react-router'
import preview from '#.storybook/preview'
import ReactRouterLink from './react-router-link'

const meta = preview.meta({
  title: 'atoms/React Router Link',
  component: ReactRouterLink,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    to: '/',
    children: 'Link',
    underline: 'never',
  },
  argTypes: {
    underline: {
      control: 'inline-radio',
      options: ['never', 'hover', 'always'],
    },
  },
})

export const Default = meta.story()
