import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import Button from '../Button'
import Collapse from './collapse'

const meta = {
  title: 'atoms/Collapse',
  component: Collapse,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    show: true,
    minSize: '',
    children: 'Content that collapses and expands.',
  },
} satisfies Meta<typeof Collapse>

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
        <Collapse {...args} show={show}>
          <div className="p-4 bg-primary-main rounded-md text-white">
            This content expands toggled
          </div>
        </Collapse>
      </div>
    )
  },
}
