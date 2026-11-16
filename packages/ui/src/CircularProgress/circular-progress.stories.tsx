import preview from '#.storybook/preview'
import CircularProgress from './circular-progress'

const meta = preview.meta({
  title: 'atoms/Circular Progress',
  component: CircularProgress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    size: 'medium',
    show: true,
    variant: 'indeterminate',
    percentage: 1,
  },
  argTypes: {
    color: {
      control: 'inline-radio',
      options: ['inherit', 'primary', 'secondary', 'error', 'neutral', 'contrasted'],
    },
    size: {
      control: 'inline-radio',
      options: ['large', 'medium', 'small', 'inherit'],
    },
    variant: {
      control: 'inline-radio',
      options: ['indeterminate', 'determinate'],
    },
    percentage: {
      control: 'range',
      min: 0,
      max: 100,
    },
  },
})

export const Default = meta.story()
