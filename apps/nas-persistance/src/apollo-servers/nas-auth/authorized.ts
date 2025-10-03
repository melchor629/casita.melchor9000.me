import { Authorized as TypeGraphqlAuthorized } from 'type-graphql'

export type SecuredResource = 'api-resource' | 'application' | 'client' | 'login' | 'permission' | 'user'
export type SecuredAction = 'create' | 'read' | 'update' | 'delete'

export type RoleType = [SecuredResource, SecuredAction] | SecuredResource

const Authorized = (...roles: RoleType[]) => TypeGraphqlAuthorized<RoleType>(...roles)
export default Authorized
