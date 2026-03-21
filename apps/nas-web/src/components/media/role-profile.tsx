import { makeStyles } from '@melchor629/ui/utils'
import type { Role } from '@/api/fs/media'

interface RoleProfileProps {
  readonly role: Role
}

const roleStyles = makeStyles({
  slots: {
    base: 'text-center',
    image: 'w-30 h-30 md:w-40 md:h-40 max-w-40 rounded-full object-cover',
    circle: 'w-40 h-40 rounded-full border border-text-secondary flex justify-center items-center select-none text-body-large',
  },
})

const RoleProfile = ({ role }: RoleProfileProps) => {
  const { base, circle, image } = roleStyles()
  return (
    <div className={base()}>
      {role.thumbnailUrl
        ? (
          <img
            className={image()}
            src={role.thumbnailUrl}
            alt={role.tag}
          />
          )
        : (
          <div className={circle()} role="img" aria-label={role.tag}>
            {role.tag.split(' ').map((n) => n[0]).filter((n) => !!n).join('')}
          </div>
          )}
      <div className="mt-1">{role.tag}</div>
      <div className="text-text-secondary">{role.role}</div>
    </div>
  )
}

export default RoleProfile
