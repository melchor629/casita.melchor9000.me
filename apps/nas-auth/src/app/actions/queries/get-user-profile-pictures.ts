import { invokeAction, makeQuery } from '../helpers'

export const {
  fetch: fetchGetUserProfilePictures,
  options: getUserProfilePicturesQueryOptions,
  prefetch: prefetchGetUserProfilePictures,
  useHook: useGetUserProfilePictures,
  usePrefillHook: usePrefillGetUserProfilePictures,
} = makeQuery(() => ({
  queryKey: ['session', 'pictures'],
  queryFn: () => invokeAction('get-user-profile-pictures'),
  staleTime: 60 * 1000,
  retry: 1,
}))
