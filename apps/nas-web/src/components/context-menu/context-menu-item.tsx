import { styled } from '../core/utils'

const ContextMenuItem = styled('button', 'ContextMenuItem')({
  base: `
    w-full inline-flex items-center gap-1.5 px-2 py-1 select-none text-nowrap
    transition-colors
    hover:not-disabled:bg-text-main/10
    not-disabled:cursor-pointer
    disabled:text-text-secondary
  `,
})

export default ContextMenuItem
