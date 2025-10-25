import type { UnknownObject } from 'oidc-provider'

export type Client = Readonly<{
  name: string
  uri: string | null
  tosUri: string | null
  policyUri: string | null
  logoUri: string | null
}>

export type Interaction = Readonly<{
  params: UnknownObject
  uid: string
  name: string
  details: UnknownObject
}>

export type ExternalAuths = ReadonlyArray<'github' | 'google'>
