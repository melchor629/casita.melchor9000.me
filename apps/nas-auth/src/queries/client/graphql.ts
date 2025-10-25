/* eslint-disable */
import type { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: any; output: any; }
};

/** Represents an API Resource of an application */
export type ApiResource = {
  __typename?: 'ApiResource';
  accessTokenFormat: ApiResourceAccessTokenFormat;
  accessTokenTTL?: Maybe<Scalars['Float']['output']>;
  /** Application in which this resource belongs to */
  application: Application;
  audience: Scalars['String']['output'];
  jwt?: Maybe<Scalars['JSONObject']['output']>;
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  scopes: Scalars['JSON']['output'];
};

export type ApiResourceAccessTokenFormat =
  | 'jwt'
  | 'opaque';

/** Represents an application in the system */
export type Application = {
  __typename?: 'Application';
  /** API Resources of the application */
  apiResources: Array<ApiResource>;
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  /** Permissions related to that application */
  permissions: Array<Permission>;
};

/** Represents one Client */
export type Client = {
  __typename?: 'Client';
  clientId: Scalars['String']['output'];
  clientName: Scalars['String']['output'];
  fields: Scalars['JSONObject']['output'];
};

/** Data for creating a new api resource */
export type CreateApiResourceInput = {
  accessTokenFormat: ApiResourceAccessTokenFormat;
  accessTokenTTL?: InputMaybe<Scalars['Float']['input']>;
  applicationKey: Scalars['String']['input'];
  audience: Scalars['String']['input'];
  jwt?: InputMaybe<Scalars['JSONObject']['input']>;
  key: Scalars['String']['input'];
  name: Scalars['String']['input'];
  scopes: Scalars['JSON']['input'];
};

/** Data for creating a new application */
export type CreateApplicationInput = {
  key: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

/** Data for creating a new client */
export type CreateClientInput = {
  clientId: Scalars['String']['input'];
  clientName: Scalars['String']['input'];
  fields?: InputMaybe<Scalars['JSONObject']['input']>;
};

/** Data for creating a new login */
export type CreateLoginInput = {
  data?: InputMaybe<Scalars['JSONObject']['input']>;
  disabled?: InputMaybe<Scalars['Boolean']['input']>;
  loginId: Scalars['String']['input'];
  type: Scalars['String']['input'];
  userId: Scalars['Int']['input'];
};

/** Data for creating a permission */
export type CreatePermissionInput = {
  applicationKey: Scalars['String']['input'];
  displayName?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

/** Data to create a new user */
export type CreateUserInput = {
  disabled?: InputMaybe<Scalars['Boolean']['input']>;
  displayName: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  familyName?: InputMaybe<Scalars['String']['input']>;
  givenName?: InputMaybe<Scalars['String']['input']>;
  profileImageUrl?: InputMaybe<Scalars['String']['input']>;
  userName: Scalars['String']['input'];
};

/** Data to create a new user permission */
export type CreateUserPermissionInput = {
  delete: Scalars['Boolean']['input'];
  permissionId: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
  write: Scalars['Boolean']['input'];
};

/** Data to edit an user permission */
export type EditUserPermissionInput = {
  delete: Scalars['Boolean']['input'];
  write: Scalars['Boolean']['input'];
};

/** Represents a login mechanism information */
export type Login = {
  __typename?: 'Login';
  data?: Maybe<Scalars['JSONObject']['output']>;
  disabled: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  loginId: Scalars['String']['output'];
  type: Scalars['String']['output'];
  /** The user that the login refers to */
  user: User;
};

/** All available mutations in the database. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a new API Resource */
  addApiResource: ApiResource;
  /** Creates a new application */
  addApplication: Application;
  /** Creates a new client */
  addClient: Client;
  /** Creates a new login for a specific user */
  addLogin: Login;
  /** Create a new permission */
  addPermission: Permission;
  /** Creates a new user */
  addUser: User;
  /** Adds a new user permission */
  addUserPermission: UserPermission;
  /** Deletes an API Resource */
  deleteApiResource: Scalars['Boolean']['output'];
  /** Deletes an application */
  deleteApplication: Scalars['Boolean']['output'];
  /** Deletes a client */
  deleteClient: Scalars['Boolean']['output'];
  /** Deletes a login */
  deleteLogin: Scalars['Boolean']['output'];
  /** Deletes a permission */
  deletePermission?: Maybe<Scalars['Boolean']['output']>;
  /** Deletes an user */
  deleteUser: Scalars['Boolean']['output'];
  /** Deletes an user permission */
  deleteUserPermission: Scalars['Boolean']['output'];
  /** Updates an API Resource */
  updateApiResource?: Maybe<ApiResource>;
  /** Updates an application */
  updateApplication?: Maybe<Application>;
  /** Updates a client */
  updateClient?: Maybe<Client>;
  /** Updates a login */
  updateLogin: Login;
  /** Update a permission */
  updatePermission?: Maybe<Permission>;
  /** Updates an existing user */
  updateUser: User;
  /** Updates an existing user permission */
  updateUserPermission?: Maybe<UserPermission>;
};


/** All available mutations in the database. */
export type MutationAddApiResourceArgs = {
  data: CreateApiResourceInput;
};


/** All available mutations in the database. */
export type MutationAddApplicationArgs = {
  data: CreateApplicationInput;
};


/** All available mutations in the database. */
export type MutationAddClientArgs = {
  data: CreateClientInput;
};


/** All available mutations in the database. */
export type MutationAddLoginArgs = {
  data: CreateLoginInput;
};


/** All available mutations in the database. */
export type MutationAddPermissionArgs = {
  data: CreatePermissionInput;
};


/** All available mutations in the database. */
export type MutationAddUserArgs = {
  data: CreateUserInput;
};


/** All available mutations in the database. */
export type MutationAddUserPermissionArgs = {
  data: CreateUserPermissionInput;
};


/** All available mutations in the database. */
export type MutationDeleteApiResourceArgs = {
  key: Scalars['String']['input'];
};


/** All available mutations in the database. */
export type MutationDeleteApplicationArgs = {
  key: Scalars['String']['input'];
};


/** All available mutations in the database. */
export type MutationDeleteClientArgs = {
  id: Scalars['String']['input'];
};


/** All available mutations in the database. */
export type MutationDeleteLoginArgs = {
  id: Scalars['Int']['input'];
};


/** All available mutations in the database. */
export type MutationDeletePermissionArgs = {
  id: Scalars['Int']['input'];
};


/** All available mutations in the database. */
export type MutationDeleteUserArgs = {
  id: Scalars['Int']['input'];
};


/** All available mutations in the database. */
export type MutationDeleteUserPermissionArgs = {
  id: Scalars['Int']['input'];
};


/** All available mutations in the database. */
export type MutationUpdateApiResourceArgs = {
  data: UpdateApiResourceInput;
  key: Scalars['String']['input'];
};


/** All available mutations in the database. */
export type MutationUpdateApplicationArgs = {
  data: UpdateApplicationInput;
  key: Scalars['String']['input'];
};


/** All available mutations in the database. */
export type MutationUpdateClientArgs = {
  data: UpdateClientInput;
  id: Scalars['String']['input'];
};


/** All available mutations in the database. */
export type MutationUpdateLoginArgs = {
  data: UpdateLoginInput;
  id: Scalars['Int']['input'];
};


/** All available mutations in the database. */
export type MutationUpdatePermissionArgs = {
  data: UpdatePermissionInput;
  id: Scalars['Int']['input'];
};


/** All available mutations in the database. */
export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
  id: Scalars['Int']['input'];
};


/** All available mutations in the database. */
export type MutationUpdateUserPermissionArgs = {
  data: EditUserPermissionInput;
  id: Scalars['Int']['input'];
};

/** Rerpesent one permission of an application */
export type Permission = {
  __typename?: 'Permission';
  /** Application associated with this permission */
  application: Application;
  displayName?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  /** Users that has this permission assigned */
  users: Array<UserPermission>;
};

/** All queries to database models. */
export type Query = {
  __typename?: 'Query';
  /** Get an API Resource */
  apiResource?: Maybe<ApiResource>;
  /** List of all registered API Resources */
  apiResources: Array<ApiResource>;
  /** Get an application */
  application?: Maybe<Application>;
  /** List of all registered applications */
  applications: Array<Application>;
  /** Gets one client */
  client?: Maybe<Client>;
  /** List of all registered clients */
  clients: Array<Client>;
  /** Gets a login for the given type and loginId */
  findLogin?: Maybe<Login>;
  /** Get info about an specific login */
  login?: Maybe<Login>;
  /** List of registered permissions */
  permissions: Array<Permission>;
  /** Get the user */
  user?: Maybe<User>;
  /** List of users registered */
  users: Array<User>;
};


/** All queries to database models. */
export type QueryApiResourceArgs = {
  key: Scalars['String']['input'];
};


/** All queries to database models. */
export type QueryApplicationArgs = {
  key: Scalars['String']['input'];
};


/** All queries to database models. */
export type QueryClientArgs = {
  id: Scalars['String']['input'];
};


/** All queries to database models. */
export type QueryFindLoginArgs = {
  loginId: Scalars['String']['input'];
  provider: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['ID']['input']>;
};


/** All queries to database models. */
export type QueryLoginArgs = {
  id: Scalars['Int']['input'];
};


/** All queries to database models. */
export type QueryUserArgs = {
  displayName?: InputMaybe<Scalars['String']['input']>;
  emails?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Scalars['Int']['input']>;
  userName?: InputMaybe<Scalars['String']['input']>;
};

/** Data for updating an api resource */
export type UpdateApiResourceInput = {
  accessTokenFormat?: InputMaybe<ApiResourceAccessTokenFormat>;
  accessTokenTTL?: InputMaybe<Scalars['Float']['input']>;
  audience?: InputMaybe<Scalars['String']['input']>;
  jwt?: InputMaybe<Scalars['JSONObject']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  scopes?: InputMaybe<Scalars['JSON']['input']>;
};

/** Data for updating an application */
export type UpdateApplicationInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Data for updating a new client */
export type UpdateClientInput = {
  clientName?: InputMaybe<Scalars['String']['input']>;
  fields?: InputMaybe<Scalars['JSONObject']['input']>;
};

/** Data for updating a login */
export type UpdateLoginInput = {
  data?: InputMaybe<Scalars['String']['input']>;
  disabled?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Data for updating a permission */
export type UpdatePermissionInput = {
  displayName?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Data to update an user */
export type UpdateUserInput = {
  disabled?: InputMaybe<Scalars['Boolean']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  familyName?: InputMaybe<Scalars['String']['input']>;
  givenName?: InputMaybe<Scalars['String']['input']>;
  profileImageUrl?: InputMaybe<Scalars['String']['input']>;
  userName?: InputMaybe<Scalars['String']['input']>;
};

/** Represents an user of the system */
export type User = {
  __typename?: 'User';
  disabled: Scalars['Boolean']['output'];
  displayName: Scalars['String']['output'];
  email?: Maybe<Scalars['String']['output']>;
  familyName?: Maybe<Scalars['String']['output']>;
  givenName?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  /** Logins that the user uses to enter in the system */
  logins: Array<Login>;
  /** Permissions that the user has */
  permissions: Array<UserPermission>;
  profileImageUrl?: Maybe<Scalars['String']['output']>;
  userName: Scalars['String']['output'];
};

/** Represents the permission relationship to an user */
export type UserPermission = {
  __typename?: 'UserPermission';
  delete: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  /** The permission the user has */
  permission: Permission;
  /** The user that has this permission */
  user: User;
  write: Scalars['Boolean']['output'];
};

export type AddApiResourceMutationVariables = Exact<{
  data: CreateApiResourceInput;
}>;


export type AddApiResourceMutation = { __typename?: 'Mutation', addApiResource: { __typename?: 'ApiResource', accessTokenFormat: ApiResourceAccessTokenFormat, accessTokenTTL?: number | null, audience: string, jwt?: any | null, key: string, name: string, scopes: any } };

export type AddApplicationMutationVariables = Exact<{
  data: CreateApplicationInput;
}>;


export type AddApplicationMutation = { __typename?: 'Mutation', addApplication: { __typename?: 'Application', key: string, name: string } };

export type AddClientMutationVariables = Exact<{
  data: CreateClientInput;
}>;


export type AddClientMutation = { __typename?: 'Mutation', addClient: { __typename?: 'Client', clientId: string, clientName: string, fields: any } };

export type CreateLoginAndUpdateUserMutationVariables = Exact<{
  data?: InputMaybe<Scalars['JSONObject']['input']>;
  loginId: Scalars['String']['input'];
  provider: Scalars['String']['input'];
  user: UpdateUserInput;
  userId: Scalars['Int']['input'];
}>;


export type CreateLoginAndUpdateUserMutation = { __typename?: 'Mutation', addLogin: { __typename?: 'Login', id: number }, updateUser: { __typename?: 'User', id: number } };

export type CreateLoginMutationVariables = Exact<{
  login: CreateLoginInput;
}>;


export type CreateLoginMutation = { __typename?: 'Mutation', addLogin: { __typename?: 'Login', id: number } };

export type AddPermissionMutationVariables = Exact<{
  data: CreatePermissionInput;
}>;


export type AddPermissionMutation = { __typename?: 'Mutation', addPermission: { __typename?: 'Permission', id: number, name: string, displayName?: string | null } };

export type CreateUserPermissionMutationVariables = Exact<{
  userPermission: CreateUserPermissionInput;
}>;


export type CreateUserPermissionMutation = { __typename?: 'Mutation', addUserPermission: { __typename?: 'UserPermission', id: number, write: boolean, delete: boolean, permission: { __typename?: 'Permission', id: number, name: string, application: { __typename?: 'Application', key: string } } } };

export type CreateUserMutationVariables = Exact<{
  user: CreateUserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', addUser: { __typename?: 'User', id: number, userName: string } };

export type DeleteApiResourceMutationVariables = Exact<{
  key: Scalars['String']['input'];
}>;


export type DeleteApiResourceMutation = { __typename?: 'Mutation', deleteApiResource: boolean };

export type DeleteApplicationMutationVariables = Exact<{
  key: Scalars['String']['input'];
}>;


export type DeleteApplicationMutation = { __typename?: 'Mutation', deleteApplication: boolean };

export type DeleteClientMutationVariables = Exact<{
  clientId: Scalars['String']['input'];
}>;


export type DeleteClientMutation = { __typename?: 'Mutation', deleteClient: boolean };

export type DeleteLoginMutationVariables = Exact<{
  loginId: Scalars['Int']['input'];
}>;


export type DeleteLoginMutation = { __typename?: 'Mutation', deleteLogin: boolean };

export type DeletePermissionMutationVariables = Exact<{
  permissionId: Scalars['Int']['input'];
}>;


export type DeletePermissionMutation = { __typename?: 'Mutation', deletePermission?: boolean | null };

export type DeleteUserPermissionMutationVariables = Exact<{
  userPermissionId: Scalars['Int']['input'];
}>;


export type DeleteUserPermissionMutation = { __typename?: 'Mutation', deleteUserPermission: boolean };

export type DeleteUserMutationVariables = Exact<{
  userId: Scalars['Int']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: boolean };

export type FindLoginInfoForExternalAuthQueryVariables = Exact<{
  provider: Scalars['String']['input'];
  loginId: Scalars['String']['input'];
  displayName: Scalars['String']['input'];
  emails: Array<Scalars['String']['input']> | Scalars['String']['input'];
  userName: Scalars['String']['input'];
}>;


export type FindLoginInfoForExternalAuthQuery = { __typename?: 'Query', findLogin?: { __typename?: 'Login', id: number, disabled: boolean, user: { __typename?: 'User', id: number, userName: string } } | null, user?: { __typename?: 'User', id: number, userName: string, displayName: string, givenName?: string | null, familyName?: string | null, profileImageUrl?: string | null, email?: string | null, disabled: boolean } | null };

export type FindLoginInfoForUsernameAndPasswordQueryVariables = Exact<{
  loginId: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
}>;


export type FindLoginInfoForUsernameAndPasswordQuery = { __typename?: 'Query', findLogin?: { __typename?: 'Login', id: number, user: { __typename?: 'User', userName: string } } | null };

export type ApiResourceQueryVariables = Exact<{
  key: Scalars['String']['input'];
}>;


export type ApiResourceQuery = { __typename?: 'Query', apiResource?: { __typename?: 'ApiResource', scopes: any, audience: string, accessTokenFormat: ApiResourceAccessTokenFormat, accessTokenTTL?: number | null, jwt?: any | null } | null };

export type ApiResourcesQueryVariables = Exact<{ [key: string]: never; }>;


export type ApiResourcesQuery = { __typename?: 'Query', apiResources: Array<{ __typename?: 'ApiResource', key: string, name: string, audience: string }> };

export type GetApplicationQueryVariables = Exact<{
  key: Scalars['String']['input'];
}>;


export type GetApplicationQuery = { __typename?: 'Query', application?: { __typename?: 'Application', key: string, name: string, permissions: Array<{ __typename?: 'Permission', id: number, name: string, displayName?: string | null }>, apiResources: Array<{ __typename?: 'ApiResource', key: string, name: string, scopes: any, audience: string, accessTokenFormat: ApiResourceAccessTokenFormat, accessTokenTTL?: number | null, jwt?: any | null }> } | null };

export type GetApplicationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetApplicationsQuery = { __typename?: 'Query', applications: Array<{ __typename?: 'Application', key: string, name: string }> };

export type GetClientQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetClientQuery = { __typename?: 'Query', client?: { __typename?: 'Client', clientId: string, clientName: string, fields: any } | null };

export type GetClientsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetClientsQuery = { __typename?: 'Query', clients: Array<{ __typename?: 'Client', clientId: string, clientName: string }> };

export type GetPermissionsForUserQueryVariables = Exact<{
  userName: Scalars['String']['input'];
}>;


export type GetPermissionsForUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', permissions: Array<{ __typename?: 'UserPermission', write: boolean, delete: boolean, permission: { __typename?: 'Permission', name: string, displayName?: string | null, application: { __typename?: 'Application', key: string, name: string } } }> } | null };

export type GetPermissionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPermissionsQuery = { __typename?: 'Query', permissions: Array<{ __typename?: 'Permission', id: number, name: string, displayName?: string | null, application: { __typename?: 'Application', key: string, name: string } }> };

export type GetUserByUserNameQueryVariables = Exact<{
  userName: Scalars['String']['input'];
}>;


export type GetUserByUserNameQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: number, userName: string, displayName: string, givenName?: string | null, familyName?: string | null, email?: string | null, profileImageUrl?: string | null, disabled: boolean, permissions: Array<{ __typename?: 'UserPermission', id: number, write: boolean, delete: boolean, permission: { __typename?: 'Permission', id: number, name: string, application: { __typename?: 'Application', key: string } } }>, logins: Array<{ __typename?: 'Login', id: number, type: string, loginId: string, data?: any | null, disabled: boolean }> } | null };

export type GetUserByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetUserByIdQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: number, userName: string, displayName: string, givenName?: string | null, familyName?: string | null, email?: string | null, profileImageUrl?: string | null, disabled: boolean, permissions: Array<{ __typename?: 'UserPermission', id: number, write: boolean, delete: boolean, permission: { __typename?: 'Permission', id: number, name: string, application: { __typename?: 'Application', key: string } } }>, logins: Array<{ __typename?: 'Login', id: number, type: string, loginId: string, data?: any | null, disabled: boolean }> } | null };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: number, userName: string, displayName: string, givenName?: string | null, familyName?: string | null, email?: string | null, profileImageUrl?: string | null }> };

export type UpdateApiResourceMutationVariables = Exact<{
  key: Scalars['String']['input'];
  data: UpdateApiResourceInput;
}>;


export type UpdateApiResourceMutation = { __typename?: 'Mutation', updateApiResource?: { __typename?: 'ApiResource', accessTokenFormat: ApiResourceAccessTokenFormat, accessTokenTTL?: number | null, audience: string, jwt?: any | null, key: string, name: string, scopes: any } | null };

export type UpdateApplicationMutationVariables = Exact<{
  key: Scalars['String']['input'];
  data: UpdateApplicationInput;
}>;


export type UpdateApplicationMutation = { __typename?: 'Mutation', updateApplication?: { __typename?: 'Application', key: string, name: string } | null };

export type UpdateClientMutationVariables = Exact<{
  id: Scalars['String']['input'];
  data: UpdateClientInput;
}>;


export type UpdateClientMutation = { __typename?: 'Mutation', updateClient?: { __typename?: 'Client', clientId: string, clientName: string, fields: any } | null };

export type UpdateLoginDataMutationVariables = Exact<{
  data: Scalars['String']['input'];
  loginId: Scalars['Int']['input'];
}>;


export type UpdateLoginDataMutation = { __typename?: 'Mutation', updateLogin: { __typename?: 'Login', id: number } };

export type UpdateLoginMutationVariables = Exact<{
  loginId: Scalars['Int']['input'];
  data: UpdateLoginInput;
}>;


export type UpdateLoginMutation = { __typename?: 'Mutation', updateLogin: { __typename?: 'Login', id: number } };

export type UpdatePermissionMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  data: UpdatePermissionInput;
}>;


export type UpdatePermissionMutation = { __typename?: 'Mutation', updatePermission?: { __typename?: 'Permission', id: number, name: string, displayName?: string | null } | null };

export type UpdateUserPermissionMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  userPermission: EditUserPermissionInput;
}>;


export type UpdateUserPermissionMutation = { __typename?: 'Mutation', updateUserPermission?: { __typename?: 'UserPermission', id: number, write: boolean, delete: boolean, permission: { __typename?: 'Permission', id: number, name: string, application: { __typename?: 'Application', name: string } } } | null };

export type UpdateUserMutationVariables = Exact<{
  user: UpdateUserInput;
  userId: Scalars['Int']['input'];
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: number, userName: string, displayName: string, givenName?: string | null, familyName?: string | null, email?: string | null, profileImageUrl?: string | null, disabled: boolean } };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const AddApiResourceDocument = new TypedDocumentString(`
    mutation addApiResource($data: CreateApiResourceInput!) {
  addApiResource(data: $data) {
    accessTokenFormat
    accessTokenTTL
    audience
    jwt
    key
    name
    scopes
  }
}
    `) as unknown as TypedDocumentString<AddApiResourceMutation, AddApiResourceMutationVariables>;
export const AddApplicationDocument = new TypedDocumentString(`
    mutation addApplication($data: CreateApplicationInput!) {
  addApplication(data: $data) {
    key
    name
  }
}
    `) as unknown as TypedDocumentString<AddApplicationMutation, AddApplicationMutationVariables>;
export const AddClientDocument = new TypedDocumentString(`
    mutation addClient($data: CreateClientInput!) {
  addClient(data: $data) {
    clientId
    clientName
    fields
  }
}
    `) as unknown as TypedDocumentString<AddClientMutation, AddClientMutationVariables>;
export const CreateLoginAndUpdateUserDocument = new TypedDocumentString(`
    mutation createLoginAndUpdateUser($data: JSONObject, $loginId: String!, $provider: String!, $user: UpdateUserInput!, $userId: Int!) {
  addLogin(
    data: {data: $data, loginId: $loginId, type: $provider, userId: $userId}
  ) {
    id
  }
  updateUser(data: $user, id: $userId) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateLoginAndUpdateUserMutation, CreateLoginAndUpdateUserMutationVariables>;
export const CreateLoginDocument = new TypedDocumentString(`
    mutation createLogin($login: CreateLoginInput!) {
  addLogin(data: $login) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateLoginMutation, CreateLoginMutationVariables>;
export const AddPermissionDocument = new TypedDocumentString(`
    mutation addPermission($data: CreatePermissionInput!) {
  addPermission(data: $data) {
    id
    name
    displayName
  }
}
    `) as unknown as TypedDocumentString<AddPermissionMutation, AddPermissionMutationVariables>;
export const CreateUserPermissionDocument = new TypedDocumentString(`
    mutation createUserPermission($userPermission: CreateUserPermissionInput!) {
  addUserPermission(data: $userPermission) {
    id
    write
    delete
    permission {
      id
      name
      application {
        key
      }
    }
  }
}
    `) as unknown as TypedDocumentString<CreateUserPermissionMutation, CreateUserPermissionMutationVariables>;
export const CreateUserDocument = new TypedDocumentString(`
    mutation createUser($user: CreateUserInput!) {
  addUser(data: $user) {
    id
    userName
  }
}
    `) as unknown as TypedDocumentString<CreateUserMutation, CreateUserMutationVariables>;
export const DeleteApiResourceDocument = new TypedDocumentString(`
    mutation deleteApiResource($key: String!) {
  deleteApiResource(key: $key)
}
    `) as unknown as TypedDocumentString<DeleteApiResourceMutation, DeleteApiResourceMutationVariables>;
export const DeleteApplicationDocument = new TypedDocumentString(`
    mutation deleteApplication($key: String!) {
  deleteApplication(key: $key)
}
    `) as unknown as TypedDocumentString<DeleteApplicationMutation, DeleteApplicationMutationVariables>;
export const DeleteClientDocument = new TypedDocumentString(`
    mutation deleteClient($clientId: String!) {
  deleteClient(id: $clientId)
}
    `) as unknown as TypedDocumentString<DeleteClientMutation, DeleteClientMutationVariables>;
export const DeleteLoginDocument = new TypedDocumentString(`
    mutation deleteLogin($loginId: Int!) {
  deleteLogin(id: $loginId)
}
    `) as unknown as TypedDocumentString<DeleteLoginMutation, DeleteLoginMutationVariables>;
export const DeletePermissionDocument = new TypedDocumentString(`
    mutation deletePermission($permissionId: Int!) {
  deletePermission(id: $permissionId)
}
    `) as unknown as TypedDocumentString<DeletePermissionMutation, DeletePermissionMutationVariables>;
export const DeleteUserPermissionDocument = new TypedDocumentString(`
    mutation deleteUserPermission($userPermissionId: Int!) {
  deleteUserPermission(id: $userPermissionId)
}
    `) as unknown as TypedDocumentString<DeleteUserPermissionMutation, DeleteUserPermissionMutationVariables>;
export const DeleteUserDocument = new TypedDocumentString(`
    mutation deleteUser($userId: Int!) {
  deleteUser(id: $userId)
}
    `) as unknown as TypedDocumentString<DeleteUserMutation, DeleteUserMutationVariables>;
export const FindLoginInfoForExternalAuthDocument = new TypedDocumentString(`
    query findLoginInfoForExternalAuth($provider: String!, $loginId: String!, $displayName: String!, $emails: [String!]!, $userName: String!) {
  findLogin(provider: $provider, loginId: $loginId) {
    id
    disabled
    user {
      id
      userName
    }
  }
  user(displayName: $displayName, emails: $emails, userName: $userName) {
    id
    userName
    displayName
    givenName
    familyName
    profileImageUrl
    email
    disabled
  }
}
    `) as unknown as TypedDocumentString<FindLoginInfoForExternalAuthQuery, FindLoginInfoForExternalAuthQueryVariables>;
export const FindLoginInfoForUsernameAndPasswordDocument = new TypedDocumentString(`
    query findLoginInfoForUsernameAndPassword($loginId: String!, $userId: ID!) {
  findLogin(provider: "local", loginId: $loginId, userId: $userId) {
    id
    user {
      userName
    }
  }
}
    `) as unknown as TypedDocumentString<FindLoginInfoForUsernameAndPasswordQuery, FindLoginInfoForUsernameAndPasswordQueryVariables>;
export const ApiResourceDocument = new TypedDocumentString(`
    query apiResource($key: String!) {
  apiResource(key: $key) {
    scopes
    audience
    accessTokenFormat
    accessTokenTTL
    jwt
  }
}
    `) as unknown as TypedDocumentString<ApiResourceQuery, ApiResourceQueryVariables>;
export const ApiResourcesDocument = new TypedDocumentString(`
    query apiResources {
  apiResources {
    key
    name
    audience
  }
}
    `) as unknown as TypedDocumentString<ApiResourcesQuery, ApiResourcesQueryVariables>;
export const GetApplicationDocument = new TypedDocumentString(`
    query getApplication($key: String!) {
  application(key: $key) {
    key
    name
    permissions {
      id
      name
      displayName
    }
    apiResources {
      key
      name
      scopes
      audience
      accessTokenFormat
      accessTokenTTL
      jwt
    }
  }
}
    `) as unknown as TypedDocumentString<GetApplicationQuery, GetApplicationQueryVariables>;
export const GetApplicationsDocument = new TypedDocumentString(`
    query getApplications {
  applications {
    key
    name
  }
}
    `) as unknown as TypedDocumentString<GetApplicationsQuery, GetApplicationsQueryVariables>;
export const GetClientDocument = new TypedDocumentString(`
    query getClient($id: String!) {
  client(id: $id) {
    clientId
    clientName
    fields
  }
}
    `) as unknown as TypedDocumentString<GetClientQuery, GetClientQueryVariables>;
export const GetClientsDocument = new TypedDocumentString(`
    query getClients {
  clients {
    clientId
    clientName
  }
}
    `) as unknown as TypedDocumentString<GetClientsQuery, GetClientsQueryVariables>;
export const GetPermissionsForUserDocument = new TypedDocumentString(`
    query getPermissionsForUser($userName: String!) {
  user(userName: $userName) {
    permissions {
      write
      delete
      permission {
        name
        displayName
        application {
          key
          name
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<GetPermissionsForUserQuery, GetPermissionsForUserQueryVariables>;
export const GetPermissionsDocument = new TypedDocumentString(`
    query getPermissions {
  permissions {
    id
    name
    displayName
    application {
      key
      name
    }
  }
}
    `) as unknown as TypedDocumentString<GetPermissionsQuery, GetPermissionsQueryVariables>;
export const GetUserByUserNameDocument = new TypedDocumentString(`
    query getUserByUserName($userName: String!) {
  user(userName: $userName) {
    id
    userName
    displayName
    givenName
    familyName
    email
    profileImageUrl
    disabled
    permissions {
      id
      write
      delete
      permission {
        id
        name
        application {
          key
        }
      }
    }
    logins {
      id
      type
      loginId
      data
      disabled
    }
  }
}
    `) as unknown as TypedDocumentString<GetUserByUserNameQuery, GetUserByUserNameQueryVariables>;
export const GetUserByIdDocument = new TypedDocumentString(`
    query getUserById($id: Int!) {
  user(id: $id) {
    id
    userName
    displayName
    givenName
    familyName
    email
    profileImageUrl
    disabled
    permissions {
      id
      write
      delete
      permission {
        id
        name
        application {
          key
        }
      }
    }
    logins {
      id
      type
      loginId
      data
      disabled
    }
  }
}
    `) as unknown as TypedDocumentString<GetUserByIdQuery, GetUserByIdQueryVariables>;
export const GetUsersDocument = new TypedDocumentString(`
    query getUsers {
  users {
    id
    userName
    displayName
    givenName
    familyName
    email
    profileImageUrl
  }
}
    `) as unknown as TypedDocumentString<GetUsersQuery, GetUsersQueryVariables>;
export const UpdateApiResourceDocument = new TypedDocumentString(`
    mutation updateApiResource($key: String!, $data: UpdateApiResourceInput!) {
  updateApiResource(key: $key, data: $data) {
    accessTokenFormat
    accessTokenTTL
    audience
    jwt
    key
    name
    scopes
  }
}
    `) as unknown as TypedDocumentString<UpdateApiResourceMutation, UpdateApiResourceMutationVariables>;
export const UpdateApplicationDocument = new TypedDocumentString(`
    mutation updateApplication($key: String!, $data: UpdateApplicationInput!) {
  updateApplication(key: $key, data: $data) {
    key
    name
  }
}
    `) as unknown as TypedDocumentString<UpdateApplicationMutation, UpdateApplicationMutationVariables>;
export const UpdateClientDocument = new TypedDocumentString(`
    mutation updateClient($id: String!, $data: UpdateClientInput!) {
  updateClient(id: $id, data: $data) {
    clientId
    clientName
    fields
  }
}
    `) as unknown as TypedDocumentString<UpdateClientMutation, UpdateClientMutationVariables>;
export const UpdateLoginDataDocument = new TypedDocumentString(`
    mutation updateLoginData($data: String!, $loginId: Int!) {
  updateLogin(data: {data: $data}, id: $loginId) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateLoginDataMutation, UpdateLoginDataMutationVariables>;
export const UpdateLoginDocument = new TypedDocumentString(`
    mutation updateLogin($loginId: Int!, $data: UpdateLoginInput!) {
  updateLogin(data: $data, id: $loginId) {
    id
  }
}
    `) as unknown as TypedDocumentString<UpdateLoginMutation, UpdateLoginMutationVariables>;
export const UpdatePermissionDocument = new TypedDocumentString(`
    mutation updatePermission($id: Int!, $data: UpdatePermissionInput!) {
  updatePermission(id: $id, data: $data) {
    id
    name
    displayName
  }
}
    `) as unknown as TypedDocumentString<UpdatePermissionMutation, UpdatePermissionMutationVariables>;
export const UpdateUserPermissionDocument = new TypedDocumentString(`
    mutation updateUserPermission($id: Int!, $userPermission: EditUserPermissionInput!) {
  updateUserPermission(id: $id, data: $userPermission) {
    id
    write
    delete
    permission {
      id
      name
      application {
        name
      }
    }
  }
}
    `) as unknown as TypedDocumentString<UpdateUserPermissionMutation, UpdateUserPermissionMutationVariables>;
export const UpdateUserDocument = new TypedDocumentString(`
    mutation updateUser($user: UpdateUserInput!, $userId: Int!) {
  updateUser(data: $user, id: $userId) {
    id
    userName
    displayName
    givenName
    familyName
    email
    profileImageUrl
    disabled
  }
}
    `) as unknown as TypedDocumentString<UpdateUserMutation, UpdateUserMutationVariables>;