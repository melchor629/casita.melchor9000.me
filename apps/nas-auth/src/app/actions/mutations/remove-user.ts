import { invokeAction, makeMutation } from '../helpers'
import type { ActionParameters } from '../server'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useRemoveUser,
} = makeMutation({
  mutationFn: (...args: ActionParameters<'remove-user'>) => invokeAction('remove-user', ...args),
})
