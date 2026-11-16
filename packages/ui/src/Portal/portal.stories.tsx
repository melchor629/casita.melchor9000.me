import { useRef } from 'react'
import preview from '#.storybook/preview'
import Portal from './portal'

const meta = preview.meta({
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
})

export const InPlace = meta.story({
  args: {
    portal: false,
  },
})

export const InBody = meta.story({
  args: {
    portal: true,
    children: (
      <div className="fixed bottom-4 right-4 p-4 bg-primary-main text-white rounded-md">
        Portal to body
      </div>
    ),
  },
})

export const InCustomElement = meta.story({
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
          <div className="p-2 bg-primary-main rounded text-text-contrasted">Portaled content</div>
        </Portal>
      </div>
    )
  },
})
