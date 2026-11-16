import { fn } from 'storybook/test'
import preview from '#.storybook/preview'
import { Default as ButtonStoriesMeta } from '../Button/button.stories'
import { RadioButtonGroup, RadioButton } from '.'

const meta = preview.meta({
  title: 'molecules/RadioButtonGroup',
  component: RadioButtonGroup,
  subcomponents: {
    RadioButton,
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    color: 'primary',
    size: 'medium',
    variant: 'filled',
    name: 'what',
    onChange: fn(),
  },
  argTypes: {
    color: ButtonStoriesMeta.meta.input.argTypes!.color,
    size: ButtonStoriesMeta.meta.input.argTypes!.size,
    variant: ButtonStoriesMeta.meta.input.argTypes!.variant,
  },
})

export const Default = meta.story({
  render: (props) => (
    <RadioButtonGroup {...props}>
      <RadioButton value="1">First</RadioButton>
      <RadioButton value="2">Second</RadioButton>
      <RadioButton value="3">Third</RadioButton>
    </RadioButtonGroup>
  ),
})
