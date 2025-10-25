import { invokeAction, makeMutation } from '../helpers'
import type { ActionParameters } from '../server'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useAddApiResource,
} = makeMutation({
  mutationFn: (...args: ActionParameters<'add-api-resource'>) => invokeAction('add-api-resource', ...args),
})
