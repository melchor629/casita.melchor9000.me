import preview from '#.storybook/preview'
import FormControlHelperText from './form-control-helper-text'

const meta = preview.meta({
  title: 'atoms/Form Control Helper Text',
  component: FormControlHelperText,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'This is a helper text',
  },
})

export const Default = meta.story()

export const WithError = meta.story({
  render: (args) => (
    <div className="group/form-control error">
      <FormControlHelperText {...args}>Error message text</FormControlHelperText>
    </div>
  ),
})
