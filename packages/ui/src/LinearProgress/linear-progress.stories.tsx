import preview from '#.storybook/preview'
import LinearProgress from './linear-progress'

const meta = preview.meta({
  title: 'atoms/Linear Progress',
  component: LinearProgress,
  render: (props) => <LinearProgress {...props} className="min-w-[80dvw]" />,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    min: 0,
    max: 100,
    value: 33,
    size: 'medium',
    variant: 'indeterminate',
  },
  argTypes: {
    color: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'neutral', 'error'],
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
    },
    variant: {
      control: 'inline-radio',
      options: ['indeterminate', 'determinate'],
    },
  },
})

export const Default = meta.story()
