/* eslint-disable */
import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { ApiResourceMapper } from './api-resource/schema.mappers.ts';
import type { ApplicationMapper } from './application/schema.mappers.ts';
import type { ClientMapper } from './client/schema.mappers.ts';
import type { LoginMapper } from './login/schema.mappers.ts';
import type { PermissionMapper } from './permission/schema.mappers.ts';
import type { UserMapper } from './user/schema.mappers.ts';
import type { UserPermissionMapper } from './user-permission/schema.mappers.ts';
import type { NasAuthGraphQLContext } from '../context.ts';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string | number; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: Record<string, any>; output: Record<string, any>; }
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
  data?: InputMaybe<Scalars['String']['input']>;
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
export type MutationaddApiResourceArgs = {
  data: CreateApiResourceInput;
};


/** All available mutations in the database. */
export type MutationaddApplicationArgs = {
  data: CreateApplicationInput;
};


/** All available mutations in the database. */
export type MutationaddClientArgs = {
  data: CreateClientInput;
};


/** All available mutations in the database. */
export type MutationaddLoginArgs = {
  data: CreateLoginInput;
};


/** All available mutations in the database. */
export type MutationaddPermissionArgs = {
  data: CreatePermissionInput;
};


/** All available mutations in the database. */
export type MutationaddUserArgs = {
  data: CreateUserInput;
};


/** All available mutations in the database. */
export type MutationaddUserPermissionArgs = {
  data: CreateUserPermissionInput;
};


/** All available mutations in the database. */
export type MutationdeleteApiResourceArgs = {
  key: Scalars['String']['input'];
};


/** All available mutations in the database. */
export type MutationdeleteApplicationArgs = {
  key: Scalars['String']['input'];
};


/** All available mutations in the database. */
export type MutationdeleteClientArgs = {
  id: Scalars['String']['input'];
};


/** All available mutations in the database. */
export type MutationdeleteLoginArgs = {
  id: Scalars['Int']['input'];
};


/** All available mutations in the database. */
export type MutationdeletePermissionArgs = {
  id: Scalars['Int']['input'];
};


/** All available mutations in the database. */
export type MutationdeleteUserArgs = {
  id: Scalars['Int']['input'];
};


/** All available mutations in the database. */
export type MutationdeleteUserPermissionArgs = {
  id: Scalars['Int']['input'];
};


/** All available mutations in the database. */
export type MutationupdateApiResourceArgs = {
  data: UpdateApiResourceInput;
  key: Scalars['String']['input'];
};


/** All available mutations in the database. */
export type MutationupdateApplicationArgs = {
  data: UpdateApplicationInput;
  key: Scalars['String']['input'];
};


/** All available mutations in the database. */
export type MutationupdateClientArgs = {
  data: UpdateClientInput;
  id: Scalars['String']['input'];
};


/** All available mutations in the database. */
export type MutationupdateLoginArgs = {
  data: UpdateLoginInput;
  id: Scalars['Int']['input'];
};


/** All available mutations in the database. */
export type MutationupdatePermissionArgs = {
  data: UpdatePermissionInput;
  id: Scalars['Int']['input'];
};


/** All available mutations in the database. */
export type MutationupdateUserArgs = {
  data: UpdateUserInput;
  id: Scalars['Int']['input'];
};


/** All available mutations in the database. */
export type MutationupdateUserPermissionArgs = {
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
export type QueryapiResourceArgs = {
  key: Scalars['String']['input'];
};


/** All queries to database models. */
export type QueryapplicationArgs = {
  key: Scalars['String']['input'];
};


/** All queries to database models. */
export type QueryclientArgs = {
  id: Scalars['String']['input'];
};


/** All queries to database models. */
export type QueryfindLoginArgs = {
  loginId: Scalars['String']['input'];
  provider: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['ID']['input']>;
};


/** All queries to database models. */
export type QueryloginArgs = {
  id: Scalars['Int']['input'];
};


/** All queries to database models. */
export type QueryuserArgs = {
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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  ApiResource: ResolverTypeWrapper<ApiResourceMapper>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  ApiResourceAccessTokenFormat: ResolverTypeWrapper<'jwt' | 'opaque'>;
  Application: ResolverTypeWrapper<ApplicationMapper>;
  Client: ResolverTypeWrapper<ClientMapper>;
  CreateApiResourceInput: CreateApiResourceInput;
  CreateApplicationInput: CreateApplicationInput;
  CreateClientInput: CreateClientInput;
  CreateLoginInput: CreateLoginInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  CreatePermissionInput: CreatePermissionInput;
  CreateUserInput: CreateUserInput;
  CreateUserPermissionInput: CreateUserPermissionInput;
  EditUserPermissionInput: EditUserPermissionInput;
  JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
  JSONObject: ResolverTypeWrapper<Scalars['JSONObject']['output']>;
  Login: ResolverTypeWrapper<LoginMapper>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Permission: ResolverTypeWrapper<PermissionMapper>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  UpdateApiResourceInput: UpdateApiResourceInput;
  UpdateApplicationInput: UpdateApplicationInput;
  UpdateClientInput: UpdateClientInput;
  UpdateLoginInput: UpdateLoginInput;
  UpdatePermissionInput: UpdatePermissionInput;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<UserMapper>;
  UserPermission: ResolverTypeWrapper<UserPermissionMapper>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  ApiResource: ApiResourceMapper;
  Float: Scalars['Float']['output'];
  String: Scalars['String']['output'];
  Application: ApplicationMapper;
  Client: ClientMapper;
  CreateApiResourceInput: CreateApiResourceInput;
  CreateApplicationInput: CreateApplicationInput;
  CreateClientInput: CreateClientInput;
  CreateLoginInput: CreateLoginInput;
  Boolean: Scalars['Boolean']['output'];
  Int: Scalars['Int']['output'];
  CreatePermissionInput: CreatePermissionInput;
  CreateUserInput: CreateUserInput;
  CreateUserPermissionInput: CreateUserPermissionInput;
  EditUserPermissionInput: EditUserPermissionInput;
  JSON: Scalars['JSON']['output'];
  JSONObject: Scalars['JSONObject']['output'];
  Login: LoginMapper;
  Mutation: Record<PropertyKey, never>;
  Permission: PermissionMapper;
  Query: Record<PropertyKey, never>;
  ID: Scalars['ID']['output'];
  UpdateApiResourceInput: UpdateApiResourceInput;
  UpdateApplicationInput: UpdateApplicationInput;
  UpdateClientInput: UpdateClientInput;
  UpdateLoginInput: UpdateLoginInput;
  UpdatePermissionInput: UpdatePermissionInput;
  UpdateUserInput: UpdateUserInput;
  User: UserMapper;
  UserPermission: UserPermissionMapper;
}>;

export type ApiResourceResolvers<ContextType = NasAuthGraphQLContext, ParentType extends ResolversParentTypes['ApiResource'] = ResolversParentTypes['ApiResource']> = ResolversObject<{
  accessTokenFormat?: Resolver<ResolversTypes['ApiResourceAccessTokenFormat'], ParentType, ContextType>;
  accessTokenTTL?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  application?: Resolver<ResolversTypes['Application'], ParentType, ContextType>;
  audience?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  jwt?: Resolver<Maybe<ResolversTypes['JSONObject']>, ParentType, ContextType>;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  scopes?: Resolver<ResolversTypes['JSON'], ParentType, ContextType>;
}>;

export type ApiResourceAccessTokenFormatResolvers = EnumResolverSignature<{ jwt?: any, opaque?: any }, ResolversTypes['ApiResourceAccessTokenFormat']>;

export type ApplicationResolvers<ContextType = NasAuthGraphQLContext, ParentType extends ResolversParentTypes['Application'] = ResolversParentTypes['Application']> = ResolversObject<{
  apiResources?: Resolver<Array<ResolversTypes['ApiResource']>, ParentType, ContextType>;
  key?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  permissions?: Resolver<Array<ResolversTypes['Permission']>, ParentType, ContextType>;
}>;

export type ClientResolvers<ContextType = NasAuthGraphQLContext, ParentType extends ResolversParentTypes['Client'] = ResolversParentTypes['Client']> = ResolversObject<{
  clientId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  clientName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  fields?: Resolver<ResolversTypes['JSONObject'], ParentType, ContextType>;
}>;

export interface JSONScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export interface JSONObjectScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSONObject'], any> {
  name: 'JSONObject';
}

export type LoginResolvers<ContextType = NasAuthGraphQLContext, ParentType extends ResolversParentTypes['Login'] = ResolversParentTypes['Login']> = ResolversObject<{
  data?: Resolver<Maybe<ResolversTypes['JSONObject']>, ParentType, ContextType>;
  disabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  loginId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = NasAuthGraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addApiResource?: Resolver<ResolversTypes['ApiResource'], ParentType, ContextType, RequireFields<MutationaddApiResourceArgs, 'data'>>;
  addApplication?: Resolver<ResolversTypes['Application'], ParentType, ContextType, RequireFields<MutationaddApplicationArgs, 'data'>>;
  addClient?: Resolver<ResolversTypes['Client'], ParentType, ContextType, RequireFields<MutationaddClientArgs, 'data'>>;
  addLogin?: Resolver<ResolversTypes['Login'], ParentType, ContextType, RequireFields<MutationaddLoginArgs, 'data'>>;
  addPermission?: Resolver<ResolversTypes['Permission'], ParentType, ContextType, RequireFields<MutationaddPermissionArgs, 'data'>>;
  addUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationaddUserArgs, 'data'>>;
  addUserPermission?: Resolver<ResolversTypes['UserPermission'], ParentType, ContextType, RequireFields<MutationaddUserPermissionArgs, 'data'>>;
  deleteApiResource?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationdeleteApiResourceArgs, 'key'>>;
  deleteApplication?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationdeleteApplicationArgs, 'key'>>;
  deleteClient?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationdeleteClientArgs, 'id'>>;
  deleteLogin?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationdeleteLoginArgs, 'id'>>;
  deletePermission?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationdeletePermissionArgs, 'id'>>;
  deleteUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationdeleteUserArgs, 'id'>>;
  deleteUserPermission?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationdeleteUserPermissionArgs, 'id'>>;
  updateApiResource?: Resolver<Maybe<ResolversTypes['ApiResource']>, ParentType, ContextType, RequireFields<MutationupdateApiResourceArgs, 'data' | 'key'>>;
  updateApplication?: Resolver<Maybe<ResolversTypes['Application']>, ParentType, ContextType, RequireFields<MutationupdateApplicationArgs, 'data' | 'key'>>;
  updateClient?: Resolver<Maybe<ResolversTypes['Client']>, ParentType, ContextType, RequireFields<MutationupdateClientArgs, 'data' | 'id'>>;
  updateLogin?: Resolver<ResolversTypes['Login'], ParentType, ContextType, RequireFields<MutationupdateLoginArgs, 'data' | 'id'>>;
  updatePermission?: Resolver<Maybe<ResolversTypes['Permission']>, ParentType, ContextType, RequireFields<MutationupdatePermissionArgs, 'data' | 'id'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationupdateUserArgs, 'data' | 'id'>>;
  updateUserPermission?: Resolver<Maybe<ResolversTypes['UserPermission']>, ParentType, ContextType, RequireFields<MutationupdateUserPermissionArgs, 'data' | 'id'>>;
}>;

export type PermissionResolvers<ContextType = NasAuthGraphQLContext, ParentType extends ResolversParentTypes['Permission'] = ResolversParentTypes['Permission']> = ResolversObject<{
  application?: Resolver<ResolversTypes['Application'], ParentType, ContextType>;
  displayName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['UserPermission']>, ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = NasAuthGraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  apiResource?: Resolver<Maybe<ResolversTypes['ApiResource']>, ParentType, ContextType, RequireFields<QueryapiResourceArgs, 'key'>>;
  apiResources?: Resolver<Array<ResolversTypes['ApiResource']>, ParentType, ContextType>;
  application?: Resolver<Maybe<ResolversTypes['Application']>, ParentType, ContextType, RequireFields<QueryapplicationArgs, 'key'>>;
  applications?: Resolver<Array<ResolversTypes['Application']>, ParentType, ContextType>;
  client?: Resolver<Maybe<ResolversTypes['Client']>, ParentType, ContextType, RequireFields<QueryclientArgs, 'id'>>;
  clients?: Resolver<Array<ResolversTypes['Client']>, ParentType, ContextType>;
  findLogin?: Resolver<Maybe<ResolversTypes['Login']>, ParentType, ContextType, RequireFields<QueryfindLoginArgs, 'loginId' | 'provider'>>;
  login?: Resolver<Maybe<ResolversTypes['Login']>, ParentType, ContextType, RequireFields<QueryloginArgs, 'id'>>;
  permissions?: Resolver<Array<ResolversTypes['Permission']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, Partial<QueryuserArgs>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = NasAuthGraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  disabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  familyName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  givenName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  logins?: Resolver<Array<ResolversTypes['Login']>, ParentType, ContextType>;
  permissions?: Resolver<Array<ResolversTypes['UserPermission']>, ParentType, ContextType>;
  profileImageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type UserPermissionResolvers<ContextType = NasAuthGraphQLContext, ParentType extends ResolversParentTypes['UserPermission'] = ResolversParentTypes['UserPermission']> = ResolversObject<{
  delete?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  permission?: Resolver<ResolversTypes['Permission'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  write?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
}>;

export type Resolvers<ContextType = NasAuthGraphQLContext> = ResolversObject<{
  ApiResource?: ApiResourceResolvers<ContextType>;
  ApiResourceAccessTokenFormat?: ApiResourceAccessTokenFormatResolvers;
  Application?: ApplicationResolvers<ContextType>;
  Client?: ClientResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  Login?: LoginResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Permission?: PermissionResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserPermission?: UserPermissionResolvers<ContextType>;
}>;

