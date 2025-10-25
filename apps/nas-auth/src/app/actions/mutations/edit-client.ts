import { invokeAction, makeMutation } from '../helpers'
import type { ActionParameters } from '../server'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useEditClient,
} = makeMutation({
  mutationFn: (...args: ActionParameters<'edit-client'>) => invokeAction('edit-client', ...args),
})
