import { useState } from 'react'
import preview from '#.storybook/preview'
import Button from '../Button'
import Fade from './fade'

const meta = preview.meta({
  title: 'atoms/Fade',
  component: Fade,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    show: true,
    children: 'Content that fades in and out.',
  },
})

export const Default = meta.story()

export const Interactive = meta.story({
  render: (args) => {
    const [show, setShow] = useState(true)
    return (
      <div className="flex flex-col gap-4">
        <Button onClick={() => setShow(!show)}>
          {show ? 'Hide' : 'Show'}
          &nbsp;Content
        </Button>
        <Fade {...args} show={show}>
          <div className="p-4 bg-primary-main rounded-md text-white">
            This content fades in when toggled
          </div>
        </Fade>
      </div>
    )
  },
})
