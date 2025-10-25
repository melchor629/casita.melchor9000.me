import { invokeAction, makeMutation } from '../helpers'
import type { ActionParameters } from '../server'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useEditUser,
} = makeMutation({
  mutationFn: (...args: ActionParameters<'edit-user'>) => invokeAction('edit-user', ...args),
})
