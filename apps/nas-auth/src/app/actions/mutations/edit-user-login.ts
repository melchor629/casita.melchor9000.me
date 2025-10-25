import { invokeAction, makeMutation } from '../helpers'
import type { ActionParameters } from '../server'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useEditUserLogin,
} = makeMutation({
  mutationFn: (...args: ActionParameters<'edit-user-login'>) => invokeAction('edit-user-login', ...args),
})
