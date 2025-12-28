import { styled } from '../core/utils'

const ContextMenuContainer = styled('div', 'ContextMenuContainer')({
  base: `
    fixed invisible min-w-40
    bg-elevated-1/60 backdrop-blur-sm rounded-sm shadow-xl border border-text-main/25
    flex flex-col
    translate-y-4 opacity-0 transition-all
    data-[show=true]:visible data-[show=true]:translate-y-0 data-[show=true]:opacity-100
  `,
})

export default ContextMenuContainer
