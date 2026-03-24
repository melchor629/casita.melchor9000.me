import { invokeAction, makeMutation } from '../helpers'
import type { ActionParameters } from '../server'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useEditApplication,
} = makeMutation({
  mutationFn: (...args: ActionParameters<'edit-application'>) => invokeAction('edit-application', ...args),
})
