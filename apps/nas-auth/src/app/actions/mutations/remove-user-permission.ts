import { invokeAction, makeMutation } from '../helpers'
import type { ActionParameters } from '../server'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useRemoveUserPermission,
} = makeMutation({
  mutationFn: (...args: ActionParameters<'remove-user-permission'>) => invokeAction('remove-user-permission', ...args),
})
