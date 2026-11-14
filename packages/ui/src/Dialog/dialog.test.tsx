import { expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '#/test-utils'
import Dialog from './dialog.tsx'

it('dialog content is not mounted when unmountWhenHidden is set to true', async () => {
  await render(
    <Dialog
      id="test"
      title="Test Dialog"
      onClose={vi.fn()}
      unmountWhenHidden
    >
      Test content
    </Dialog>,
  )

  expect(page.getByRole('dialog')).not.toBeInTheDocument()
})

it('dialog content has a close button', async () => {
  await render(
    <Dialog
      id="test"
      title="Test Dialog"
      onClose={vi.fn()}
      show
    >
      Test content
    </Dialog>,
  )

  await expect.element(page.getByRole('dialog')).toBeInTheDocument()
  await expect.element(page.getByRole('button')).toBeInTheDocument()
  await expect.element(page.getByText('Test content')).toBeInTheDocument()
})

it('dialog opened notifies close intention when button is pressed', async () => {
  const onClose = vi.fn()
  await render(
    <Dialog
      id="test"
      title="Test Dialog"
      onClose={onClose}
      show
    >
      Test content
    </Dialog>,
  )

  await userEvent.click(page.getByRole('button'))

  expect(onClose).toHaveBeenCalledOnce()
  expect(onClose).toHaveBeenCalledWith('button')
})

it('dialog opened notifies close intention when backdrop is clicked', async () => {
  const onClose = vi.fn()
  await render(
    <Dialog
      id="test"
      title="Test Dialog"
      onClose={onClose}
      show
    >
      Test content
    </Dialog>,
  )

  await userEvent.click(page.getByTestId('dialog:backdrop'), {
    position: {
      x: 10,
      y: 10,
    },
  })

  expect(onClose).toHaveBeenCalledOnce()
  expect(onClose).toHaveBeenCalledWith('backdrop')
})

it('dialog opened notifies close intention when ESC is pressed', async () => {
  const onClose = vi.fn()
  await render(
    <Dialog
      id="test"
      title="Test Dialog"
      onClose={onClose}
      show
    >
      Test content
    </Dialog>,
  )

  await userEvent.keyboard('{Escape}K')

  expect(onClose).toHaveBeenCalledOnce()
  expect(onClose).toHaveBeenCalledWith('escape')
})
