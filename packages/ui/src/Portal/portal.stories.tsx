import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef } from 'react'
import Portal from './portal'

const meta = {
  title: 'atoms/Portal',
  component: Portal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'Content in portal',
    portal: false,
  },
} satisfies Meta<typeof Portal>

export default meta

type Story = StoryObj<typeof meta>

export const InPlace: Story = {
  args: {
    portal: false,
  },
}

export const InBody: Story = {
  args: {
    portal: true,
    children: (
      <div className="fixed bottom-4 right-4 p-4 bg-primary-main text-white rounded-md">
        Portal to body
      </div>
    ),
  },
}

export const InCustomElement: Story = {
  render: (args) => {
    const portalRootRef = useRef<HTMLDivElement>(null)
    return (
      <div className="flex flex-col gap-4">
        <div
          ref={portalRootRef}
          className="border-2 border-dashed border-text-secondary p-4 rounded-md"
          data-testid="portal-root"
        >
          <p>Portal root (content will appear here)</p>
        </div>
        <Portal {...args} portal={portalRootRef.current ?? undefined}>
          <div className="p-2 bg-primary-main rounded text-text-contrasted">
            Portaled content
          </div>
        </Portal>
      </div>
    )
  },
}
