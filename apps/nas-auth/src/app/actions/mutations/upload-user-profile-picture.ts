import getQueryClient from '../client'
import { invokeAction, makeMutation } from '../helpers'
import { getUserProfilePicturesQueryOptions } from '../queries/get-user-profile-pictures'

// eslint-disable-next-line import-x/prefer-default-export
export const {
  useHook: useUploadUserProfilePicture,
} = makeMutation({
  mutationFn: (formData: FormData) => invokeAction('upload-user-profile-picture', formData),
  onSuccess(data) {
    const queryClient = getQueryClient()
    const { queryKey } = getUserProfilePicturesQueryOptions()
    const imagesData = queryClient.getQueryData(queryKey)
    if (imagesData && data) {
      queryClient.setQueryData(queryKey, [
        ...imagesData,
        data,
      ])
    }
  },
})
