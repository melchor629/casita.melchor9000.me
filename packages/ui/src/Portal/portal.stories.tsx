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
      <div className="bg-primary-main fixed right-4 bottom-4 rounded-md p-4 text-white">
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
          className="border-text-secondary rounded-md border-2 border-dashed p-4"
          data-testid="portal-root"
        >
          <p>Portal root (content will appear here)</p>
        </div>
        <Portal
          {...args}
          portal={portalRootRef.current ?? undefined}
        >
          <div className="bg-primary-main text-text-contrasted rounded p-2">Portaled content</div>
        </Portal>
      </div>
    )
  },
})
