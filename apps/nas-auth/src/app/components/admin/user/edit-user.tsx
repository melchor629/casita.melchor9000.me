import type { ChangeEvent, MouseEvent } from 'preact/compat'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { useEditUser } from '#actions/mutations/edit-user.ts'
import { useRemoveUser } from '#actions/mutations/remove-user.ts'
import type { GetUserQuery } from '#queries/get-user.ts'
import {
  Button,
  Input,
  Label,
} from '../../ui'

type EditUserProps = Readonly<{
  canDelete: boolean
  readOnly: boolean
  user: GetUserQuery
}>

const EditUser = ({ canDelete, readOnly, user }: EditUserProps) => {
  const updateUserMutation = useEditUser()
  const removeUserMutation = useRemoveUser()
  const [userName, setUserName] = useState(user.userName || '')
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
      id: user.id,
      userName,
      displayName,
      givenName,
      familyName,
      profileImageUrl,
      email,
      disabled,
    })
  }, [
    user.id, readOnly,
    updateUserMutation,
    userName, displayName, givenName, familyName, profileImageUrl, email, disabled,
  ])

  const remove = useCallback((e: MouseEvent<HTMLElement>) => {
    e.preventDefault()

    if (readOnly || !canDelete) {
      return
    }

    removeUserMutation.mutate(user.id)
  }, [readOnly, canDelete, user.id, removeUserMutation])

  useEffect(() => {
    setUserName(user.userName)
    setDisplayName(user.displayName || '')
    setGivenName(user.givenName || '')
    setFamilyName(user.familyName || '')
    setProfileImageUrl(user.profileImageUrl || '')
    setEmail(user.email || '')
    setDisabled(user.disabled ?? false)
  }, [user])

  return (
    <fieldset className="my-2" disabled={readOnly || updateUserMutation.isPending || removeUserMutation.isPending}>
      <Label htmlFor="user-name">User Name</Label>
      <Input
        type="text"
        id="user-name"
        value={userName}
        readOnly={readOnly}
        onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => setUserName(e.currentTarget.value), [])}
      />

      <Label htmlFor="display-name">Display Name</Label>
      <Input
        type="text"
        id="display-name"
        value={displayName}
        readOnly={readOnly}
        onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => setDisplayName(e.currentTarget.value), [])}
      />

      <Label htmlFor="given-name">Given Name</Label>
      <Input
        type="text"
        id="given-name"
        value={givenName}
        readOnly={readOnly}
        onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => setGivenName(e.currentTarget.value), [])}
      />

      <Label htmlFor="family-name">Family Name</Label>
      <Input
        type="text"
        id="family-name"
        value={familyName}
        readOnly={readOnly}
        onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => setFamilyName(e.currentTarget.value), [])}
      />

      <Label htmlFor="profile-image-url">Profile Image URL</Label>
      <Input
        type="url"
        id="profile-image-url"
        value={profileImageUrl}
        readOnly={readOnly}
        onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => setProfileImageUrl(e.currentTarget.value), [])}
      />

      <Label htmlFor="email">Email</Label>
      <Input
        type="email"
        id="email"
        value={email}
        readOnly={readOnly}
        onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => setEmail(e.currentTarget.value), [])}
      />

      <div>
        <Input
          type="checkbox"
          id="disabled"
          checked={disabled}
          readOnly={readOnly}
          onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => setDisabled(e.currentTarget.checked), [])}
        />
        <Label htmlFor="disabled">Disabled?</Label>
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
