import preview from '#.storybook/preview'
import Checkbox from '../Checkbox'
import Switch from '../Switch'
import InputLabel from './input-label'

const meta = preview.meta({
  title: 'atoms/Input Label',
  component: InputLabel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'Label text',
    margin: 'none',
  },
  argTypes: {
    margin: {
      control: 'inline-radio',
      options: ['none', 'dense', 'normal'],
    },
  },
})

export const WithCheckbox = meta.story({
  args: {
    input: <Checkbox />,
    children: 'Accept terms',
  },
})

export const WithSwitch = meta.story({
  args: {
    input: <Switch />,
    children: 'Enable?',
  },
})

export const WithRadio = meta.story({
  args: {
    input: <input type="radio" />,
    children: 'sore',
  },
})
