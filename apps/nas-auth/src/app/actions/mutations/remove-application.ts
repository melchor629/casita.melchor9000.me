import { invokeAction, makeMutation } from '../helpers'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useRemoveApplication,
} = makeMutation({
  mutationFn: invokeAction.bind(null, 'remove-application'),
})
