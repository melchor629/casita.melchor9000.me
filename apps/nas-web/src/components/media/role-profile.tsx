import { styled } from 'styled-components'
import type { Role } from '@/api/fs/media'

interface RoleProfileProps {
  readonly role: Role
}

const RoleProfileImage = styled('img')`
  width: 150px;
  height: 150px;
  border-radius: 9999px;
  object-fit: cover;
`

const RoleProfileCircle = styled('div')`
  width: 150px;
  height: 150px;
  border-radius: 9999px;
  border: 1px solid rgba(var(--bs-body-color), 0.88);
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
`

const RoleProfile = ({ role }: RoleProfileProps) => (
  <div className="text-center">
    {role.thumbnailUrl
      ? (
        <RoleProfileImage
          src={role.thumbnailUrl}
          alt={role.tag}
        />
        )
      : (
        <RoleProfileCircle role="img" aria-label={role.tag}>
          {role.tag.split(' ').map((n) => n[0]).filter((n) => !!n).join('')}
        </RoleProfileCircle>
        )}
    <div className="mt-1">{role.tag}</div>
    <div className="text-muted">{role.role}</div>
  </div>
)

export default RoleProfile
