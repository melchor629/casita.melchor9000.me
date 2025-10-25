import { invokeAction, makeMutation } from '../helpers'
import type { ActionParameters } from '../server'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useAddApplication,
} = makeMutation({
  mutationFn: (...data: ActionParameters<'add-application'>) => invokeAction('add-application', ...data),
})
