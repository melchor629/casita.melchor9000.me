import { invokeAction, makeMutation } from '../helpers'
import type { ActionParameters } from '../server'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useAddPermission,
} = makeMutation({
  mutationFn: (...args: ActionParameters<'add-permission'>) => invokeAction('add-permission', ...args),
})
