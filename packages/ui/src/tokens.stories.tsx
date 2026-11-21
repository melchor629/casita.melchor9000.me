import preview from '#.storybook/preview'

const meta = preview.type<{ args: { color?: string } }>().meta({
  title: 'Tokens',
  args: {
    color: undefined!,
  },
  parameters: {
    layout: 'centered',
  },
})

function ColorRow({ className }: { readonly className: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`${className} border-text-main size-6 rounded-md border`} />
      <p className="font-bodyLarge">{className.substring(3)}</p>
    </div>
  )
}

export const Colors = meta.story({
  render: ({ color }) => (
    <div className="flex flex-col gap-2">
      {(color === 'all' || color === 'primary') && (
        <>
          <ColorRow className="bg-primary-main" />
          <ColorRow className="bg-primary-alt" />
          <ColorRow className="bg-primary-selected" />
        </>
      )}

      {(color === 'all' || color === 'secondary') && (
        <>
          <ColorRow className="bg-secondary-main" />
          <ColorRow className="bg-secondary-alt" />
          <ColorRow className="bg-secondary-selected" />
        </>
      )}

      {(color === 'all' || color === 'warning') && (
        <>
          <ColorRow className="bg-warning-main" />
          <ColorRow className="bg-warning-alt" />
          <ColorRow className="bg-warning-selected" />
          <ColorRow className="bg-warning-alert" />
        </>
      )}

      {(color === 'all' || color === 'error') && (
        <>
          <ColorRow className="bg-error-main" />
          <ColorRow className="bg-error-alt" />
          <ColorRow className="bg-error-selected" />
          <ColorRow className="bg-error-alert" />
        </>
      )}

      {(color === 'all' || color === 'success') && (
        <>
          <ColorRow className="bg-success-main" />
          <ColorRow className="bg-success-alt" />
          <ColorRow className="bg-success-selected" />
          <ColorRow className="bg-success-alert" />
        </>
      )}

      {(color === 'all' || color === 'text') && (
        <>
          <ColorRow className="bg-text-main" />
          <ColorRow className="bg-text-secondary" />
          <ColorRow className="bg-text-contrasted" />
        </>
      )}

      {(color === 'all' || color === 'elevated') && (
        <>
          <ColorRow className="bg-elevated-0" />
          <ColorRow className="bg-elevated-1" />
        </>
      )}
    </div>
  ),
  args: {
    color: 'all',
  },
  argTypes: {
    color: {
      type: 'string',
      control: 'inline-radio',
      options: ['all', 'primary', 'secondary', 'warning', 'error', 'success', 'text', 'elevated'],
    },
  },
})

function FontRow({ className }: { readonly className: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`${className} color-text-primary`}>{className.substring(5)}</div>
    </div>
  )
}

export const Fonts = meta.story({
  render: () => (
    <div className="flex flex-col gap-2">
      <FontRow className="text-h1" />
      <FontRow className="text-h2" />
      <FontRow className="text-h3" />
      <FontRow className="text-h4" />
      <FontRow className="text-body-large" />
      <FontRow className="text-body" />
      <FontRow className="text-body-small" />
    </div>
  ),
})
