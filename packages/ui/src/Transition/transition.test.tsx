import { expect, it } from 'vitest'
import { page } from 'vitest/browser'
import { render } from '#/test-utils'
import Transition from './transition'

const props = {
  className: 'opacity-100 aria-hidden:opacity-0',
  transitionPropertyName: 'opacity',
}

it('content is rendered but not visible when hidden', async () => {
  await render(
    <Transition {...props}>content</Transition>,
  )

  const locator = page.getByText('content')
  await expect.element(locator).toBeInTheDocument()
  await expect.element(locator).not.toBeVisible()
})

it('content is rendered and visible when shown', async () => {
  await render(
    <Transition {...props} show>content</Transition>,
  )

  const locator = page.getByText('content')
  await expect.element(locator).toBeInTheDocument()
  await expect.element(locator).toBeVisible()
})

it('content is not rendered when hidden and unmount when hidden', async () => {
  await render(
    <Transition {...props} unmountWhenHidden>content</Transition>,
  )

  const locator = page.getByText('content')
  await expect.element(locator).not.toBeInTheDocument()
})

it('content renders when show after first render', async () => {
  const { rerender } = await render(
    <Transition {...props} unmountWhenHidden>content</Transition>,
  )

  const locator = page.getByText('content')
  await expect.element(locator).not.toBeInTheDocument()

  await rerender(
    <Transition {...props} unmountWhenHidden show>content</Transition>,
  )

  await expect.element(locator).toBeInTheDocument()
  await expect.element(locator).toBeVisible()

  await rerender(
    <Transition {...props} unmountWhenHidden>content</Transition>,
  )

  await expect.element(locator).not.toBeInTheDocument()
})

it('content is kept and visible when keep interactive is set', async () => {
  await render(
    <Transition {...props} unmountWhenHidden keepInteractiveWhenHidden>content</Transition>,
  )

  const locator = page.getByText('content')
  await expect.element(locator).toBeInTheDocument()
  await expect.element(locator).toBeVisible()
})
