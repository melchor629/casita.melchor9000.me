import { invokeAction, makeMutation } from '../helpers'
import type { ActionParameters } from '../server'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useRemoveApplication,
} = makeMutation({
  mutationFn: (...args: ActionParameters<'remove-application'>) => invokeAction('remove-application', ...args),
})
