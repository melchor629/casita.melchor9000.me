/* eslint-disable */
import * as types from './graphql.ts';



/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  mutation addApiResource($data: CreateApiResourceInput!) {\n    addApiResource(data: $data) {\n      accessTokenFormat\n      accessTokenTTL\n      audience\n      jwt\n      key\n      name\n      scopes\n    }\n  }\n": typeof types.AddApiResourceDocument,
    "\n  mutation addApplication($data: CreateApplicationInput!) {\n    addApplication(data: $data) {\n      key\n      name\n    }\n  }\n": typeof types.AddApplicationDocument,
    "\n  mutation addClient($data: CreateClientInput!) {\n    addClient(data: $data) {\n      clientId\n      clientName\n      fields\n    }\n  }\n": typeof types.AddClientDocument,
    "\n  mutation createLoginAndUpdateUser(\n    $data: JSONObject,\n    $loginId: String!,\n    $provider: String!,\n    $user: UpdateUserInput!,\n    $userId: Int!,\n  ) {\n    addLogin(data: { data: $data, loginId: $loginId, type: $provider, userId: $userId }) {\n      id\n    }\n\n    updateUser(data: $user, id: $userId) {\n      id\n    }\n  }\n": typeof types.CreateLoginAndUpdateUserDocument,
    "\n  mutation createLogin($login: CreateLoginInput!) {\n    addLogin(data: $login) {\n      id\n    }\n  }\n": typeof types.CreateLoginDocument,
    "\n  mutation addPermission($data: CreatePermissionInput!) {\n    addPermission(data: $data) {\n      id\n      name\n      displayName\n    }\n  }\n": typeof types.AddPermissionDocument,
    "\n  mutation createUserPermission($userPermission: CreateUserPermissionInput!) {\n    addUserPermission(data: $userPermission) {\n      id\n      write\n      delete\n      permission {\n        id\n        name\n        application {\n          key\n        }\n      }\n    }\n  }\n": typeof types.CreateUserPermissionDocument,
    "\n  mutation createUser($user: CreateUserInput!) {\n    addUser(data: $user) {\n      id\n      userName\n    }\n  }\n": typeof types.CreateUserDocument,
    "\n  mutation deleteApiResource($key: String!) {\n    deleteApiResource(key: $key)\n  }\n": typeof types.DeleteApiResourceDocument,
    "\n  mutation deleteApplication($key: String!) {\n    deleteApplication(key: $key)\n  }\n": typeof types.DeleteApplicationDocument,
    "\n  mutation deleteClient($clientId: String!) {\n    deleteClient(id: $clientId)\n  }\n": typeof types.DeleteClientDocument,
    "\n  mutation deleteLogin($loginId: Int!) {\n    deleteLogin(id: $loginId)\n  }\n": typeof types.DeleteLoginDocument,
    "\n  mutation deletePermission($permissionId: Int!) {\n    deletePermission(id: $permissionId)\n  }\n": typeof types.DeletePermissionDocument,
    "\n  mutation deleteUserPermission($userPermissionId: Int!) {\n    deleteUserPermission(id: $userPermissionId)\n  }\n": typeof types.DeleteUserPermissionDocument,
    "\n  mutation deleteUser($userId: Int!) {\n    deleteUser(id: $userId)\n  }\n": typeof types.DeleteUserDocument,
    "\n  query findLoginInfoForExternalAuth(\n    $provider: String!,\n    $loginId: String!,\n    $displayName: String!,\n    $emails: [String!]!,\n    $userName: String!,\n  ) {\n    findLogin(provider: $provider, loginId: $loginId) {\n      id\n      disabled\n      user {\n        id\n        userName\n      }\n    }\n\n    user(displayName: $displayName, emails: $emails, userName: $userName) {\n      id\n      userName\n      displayName\n      givenName\n      familyName\n      profileImageUrl\n      email\n      disabled\n    }\n  }\n": typeof types.FindLoginInfoForExternalAuthDocument,
    "\n  query findLoginInfoForUsernameAndPassword($loginId: String!, $userId: ID!) {\n    findLogin(provider: \"local\", loginId: $loginId, userId: $userId) {\n      id\n      user {\n        userName\n      }\n    }\n  }\n": typeof types.FindLoginInfoForUsernameAndPasswordDocument,
    "\n  query apiResource($key: String!) {\n    apiResource(key: $key) {\n      scopes\n      audience\n      accessTokenFormat\n      accessTokenTTL\n      jwt\n    }\n  }\n": typeof types.ApiResourceDocument,
    "\n  query apiResources {\n    apiResources {\n      key\n      name\n      audience\n    }\n  }\n": typeof types.ApiResourcesDocument,
    "\n  query getApplication($key: String!) {\n    application(key: $key) {\n      key\n      name\n      permissions {\n        id\n        name\n        displayName\n      }\n      apiResources {\n        key\n        name\n        scopes\n        audience\n        accessTokenFormat\n        accessTokenTTL\n        jwt\n      }\n    }\n  }\n": typeof types.GetApplicationDocument,
    "\n  query getApplications {\n    applications {\n      key\n      name\n    }\n  }\n": typeof types.GetApplicationsDocument,
    "\n  query getClient($id: String!) {\n    client(id: $id) {\n      clientId\n      clientName\n      fields\n    }\n  }\n": typeof types.GetClientDocument,
    "\n  query getClients {\n    clients {\n      clientId\n      clientName\n    }\n  }\n": typeof types.GetClientsDocument,
    "\n  query getPermissionsForUser($userName: String!) {\n    user(userName: $userName) {\n      permissions {\n        write\n        delete\n        permission {\n          name\n          displayName\n          application {\n            key\n            name\n          }\n        }\n      }\n    }\n  }\n": typeof types.GetPermissionsForUserDocument,
    "\n  query getPermissions {\n    permissions {\n      id\n      name\n      displayName\n      application {\n        key\n        name\n      }\n    }\n  }\n": typeof types.GetPermissionsDocument,
    "\n  query getUserByUserName($userName: String!) {\n    user(userName: $userName) {\n      id\n      userName\n      displayName\n      givenName\n      familyName\n      email\n      profileImageUrl\n      disabled\n      permissions {\n        id\n        write\n        delete\n        permission { id, name, application { key } }\n      }\n      logins { id, type, loginId, data, disabled }\n    }\n  }\n": typeof types.GetUserByUserNameDocument,
    "\n  query getUserById($id: Int!) {\n    user(id: $id) {\n      id\n      userName\n      displayName\n      givenName\n      familyName\n      email\n      profileImageUrl\n      disabled\n      permissions {\n        id\n        write\n        delete\n        permission { id, name, application { key } }\n      }\n      logins { id, type, loginId, data, disabled }\n    }\n  }\n": typeof types.GetUserByIdDocument,
    "\n  query getUsers {\n    users {\n      id\n      userName\n      displayName\n      givenName\n      familyName\n      email\n      profileImageUrl\n    }\n  }\n": typeof types.GetUsersDocument,
    "\n  mutation updateApiResource($key: String!, $data: UpdateApiResourceInput!) {\n    updateApiResource(key: $key, data: $data) {\n      accessTokenFormat\n      accessTokenTTL\n      audience\n      jwt\n      key\n      name\n      scopes\n    }\n  }\n": typeof types.UpdateApiResourceDocument,
    "\n  mutation updateApplication($key: String!, $data: UpdateApplicationInput!) {\n    updateApplication(key: $key, data: $data) {\n      key\n      name\n    }\n  }\n": typeof types.UpdateApplicationDocument,
    "\n  mutation updateClient($id: String!, $data: UpdateClientInput!) {\n    updateClient(id: $id, data: $data) {\n      clientId\n      clientName\n      fields\n    }\n  }\n": typeof types.UpdateClientDocument,
    "\n  mutation updateLoginData($data: String!, $loginId: Int!) {\n    updateLogin(data: { data: $data }, id: $loginId) {\n      id\n    }\n  }\n": typeof types.UpdateLoginDataDocument,
    "\n  mutation updateLogin($loginId: Int!, $data: UpdateLoginInput!) {\n    updateLogin(data: $data, id: $loginId) {\n      id\n    }\n  }\n": typeof types.UpdateLoginDocument,
    "\n  mutation updatePermission($id: Int!, $data: UpdatePermissionInput!) {\n    updatePermission(id: $id, data: $data) {\n      id\n      name\n      displayName\n    }\n  }\n": typeof types.UpdatePermissionDocument,
    "\n  mutation updateUserPermission($id: Int!, $userPermission: EditUserPermissionInput!) {\n    updateUserPermission(id: $id, data: $userPermission) {\n      id\n      write\n      delete\n      permission {\n        id\n        name\n        application {\n          name\n        }\n      }\n    }\n  }\n": typeof types.UpdateUserPermissionDocument,
    "\n  mutation updateUser($user: UpdateUserInput!, $userId: Int!) {\n    updateUser(data: $user, id: $userId) {\n      id\n      userName\n      displayName\n      givenName\n      familyName\n      email\n      profileImageUrl\n      disabled\n    }\n  }\n": typeof types.UpdateUserDocument,
};
const documents: Documents = {
    "\n  mutation addApiResource($data: CreateApiResourceInput!) {\n    addApiResource(data: $data) {\n      accessTokenFormat\n      accessTokenTTL\n      audience\n      jwt\n      key\n      name\n      scopes\n    }\n  }\n": types.AddApiResourceDocument,
    "\n  mutation addApplication($data: CreateApplicationInput!) {\n    addApplication(data: $data) {\n      key\n      name\n    }\n  }\n": types.AddApplicationDocument,
    "\n  mutation addClient($data: CreateClientInput!) {\n    addClient(data: $data) {\n      clientId\n      clientName\n      fields\n    }\n  }\n": types.AddClientDocument,
    "\n  mutation createLoginAndUpdateUser(\n    $data: JSONObject,\n    $loginId: String!,\n    $provider: String!,\n    $user: UpdateUserInput!,\n    $userId: Int!,\n  ) {\n    addLogin(data: { data: $data, loginId: $loginId, type: $provider, userId: $userId }) {\n      id\n    }\n\n    updateUser(data: $user, id: $userId) {\n      id\n    }\n  }\n": types.CreateLoginAndUpdateUserDocument,
    "\n  mutation createLogin($login: CreateLoginInput!) {\n    addLogin(data: $login) {\n      id\n    }\n  }\n": types.CreateLoginDocument,
    "\n  mutation addPermission($data: CreatePermissionInput!) {\n    addPermission(data: $data) {\n      id\n      name\n      displayName\n    }\n  }\n": types.AddPermissionDocument,
    "\n  mutation createUserPermission($userPermission: CreateUserPermissionInput!) {\n    addUserPermission(data: $userPermission) {\n      id\n      write\n      delete\n      permission {\n        id\n        name\n        application {\n          key\n        }\n      }\n    }\n  }\n": types.CreateUserPermissionDocument,
    "\n  mutation createUser($user: CreateUserInput!) {\n    addUser(data: $user) {\n      id\n      userName\n    }\n  }\n": types.CreateUserDocument,
    "\n  mutation deleteApiResource($key: String!) {\n    deleteApiResource(key: $key)\n  }\n": types.DeleteApiResourceDocument,
    "\n  mutation deleteApplication($key: String!) {\n    deleteApplication(key: $key)\n  }\n": types.DeleteApplicationDocument,
    "\n  mutation deleteClient($clientId: String!) {\n    deleteClient(id: $clientId)\n  }\n": types.DeleteClientDocument,
    "\n  mutation deleteLogin($loginId: Int!) {\n    deleteLogin(id: $loginId)\n  }\n": types.DeleteLoginDocument,
    "\n  mutation deletePermission($permissionId: Int!) {\n    deletePermission(id: $permissionId)\n  }\n": types.DeletePermissionDocument,
    "\n  mutation deleteUserPermission($userPermissionId: Int!) {\n    deleteUserPermission(id: $userPermissionId)\n  }\n": types.DeleteUserPermissionDocument,
    "\n  mutation deleteUser($userId: Int!) {\n    deleteUser(id: $userId)\n  }\n": types.DeleteUserDocument,
    "\n  query findLoginInfoForExternalAuth(\n    $provider: String!,\n    $loginId: String!,\n    $displayName: String!,\n    $emails: [String!]!,\n    $userName: String!,\n  ) {\n    findLogin(provider: $provider, loginId: $loginId) {\n      id\n      disabled\n      user {\n        id\n        userName\n      }\n    }\n\n    user(displayName: $displayName, emails: $emails, userName: $userName) {\n      id\n      userName\n      displayName\n      givenName\n      familyName\n      profileImageUrl\n      email\n      disabled\n    }\n  }\n": types.FindLoginInfoForExternalAuthDocument,
    "\n  query findLoginInfoForUsernameAndPassword($loginId: String!, $userId: ID!) {\n    findLogin(provider: \"local\", loginId: $loginId, userId: $userId) {\n      id\n      user {\n        userName\n      }\n    }\n  }\n": types.FindLoginInfoForUsernameAndPasswordDocument,
    "\n  query apiResource($key: String!) {\n    apiResource(key: $key) {\n      scopes\n      audience\n      accessTokenFormat\n      accessTokenTTL\n      jwt\n    }\n  }\n": types.ApiResourceDocument,
    "\n  query apiResources {\n    apiResources {\n      key\n      name\n      audience\n    }\n  }\n": types.ApiResourcesDocument,
    "\n  query getApplication($key: String!) {\n    application(key: $key) {\n      key\n      name\n      permissions {\n        id\n        name\n        displayName\n      }\n      apiResources {\n        key\n        name\n        scopes\n        audience\n        accessTokenFormat\n        accessTokenTTL\n        jwt\n      }\n    }\n  }\n": types.GetApplicationDocument,
    "\n  query getApplications {\n    applications {\n      key\n      name\n    }\n  }\n": types.GetApplicationsDocument,
    "\n  query getClient($id: String!) {\n    client(id: $id) {\n      clientId\n      clientName\n      fields\n    }\n  }\n": types.GetClientDocument,
    "\n  query getClients {\n    clients {\n      clientId\n      clientName\n    }\n  }\n": types.GetClientsDocument,
    "\n  query getPermissionsForUser($userName: String!) {\n    user(userName: $userName) {\n      permissions {\n        write\n        delete\n        permission {\n          name\n          displayName\n          application {\n            key\n            name\n          }\n        }\n      }\n    }\n  }\n": types.GetPermissionsForUserDocument,
    "\n  query getPermissions {\n    permissions {\n      id\n      name\n      displayName\n      application {\n        key\n        name\n      }\n    }\n  }\n": types.GetPermissionsDocument,
    "\n  query getUserByUserName($userName: String!) {\n    user(userName: $userName) {\n      id\n      userName\n      displayName\n      givenName\n      familyName\n      email\n      profileImageUrl\n      disabled\n      permissions {\n        id\n        write\n        delete\n        permission { id, name, application { key } }\n      }\n      logins { id, type, loginId, data, disabled }\n    }\n  }\n": types.GetUserByUserNameDocument,
    "\n  query getUserById($id: Int!) {\n    user(id: $id) {\n      id\n      userName\n      displayName\n      givenName\n      familyName\n      email\n      profileImageUrl\n      disabled\n      permissions {\n        id\n        write\n        delete\n        permission { id, name, application { key } }\n      }\n      logins { id, type, loginId, data, disabled }\n    }\n  }\n": types.GetUserByIdDocument,
    "\n  query getUsers {\n    users {\n      id\n      userName\n      displayName\n      givenName\n      familyName\n      email\n      profileImageUrl\n    }\n  }\n": types.GetUsersDocument,
    "\n  mutation updateApiResource($key: String!, $data: UpdateApiResourceInput!) {\n    updateApiResource(key: $key, data: $data) {\n      accessTokenFormat\n      accessTokenTTL\n      audience\n      jwt\n      key\n      name\n      scopes\n    }\n  }\n": types.UpdateApiResourceDocument,
    "\n  mutation updateApplication($key: String!, $data: UpdateApplicationInput!) {\n    updateApplication(key: $key, data: $data) {\n      key\n      name\n    }\n  }\n": types.UpdateApplicationDocument,
    "\n  mutation updateClient($id: String!, $data: UpdateClientInput!) {\n    updateClient(id: $id, data: $data) {\n      clientId\n      clientName\n      fields\n    }\n  }\n": types.UpdateClientDocument,
    "\n  mutation updateLoginData($data: String!, $loginId: Int!) {\n    updateLogin(data: { data: $data }, id: $loginId) {\n      id\n    }\n  }\n": types.UpdateLoginDataDocument,
    "\n  mutation updateLogin($loginId: Int!, $data: UpdateLoginInput!) {\n    updateLogin(data: $data, id: $loginId) {\n      id\n    }\n  }\n": types.UpdateLoginDocument,
    "\n  mutation updatePermission($id: Int!, $data: UpdatePermissionInput!) {\n    updatePermission(id: $id, data: $data) {\n      id\n      name\n      displayName\n    }\n  }\n": types.UpdatePermissionDocument,
    "\n  mutation updateUserPermission($id: Int!, $userPermission: EditUserPermissionInput!) {\n    updateUserPermission(id: $id, data: $userPermission) {\n      id\n      write\n      delete\n      permission {\n        id\n        name\n        application {\n          name\n        }\n      }\n    }\n  }\n": types.UpdateUserPermissionDocument,
    "\n  mutation updateUser($user: UpdateUserInput!, $userId: Int!) {\n    updateUser(data: $user, id: $userId) {\n      id\n      userName\n      displayName\n      givenName\n      familyName\n      email\n      profileImageUrl\n      disabled\n    }\n  }\n": types.UpdateUserDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation addApiResource($data: CreateApiResourceInput!) {\n    addApiResource(data: $data) {\n      accessTokenFormat\n      accessTokenTTL\n      audience\n      jwt\n      key\n      name\n      scopes\n    }\n  }\n"): typeof import('./graphql.js').AddApiResourceDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation addApplication($data: CreateApplicationInput!) {\n    addApplication(data: $data) {\n      key\n      name\n    }\n  }\n"): typeof import('./graphql.js').AddApplicationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation addClient($data: CreateClientInput!) {\n    addClient(data: $data) {\n      clientId\n      clientName\n      fields\n    }\n  }\n"): typeof import('./graphql.js').AddClientDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createLoginAndUpdateUser(\n    $data: JSONObject,\n    $loginId: String!,\n    $provider: String!,\n    $user: UpdateUserInput!,\n    $userId: Int!,\n  ) {\n    addLogin(data: { data: $data, loginId: $loginId, type: $provider, userId: $userId }) {\n      id\n    }\n\n    updateUser(data: $user, id: $userId) {\n      id\n    }\n  }\n"): typeof import('./graphql.js').CreateLoginAndUpdateUserDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createLogin($login: CreateLoginInput!) {\n    addLogin(data: $login) {\n      id\n    }\n  }\n"): typeof import('./graphql.js').CreateLoginDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation addPermission($data: CreatePermissionInput!) {\n    addPermission(data: $data) {\n      id\n      name\n      displayName\n    }\n  }\n"): typeof import('./graphql.js').AddPermissionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createUserPermission($userPermission: CreateUserPermissionInput!) {\n    addUserPermission(data: $userPermission) {\n      id\n      write\n      delete\n      permission {\n        id\n        name\n        application {\n          key\n        }\n      }\n    }\n  }\n"): typeof import('./graphql.js').CreateUserPermissionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createUser($user: CreateUserInput!) {\n    addUser(data: $user) {\n      id\n      userName\n    }\n  }\n"): typeof import('./graphql.js').CreateUserDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteApiResource($key: String!) {\n    deleteApiResource(key: $key)\n  }\n"): typeof import('./graphql.js').DeleteApiResourceDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteApplication($key: String!) {\n    deleteApplication(key: $key)\n  }\n"): typeof import('./graphql.js').DeleteApplicationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteClient($clientId: String!) {\n    deleteClient(id: $clientId)\n  }\n"): typeof import('./graphql.js').DeleteClientDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteLogin($loginId: Int!) {\n    deleteLogin(id: $loginId)\n  }\n"): typeof import('./graphql.js').DeleteLoginDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deletePermission($permissionId: Int!) {\n    deletePermission(id: $permissionId)\n  }\n"): typeof import('./graphql.js').DeletePermissionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteUserPermission($userPermissionId: Int!) {\n    deleteUserPermission(id: $userPermissionId)\n  }\n"): typeof import('./graphql.js').DeleteUserPermissionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteUser($userId: Int!) {\n    deleteUser(id: $userId)\n  }\n"): typeof import('./graphql.js').DeleteUserDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query findLoginInfoForExternalAuth(\n    $provider: String!,\n    $loginId: String!,\n    $displayName: String!,\n    $emails: [String!]!,\n    $userName: String!,\n  ) {\n    findLogin(provider: $provider, loginId: $loginId) {\n      id\n      disabled\n      user {\n        id\n        userName\n      }\n    }\n\n    user(displayName: $displayName, emails: $emails, userName: $userName) {\n      id\n      userName\n      displayName\n      givenName\n      familyName\n      profileImageUrl\n      email\n      disabled\n    }\n  }\n"): typeof import('./graphql.js').FindLoginInfoForExternalAuthDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query findLoginInfoForUsernameAndPassword($loginId: String!, $userId: ID!) {\n    findLogin(provider: \"local\", loginId: $loginId, userId: $userId) {\n      id\n      user {\n        userName\n      }\n    }\n  }\n"): typeof import('./graphql.js').FindLoginInfoForUsernameAndPasswordDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query apiResource($key: String!) {\n    apiResource(key: $key) {\n      scopes\n      audience\n      accessTokenFormat\n      accessTokenTTL\n      jwt\n    }\n  }\n"): typeof import('./graphql.js').ApiResourceDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query apiResources {\n    apiResources {\n      key\n      name\n      audience\n    }\n  }\n"): typeof import('./graphql.js').ApiResourcesDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getApplication($key: String!) {\n    application(key: $key) {\n      key\n      name\n      permissions {\n        id\n        name\n        displayName\n      }\n      apiResources {\n        key\n        name\n        scopes\n        audience\n        accessTokenFormat\n        accessTokenTTL\n        jwt\n      }\n    }\n  }\n"): typeof import('./graphql.js').GetApplicationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getApplications {\n    applications {\n      key\n      name\n    }\n  }\n"): typeof import('./graphql.js').GetApplicationsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getClient($id: String!) {\n    client(id: $id) {\n      clientId\n      clientName\n      fields\n    }\n  }\n"): typeof import('./graphql.js').GetClientDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getClients {\n    clients {\n      clientId\n      clientName\n    }\n  }\n"): typeof import('./graphql.js').GetClientsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getPermissionsForUser($userName: String!) {\n    user(userName: $userName) {\n      permissions {\n        write\n        delete\n        permission {\n          name\n          displayName\n          application {\n            key\n            name\n          }\n        }\n      }\n    }\n  }\n"): typeof import('./graphql.js').GetPermissionsForUserDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getPermissions {\n    permissions {\n      id\n      name\n      displayName\n      application {\n        key\n        name\n      }\n    }\n  }\n"): typeof import('./graphql.js').GetPermissionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getUserByUserName($userName: String!) {\n    user(userName: $userName) {\n      id\n      userName\n      displayName\n      givenName\n      familyName\n      email\n      profileImageUrl\n      disabled\n      permissions {\n        id\n        write\n        delete\n        permission { id, name, application { key } }\n      }\n      logins { id, type, loginId, data, disabled }\n    }\n  }\n"): typeof import('./graphql.js').GetUserByUserNameDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getUserById($id: Int!) {\n    user(id: $id) {\n      id\n      userName\n      displayName\n      givenName\n      familyName\n      email\n      profileImageUrl\n      disabled\n      permissions {\n        id\n        write\n        delete\n        permission { id, name, application { key } }\n      }\n      logins { id, type, loginId, data, disabled }\n    }\n  }\n"): typeof import('./graphql.js').GetUserByIdDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getUsers {\n    users {\n      id\n      userName\n      displayName\n      givenName\n      familyName\n      email\n      profileImageUrl\n    }\n  }\n"): typeof import('./graphql.js').GetUsersDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateApiResource($key: String!, $data: UpdateApiResourceInput!) {\n    updateApiResource(key: $key, data: $data) {\n      accessTokenFormat\n      accessTokenTTL\n      audience\n      jwt\n      key\n      name\n      scopes\n    }\n  }\n"): typeof import('./graphql.js').UpdateApiResourceDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateApplication($key: String!, $data: UpdateApplicationInput!) {\n    updateApplication(key: $key, data: $data) {\n      key\n      name\n    }\n  }\n"): typeof import('./graphql.js').UpdateApplicationDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateClient($id: String!, $data: UpdateClientInput!) {\n    updateClient(id: $id, data: $data) {\n      clientId\n      clientName\n      fields\n    }\n  }\n"): typeof import('./graphql.js').UpdateClientDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateLoginData($data: String!, $loginId: Int!) {\n    updateLogin(data: { data: $data }, id: $loginId) {\n      id\n    }\n  }\n"): typeof import('./graphql.js').UpdateLoginDataDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateLogin($loginId: Int!, $data: UpdateLoginInput!) {\n    updateLogin(data: $data, id: $loginId) {\n      id\n    }\n  }\n"): typeof import('./graphql.js').UpdateLoginDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updatePermission($id: Int!, $data: UpdatePermissionInput!) {\n    updatePermission(id: $id, data: $data) {\n      id\n      name\n      displayName\n    }\n  }\n"): typeof import('./graphql.js').UpdatePermissionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateUserPermission($id: Int!, $userPermission: EditUserPermissionInput!) {\n    updateUserPermission(id: $id, data: $userPermission) {\n      id\n      write\n      delete\n      permission {\n        id\n        name\n        application {\n          name\n        }\n      }\n    }\n  }\n"): typeof import('./graphql.js').UpdateUserPermissionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateUser($user: UpdateUserInput!, $userId: Int!) {\n    updateUser(data: $user, id: $userId) {\n      id\n      userName\n      displayName\n      givenName\n      familyName\n      email\n      profileImageUrl\n      disabled\n    }\n  }\n"): typeof import('./graphql.js').UpdateUserDocument;


export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
