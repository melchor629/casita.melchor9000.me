import { invokeAction, makeMutation } from '../helpers'
import type { ActionParameters } from '../server'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useAddClient,
} = makeMutation({
  mutationFn: (...args: ActionParameters<'add-client'>) => invokeAction('add-client', ...args),
})
