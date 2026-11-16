import { BrowserRouter } from 'react-router'
import preview from '#.storybook/preview'
import { Default as ButtonStory } from '../Button/button.stories.tsx'
import ReactRouterButton from './react-router-button'

const meta = preview.meta({
  title: 'atoms/React Router Button',
  component: ReactRouterButton,
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
    children: 'Link Button',
    color: 'primary',
    variant: 'text',
    size: 'medium',
  },
  argTypes: ButtonStory.meta.input.argTypes,
})

export const Default = meta.story()
