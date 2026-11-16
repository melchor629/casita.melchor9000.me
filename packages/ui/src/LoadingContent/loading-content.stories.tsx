import preview from '#.storybook/preview'
import LoadingContent from './loading-content'

const meta = preview.meta({
  title: 'molecules/Loading Content',
  component: LoadingContent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    title: 'Loading...',
  },
})

export const Default = meta.story()
