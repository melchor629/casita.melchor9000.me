import { Button, Checkbox, FormControlLabel, InputLabel, TextInput } from '@melchor629/ui'
import type { ChangeEvent, MouseEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useEditUser } from '#actions/mutations/edit-user.ts'
import { useRemoveUser } from '#actions/mutations/remove-user.ts'
import type { GetUserQuery } from '#queries/user/get-user.ts'

type EditUserProps = Readonly<{
  canDelete: boolean
  readOnly: boolean
  user: GetUserQuery
}>

const EditUser = ({ canDelete, readOnly, user }: EditUserProps) => {
  const updateUserMutation = useEditUser()
  const removeUserMutation = useRemoveUser()
  const [displayName, setDisplayName] = useState(user.displayName || '')
  const [givenName, setGivenName] = useState(user.givenName || '')
  const [familyName, setFamilyName] = useState(user.familyName || '')
  const [profileImageUrl, setProfileImageUrl] = useState(user.profileImageUrl || '')
  const [email, setEmail] = useState(user.email || '')
  const [disabled, setDisabled] = useState(user.disabled ?? false)

  const save = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (readOnly) {
      return
    }

    updateUserMutation.mutate({
      userName: user.userName,
      displayName,
      givenName,
      familyName,
      profileImageUrl,
      email,
      disabled,
    })
  }, [
    user.userName, readOnly,
    updateUserMutation,
    displayName, givenName, familyName, profileImageUrl, email, disabled,
  ])

  const remove = useCallback((e: MouseEvent<HTMLElement>) => {
    e.preventDefault()

    if (readOnly || !canDelete) {
      return
    }

    removeUserMutation.mutate(user.userName)
  }, [readOnly, canDelete, user.userName, removeUserMutation])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayName(user.displayName || '')
    setGivenName(user.givenName || '')
    setFamilyName(user.familyName || '')
    setProfileImageUrl(user.profileImageUrl || '')
    setEmail(user.email || '')
    setDisabled(user.disabled ?? false)
  }, [user])

  return (
    <fieldset className="my-2" disabled={readOnly || updateUserMutation.isPending || removeUserMutation.isPending}>
      <FormControlLabel htmlFor="user-name">User Name</FormControlLabel>
      <TextInput
        type="text"
        id="user-name"
        value={user.userName}
        readOnly
      />

      <FormControlLabel htmlFor="display-name" margin="normal">Display Name</FormControlLabel>
      <TextInput
        type="text"
        id="display-name"
        value={displayName}
        readOnly={readOnly}
        onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => setDisplayName(e.currentTarget.value), [])}
      />

      <FormControlLabel htmlFor="given-name" margin="normal">Given Name</FormControlLabel>
      <TextInput
        type="text"
        id="given-name"
        value={givenName}
        readOnly={readOnly}
        onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => setGivenName(e.currentTarget.value), [])}
      />

      <FormControlLabel htmlFor="family-name" margin="normal">Family Name</FormControlLabel>
      <TextInput
        type="text"
        id="family-name"
        value={familyName}
        readOnly={readOnly}
        onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => setFamilyName(e.currentTarget.value), [])}
      />

      <FormControlLabel htmlFor="profile-image-url" margin="normal">Profile Image URL</FormControlLabel>
      <TextInput
        type="url"
        id="profile-image-url"
        value={profileImageUrl}
        readOnly={readOnly}
        onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => setProfileImageUrl(e.currentTarget.value), [])}
      />

      <FormControlLabel htmlFor="email" margin="normal">Email</FormControlLabel>
      <TextInput
        type="email"
        id="email"
        value={email}
        readOnly={readOnly}
        onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => setEmail(e.currentTarget.value), [])}
      />

      <div>
        <InputLabel
          margin="normal"
          input={
            <Checkbox
              id="disabled"
              checked={disabled}
              readOnly={readOnly}
              onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => setDisabled(e.currentTarget.checked), [])}
            />
          }
        >
          Disabled?
        </InputLabel>
      </div>

      <div className="text-end">
        {!readOnly && (
          <Button
            type="button"
            loading={updateUserMutation.isPending}
            disabled={removeUserMutation.isPending}
            onClick={save}
          >
            Save
          </Button>
        )}
        {!readOnly && canDelete && (
          <Button
            type="button"
            variant="text"
            color="error"
            className="ml-2"
            loading={removeUserMutation.isPending}
            disabled={updateUserMutation.isPending}
            onClick={remove}
          >
            Delete
          </Button>
        )}
      </div>
    </fieldset>
  )
}

export default EditUser
