import { invokeAction, makeMutation } from '../helpers'
import type { ActionParameters } from '../server'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useRemoveClient,
} = makeMutation({
  mutationFn: (...args: ActionParameters<'remove-client'>) => invokeAction('remove-client', ...args),
})
