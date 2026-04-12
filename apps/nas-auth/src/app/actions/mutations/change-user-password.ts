import { getSessionQueryOptions } from '#actions/queries/get-session.ts'
import { invokeAction, makeMutation } from '../helpers'
import type { ActionParameters } from '../server'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useChangeUserPassword,
} = makeMutation({
  mutationFn: (...args: ActionParameters<'change-user-password-action'>) => invokeAction('change-user-password-action', args[0]),
  onSuccess: async (_0, _1, _2, { client }) => {
    const { queryKey } = getSessionQueryOptions()
    await client.invalidateQueries({ queryKey, exact: true })
  },
})
