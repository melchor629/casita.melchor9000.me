import { invokeAction, makeMutation } from '../helpers'
import type { ActionParameters } from '../server'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useRemoveApiResource,
} = makeMutation({
  mutationFn: (...args: ActionParameters<'remove-api-resource'>) => invokeAction('remove-api-resource', ...args),
})
