import { invokeAction, makeMutation } from '../helpers'
import type { ActionParameters } from '../server'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useEditApiResource,
} = makeMutation({
  mutationFn: (...args: ActionParameters<'edit-api-resource'>) => invokeAction('edit-api-resource', ...args),
})
