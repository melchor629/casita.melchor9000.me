import { invokeAction, makeMutation } from '../helpers'
import type { ActionParameters } from '../server'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useAddUserPermission,
} = makeMutation({
  mutationFn: (...args: ActionParameters<'add-user-permission'>) => invokeAction('add-user-permission', ...args),
})
