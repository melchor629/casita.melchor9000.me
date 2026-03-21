import { styled } from '@melchor629/ui/utils'

const ButtonsBarContainer = styled('div', 'ButtonsBarContainer')({
  base: 'mb-3 overflow-x-auto overflow-y-hidden relative max-w-full flex gap-3',
  variants: {
    disabled: {
      true: '*:pointer-events-none *:opacity-65',
    },
  },
})

export default ButtonsBarContainer
