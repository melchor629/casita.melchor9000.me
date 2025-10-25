import { invokeAction, makeMutation } from '../helpers'
import type { ActionParameters } from '../server'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useAddUserLogin,
} = makeMutation({
  mutationFn: (...args: ActionParameters<'add-user-login'>) => invokeAction('add-user-login', ...args),
})
