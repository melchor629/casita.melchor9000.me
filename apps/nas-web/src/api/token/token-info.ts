export interface TokenPermission {
  name: string
  displayName: string
  write: boolean
  delete: boolean
  applicationKey: string
}

export interface TokenApplication {
  key: string
  name: string
}

export interface TokenPermissions {
  permissions: TokenPermission[]
  applications: Record<string, TokenApplication>
}
