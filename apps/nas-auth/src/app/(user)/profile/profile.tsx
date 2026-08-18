import { Link, useNavigate } from '@melchor629/nice-ssr'
import { Button, FormControl, Select, Text, TextInput } from '@melchor629/ui'
import { FileUpload, KeyVertical, Passkey } from '@melchor629/ui/icons'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useUpdateSessionUser } from '#actions/mutations/update-session-user.ts'
import { useUploadUserProfilePicture } from '#actions/mutations/upload-user-profile-picture.ts'
import { useGetSession } from '#actions/queries/get-session.ts'
import { useGetUserProfilePictures } from '#actions/queries/get-user-profile-pictures.ts'
import { LoadingContent } from '#components/ui/index.ts'
import { useResolvedProfilePic } from '../../hooks'
import ChangePasswordDialog from './change-password-dialog'
import LoginRow from './login-row'
import RegisterPasskeyDialog from './register-passkey-dialog'

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
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false)
  const [showRegisterPasskeyDialog, setShowRegisterPasskeyDialog] = useState(false)
  const inputFileRef = useRef<HTMLInputElement | null>(null)

  const selectedPfp = useMemo(() => {
    if (profileImageUrl.startsWith(nasAuthImageUrl)) {
      return profileImageUrl.slice(nasAuthImageUrl.length)
    }

    return ''
  }, [profileImageUrl])

  const realProfileImageUrl = useResolvedProfilePic({ profileImageUrl })

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

  const openChangePasswordDialog = useCallback(() => setShowChangePasswordDialog(true), [])
  const closeChangePasswordDialog = useCallback(() => setShowChangePasswordDialog(false), [])
  const openRegisterPasskeyDialog = useCallback(() => setShowRegisterPasskeyDialog(true), [])
  const closeRegisterPasskeyDialog = useCallback(() => setShowRegisterPasskeyDialog(false), [])

  useEffect(() => {
    if (!data?.user) {
      return
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <fieldset className="min-inline-auto" disabled={updateSessionUser.isPending}>
      <Text size="h1" className="mb-6">Edit profile</Text>

      <FormControl
        label="Display name"
        htmlFor="displayName"
        className="mb-2"
      >
        <TextInput
          type="text"
          required
          id="displayName"
          name="displayName"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.currentTarget.value)}
        />
      </FormControl>

      <FormControl
        label="Given name"
        htmlFor="givenName"
        className="mb-2"
      >
        <TextInput
          type="text"
          required
          id="givenName"
          name="givenName"
          placeholder="Given Name"
          value={givenName}
          onChange={(e) => setGivenName(e.currentTarget.value)}
        />
      </FormControl>

      <FormControl
        label="Family name"
        htmlFor="familyName"
        className="mb-2"
      >
        <TextInput
          type="text"
          required
          id="familyName"
          name="familyName"
          placeholder="Family Name"
          value={familyName}
          onChange={(e) => setFamilyName(e.currentTarget.value)}
        />
      </FormControl>

      <FormControl
        htmlFor="profileImageUrl"
        label="Profile Image URL"
        className="mb-2"
      >
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
            name="uploadedProfileImages"
            values={pictures}
            value={selectedPfp}
            labelSelector={(value) => value || 'Select one file'}
            onChange={selectPfp}
            emptyValue=""
            className="grow-0 w-full"
          />
          <Button
            type="button"
            onClick={selectFile}
            icon={<FileUpload />}
            color="neutral"
          />
          <input
            ref={inputFileRef}
            type="file"
            accept="image/jpeg,image/webp,image/avif,image/png"
            className="hidden"
            onChange={startUpload}
          />
        </div>
        <TextInput
          type="url"
          id="profileImageUrl"
          name="profileImageUrl"
          placeholder="Profile Image URL"
          value={profileImageUrl}
          onChange={(e) => setProfileImageUrl(e.currentTarget.value)}
        />
      </FormControl>

      <div className="mt-6 mb-8 flex justify-between">
        <Button type="button" onClick={save} loading={updateSessionUser.isPending}>Save</Button>
        <Link to="/">
          <Button variant="text" color="neutral">Cancel</Button>
        </Link>
      </div>

      <Text weight="medium" className="mb-1 mt-3 select-none">Logins & Passkeys</Text>
      <Text size="bodySmall" color="textSecondary" className="mb-2">
        View and disable/enable all associated logins for your account. Changes are applied
        instantly!
      </Text>
      <div className="mb-2 flex justify-end gap-1">
        <Button
          type="button"
          variant="text"
          color="neutral"
          size="small"
          onClick={openChangePasswordDialog}
          icon={<KeyVertical />}
        >
          Change password
        </Button>
        <Button
          type="button"
          variant="text"
          color="neutral"
          size="small"
          onClick={openRegisterPasskeyDialog}
          icon={<Passkey />}
        >
          Register Passkey
        </Button>
      </div>
      <div className="flex w-full flex-col gap-1 mb-2">
        {data.user.logins.map((l) => (
          <LoginRow key={l.id} login={l} />
        ))}
      </div>

      <ChangePasswordDialog onClose={closeChangePasswordDialog} show={showChangePasswordDialog} />
      <RegisterPasskeyDialog onClose={closeRegisterPasskeyDialog} show={showRegisterPasskeyDialog} />
    </fieldset>
  )
}

export default Profile
