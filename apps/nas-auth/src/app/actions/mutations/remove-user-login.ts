import { invokeAction, makeMutation } from '../helpers'
import type { ActionParameters } from '../server'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useRemoveUserLogin,
} = makeMutation({
  mutationFn: (...args: ActionParameters<'remove-user-login'>) => invokeAction('remove-user-login', ...args),
})
