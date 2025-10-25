import getQueryClient from '../client'
import { invokeAction, makeMutation } from '../helpers'
import { getSessionQueryOptions } from '../queries/get-session'
import type { ActionParameters } from '../server'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useUpdateSessionUser,
} = makeMutation({
  mutationFn: (data: ActionParameters<'update-session-user'>[0]) =>
    invokeAction('update-session-user', data),
  onSuccess(data) {
    const queryClient = getQueryClient()
    const { queryKey } = getSessionQueryOptions()
    const sessionData = queryClient.getQueryData(queryKey)
    if (sessionData && data) {
      queryClient.setQueryData(queryKey, {
        ...sessionData,
        user: data,
      })
    }
  },
})
