import { invokeAction, makeMutation } from '../helpers'
import type { ActionParameters } from '../server'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useRemovePermission,
} = makeMutation({
  mutationFn: (...args: ActionParameters<'remove-permission'>) => invokeAction('remove-permission', ...args),
})
