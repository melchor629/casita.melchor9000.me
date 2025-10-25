'use client'

import { Link, useNavigate } from '@melchor629/nice-ssr'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks'
import { useUpdateSessionUser } from '#actions/mutations/update-session-user.ts'
import { useUploadUserProfilePicture } from '#actions/mutations/upload-user-profile-picture.ts'
import { useGetSession } from '#actions/queries/get-session.ts'
import { useGetUserProfilePictures } from '#actions/queries/get-user-profile-pictures.ts'
import {
  Button,
  H1,
  Input,
  Label,
  LoadingContent,
  Select,
} from '#components/ui/index.ts'
import { useResolvedProfilePic } from '../../hooks'

const nasAuthImageUrl = 'nas-auth://'

const Profile = () => {
  const { data } = useGetSession()
  const { data: pictures } = useGetUserProfilePictures()
  const updateSessionUser = useUpdateSessionUser()
  const uploadProfilePicture = useUploadUserProfilePicture()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState(data!.user?.displayName ?? '')
  const [givenName, setGivenName] = useState(data!.user?.givenName ?? '')
  const [familyName, setFamilyName] = useState(data!.user?.familyName ?? '')
  const [profileImageUrl, setProfileImageUrl] = useState(data!.user?.profileImageUrl ?? '')
  const inputFileRef = useRef<HTMLInputElement | null>(null)

  const selectedPfp = useMemo(() => {
    if (profileImageUrl.startsWith(nasAuthImageUrl)) {
      return profileImageUrl.slice(nasAuthImageUrl.length)
    }

    return ''
  }, [profileImageUrl])

  const realProfileImageUrl = useResolvedProfilePic(profileImageUrl)

  const save = useCallback(() => {
    if (!data) {
      return
    }

    updateSessionUser.mutate({
      displayName,
      givenName,
      familyName,
      profileImageUrl,
      origin: location.origin,
    }, {
      onSuccess: () => navigate('/'),
    })
  }, [data, updateSessionUser, displayName, profileImageUrl, familyName, givenName, navigate])

  const selectFile = useCallback(() => {
    inputFileRef.current?.click()
  }, [])

  const startUpload = useCallback(() => {
    if (!inputFileRef.current?.files?.length) {
      return
    }

    const [file] = inputFileRef.current.files
    const formData = new FormData()
    formData.append('image', file, file.name)
    uploadProfilePicture.mutate(formData, {
      onSuccess: (data) => setProfileImageUrl(nasAuthImageUrl + data),
    })
  }, [uploadProfilePicture])

  const selectPfp = useCallback((value?: string | null) => {
    if (value) {
      setProfileImageUrl(`${nasAuthImageUrl}${value}`)
    }
  }, [])

  useEffect(() => {
    if (!data?.user) {
      return
    }

    setDisplayName(data.user.displayName)
    setGivenName(data.user.givenName ?? '')
    setFamilyName(data.user.familyName ?? '')
    setProfileImageUrl(data.user.profileImageUrl ?? '')
  }, [data?.user])

  if (!data) {
    return (
      <div className="flex justify-center w-full">
        <LoadingContent title="Loading user" />
      </div>
    )
  }

  return (
    <fieldset>
      <H1 className="mb-6">Edit profile</H1>

      <Label htmlFor="displayName">Display name</Label>
      <Input
        type="text"
        required
        id="displayName"
        name="displayName"
        placeholder="Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.currentTarget.value)}
      />

      <Label htmlFor="givenName">Given name</Label>
      <Input
        type="text"
        required
        id="givenName"
        name="givenName"
        placeholder="Given Name"
        value={givenName}
        onChange={(e) => setGivenName(e.currentTarget.value)}
      />

      <Label htmlFor="familyName">Family name</Label>
      <Input
        type="text"
        required
        id="familyName"
        name="familyName"
        placeholder="Family Name"
        value={familyName}
        onChange={(e) => setFamilyName(e.currentTarget.value)}
      />

      <Label htmlFor="profileImageUrl">Profile Image URL</Label>
      {realProfileImageUrl
        ? (
          <p className="flex justify-center mb-2">
            <img
              src={realProfileImageUrl}
              alt="profile"
              className="w-36 h-36 rounded-full"
            />
          </p>
          )
        : (
          <p className="mb-2 flex justify-center">
            <span className="w-36 h-36 flex justify-center items-center border rounded-full">Nop</span>
          </p>
          )}
      <div className="flex flex-nowrap justify-between mb-2 gap-2">
        <Select
          values={pictures}
          value={selectedPfp}
          labelSelector={(value) => value || 'Select one file'}
          onChange={selectPfp}
          emptyValue=""
          className="grow-0 w-full"
        />
        <Button type="button" onClick={selectFile}>Upload</Button>
        <input
          ref={inputFileRef}
          type="file"
          accept="image/jpeg,image/webp,image/avif,image/png"
          className="hidden"
          onChange={startUpload}
        />
      </div>
      <Input
        type="url"
        id="profileImageUrl"
        name="profileImageUrl"
        placeholder="Profile Image URL"
        value={profileImageUrl}
        onChange={(e) => setProfileImageUrl(e.currentTarget.value)}
      />

      <div className="mt-6 flex justify-between">
        <Button type="button" onClick={save}>Save</Button>
        <Link to="/">
          <Button>Cancel</Button>
        </Link>
      </div>
    </fieldset>
  )
}

export default Profile
