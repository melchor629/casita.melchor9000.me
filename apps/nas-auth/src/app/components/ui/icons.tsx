import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon, type FontAwesomeIconProps } from '@fortawesome/react-fontawesome'

type Props = Readonly<Omit<FontAwesomeIconProps, 'icon'>>

export const IconGoogle = (props: Props) => <FontAwesomeIcon {...props} icon={faGoogle} />
export const IconGithub = (props: Props) => <FontAwesomeIcon {...props} icon={faGithub} />
