import { invokeAction, makeMutation } from '../helpers'
import type { ActionParameters } from '../server'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useEditUserPermission,
} = makeMutation({
  mutationFn: (...args: ActionParameters<'edit-user-permission'>) => invokeAction('edit-user-permission', ...args),
})
