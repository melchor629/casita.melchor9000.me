import { Provider } from 'oidc-provider'
import { publicUrl } from '../config.ts'
import config from './config.ts'

const oidc = new Provider(publicUrl, config)

oidc.proxy = true

export default oidc
