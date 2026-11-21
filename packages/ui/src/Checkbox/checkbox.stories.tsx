import preview from '#.storybook/preview'
import InputLabel from '../InputLabel'
import Checkbox from './checkbox'

const meta = preview.meta({
  title: 'atoms/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    checked: false,
    disabled: false,
    readOnly: false,
  },
  argTypes: {},
})

export const Default = meta.story()

export const WithLabel = meta.story({
  render: (args) => (
    <InputLabel
      input={
        <Checkbox
          id="checkbox"
          {...args}
        />
      }
    >
      Checkbox label
    </InputLabel>
  ),
})
