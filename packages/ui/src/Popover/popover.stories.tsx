import { flip, offset, shift } from '@floating-ui/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useLayoutEffect, useState } from 'react'
import { fn } from 'storybook/test'
import Portal from '../Portal'
import Popover, { type PopoverProps } from './popover'

const meta = {
  title: 'molecules/Popover',
  component: Popover,
  subcomponents: {
    Portal,
  },
  parameters: {
    layout: 'centered',
  },
  args: {
    referenceElement: null,
    onClose: fn(),
    placement: 'bottom',
    strategy: 'absolute',
    portal: false,
  },
  argTypes: {
    placement: {
      control: 'select',
      options: [
        'top', 'right', 'bottom', 'left',
        'top-start', 'right-start', 'bottom-start', 'left-start',
        'top-end', 'right-end', 'bottom-end', 'left-end',
      ],
    },
    strategy: {
      control: 'inline-radio',
      options: ['absolute', 'fixed'],
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => {
    const [mousePos, setMousePos] = useState<PopoverProps['referenceElement'] | null>(null)
    useLayoutEffect(() => {
      const fn = ({ clientX: x, clientY: y }: MouseEvent) => {
        setMousePos({
          getBoundingClientRect() {
            return {
              x,
              y,
              top: y,
              left: x,
              bottom: null!,
              right: null!,
              width: 1,
              height: 1,
            }
          },
        })
      }
      window.addEventListener('mousemove', fn, false)
      return () => window.removeEventListener('mousemove', fn, false)
    }, [])
    return (
      <Popover {...args} referenceElement={mousePos} middleware={[offset(8), flip(), shift()]}>
        <div className="bg-primary-main size-4 rounded-md shadow-md" />
      </Popover>
    )
  },
}
