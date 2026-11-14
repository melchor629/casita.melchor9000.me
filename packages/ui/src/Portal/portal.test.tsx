import { createRef } from 'react'
import { expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { render } from '#/test-utils'
import Portal from './portal.tsx'

it('disabled portal renders as is', async () => {
  const { locator } = await render(<Portal>text</Portal>)

  await expect.element(locator).toHaveTextContent('text')
})

it('default portal renders inside body', async () => {
  const { locator } = await render(<Portal portal>text</Portal>)

  await expect.element(locator).not.toHaveTextContent('text')
  await expect.element(page.getByText('text')).toBeInTheDocument()
})

it('targeted portal renders inside target element', async () => {
  const ref = createRef<HTMLDivElement>()
  await render(<div ref={ref} />)
  const { locator } = await render(<Portal portal={ref.current!}>text</Portal>)

  await expect.element(locator).not.toHaveTextContent('text')
  await expect.element(page.elementLocator(ref.current!)).toHaveTextContent('text')
})
