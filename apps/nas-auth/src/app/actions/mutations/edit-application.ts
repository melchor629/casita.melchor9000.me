import { invokeAction, makeMutation } from '../helpers'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useEditApplication,
} = makeMutation({
  mutationFn: invokeAction.bind(null, 'edit-application'),
})
