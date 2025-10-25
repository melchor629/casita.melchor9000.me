import { invokeAction, makeMutation } from '../helpers'
import type { ActionParameters } from '../server'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useAddUser,
} = makeMutation({
  mutationFn: (...args: ActionParameters<'add-user'>) => invokeAction('add-user', ...args),
})
