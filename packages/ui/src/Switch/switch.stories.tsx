import preview from '#.storybook/preview'
import InputLabel from '../InputLabel'
import Switch from './switch'

const meta = preview.meta({
  title: 'atoms/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    checked: false,
    disabled: false,
    readOnly: false,
    required: false,
  },
  argTypes: {},
})

export const Default = meta.story()

export const WithLabel = meta.story({
  render: (args) => (
    <InputLabel
      input={
        <Switch
          id="checkbox"
          {...args}
        />
      }
    >
      Switch label
    </InputLabel>
  ),
})
