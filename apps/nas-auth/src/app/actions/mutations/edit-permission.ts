import { invokeAction, makeMutation } from '../helpers'
import type { ActionParameters } from '../server'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useEditPermission,
} = makeMutation({
  mutationFn: (...args: ActionParameters<'edit-permission'>) => invokeAction('edit-permission', ...args),
})
