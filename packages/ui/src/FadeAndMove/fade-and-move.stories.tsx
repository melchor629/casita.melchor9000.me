import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import Button from '../Button'
import FadeAndMove from './fade-and-move'

const meta = {
  title: 'atoms/Fade And Move',
  component: FadeAndMove,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    show: true,
    children: 'Content that fades and moves',
  },
} satisfies Meta<typeof FadeAndMove>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Interactive: Story = {
  render: (args) => {
    const [show, setShow] = useState(true)
    return (
      <div className="flex flex-col gap-4">
        <Button onClick={() => setShow(!show)}>
          {show ? 'Hide' : 'Show'}
          &nbsp;Content
        </Button>
        <FadeAndMove {...args} show={show}>
          <div className="p-4 bg-primary-main rounded-md text-white">
            This content fades and moves when toggled
          </div>
        </FadeAndMove>
      </div>
    )
  },
}
