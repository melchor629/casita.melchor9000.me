import { getSessionQueryOptions } from '#actions/queries/get-session.ts'
import { invokeAction, makeMutation } from '../helpers'
import type { ActionParameters } from '../server'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useToggleUserLogin,
} = makeMutation({
  mutationFn: (...args: ActionParameters<'toggle-user-login-action'>) => invokeAction('toggle-user-login-action', ...args),
  onSuccess: (disabled, { id, type }, _, { client }) => {
    const { queryKey } = getSessionQueryOptions()
    const data = client.getQueryData(queryKey)
    if (data) {
      const newData = {
        ...data,
        user: {
          ...data.user,
          logins: data.user.logins.map((l) => l.id === id && l.type === type ? { ...l, disabled } : l),
        },
      } satisfies typeof data
      client.setQueryData(queryKey, newData)
    }
  },
})
