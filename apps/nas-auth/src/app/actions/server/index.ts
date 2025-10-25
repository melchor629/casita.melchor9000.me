import { isSsrError, type PageLoaderContext } from '@melchor629/nice-ssr'
import addApiResourceAction from './add-api-resource-action'
import addApplicationAction from './add-application-action'
import addClientAction from './add-client-action'
import addPermissionAction from './add-permission-action'
import addUserAction from './add-user-action'
import addUserLoginAction from './add-user-login-action'
import addUserPermissionAction from './add-user-permission-action'
import editApiResourceAction from './edit-api-resource-action'
import editApplicationAction from './edit-application-action'
import editClientAction from './edit-client-action'
import editPermissionAction from './edit-permission-action'
import editUserAction from './edit-user-action'
import editUserLoginAction from './edit-user-login-action'
import editUserPermissionAction from './edit-user-permission-action'
import getSessionAction from './get-session-action'
import getUserProfilePicturesAction from './get-user-profile-pictures-action'
import { error, type FailableResult } from './helpers'
import removeApiResourceAction from './remove-api-resource-action'
import removeApplicationAction from './remove-application-action'
import removeClientAction from './remove-client-action'
import removePermissionAction from './remove-permission-action'
import removeUserAction from './remove-user-action'
import removeUserLoginAction from './remove-user-login-action'
import removeUserPermissionAction from './remove-user-permission-action'
import updateSessionUserAction from './update-session-user-action'
import uploadUserProfilePictureAction from './upload-user-profile-picture-action'

export const actions = Object.freeze({
  'add-api-resource': addApiResourceAction,
  'add-application': addApplicationAction,
  'add-client': addClientAction,
  'add-permission': addPermissionAction,
  'add-user': addUserAction,
  'add-user-login': addUserLoginAction,
  'add-user-permission': addUserPermissionAction,
  'edit-api-resource': editApiResourceAction,
  'edit-application': editApplicationAction,
  'edit-client': editClientAction,
  'edit-permission': editPermissionAction,
  'edit-user': editUserAction,
  'edit-user-login': editUserLoginAction,
  'edit-user-permission': editUserPermissionAction,
  'get-session': getSessionAction,
  'get-user-profile-pictures': getUserProfilePicturesAction,
  'remove-api-resource': removeApiResourceAction,
  'remove-application': removeApplicationAction,
  'remove-client': removeClientAction,
  'remove-permission': removePermissionAction,
  'remove-user': removeUserAction,
  'remove-user-login': removeUserLoginAction,
  'remove-user-permission': removeUserPermissionAction,
  'update-session-user': updateSessionUserAction,
  'upload-user-profile-picture': uploadUserProfilePictureAction,
} satisfies Record<string, (request: PageLoaderContext, ...args: never[]) => Promise<FailableResult<unknown>>>)

export type ActionParameters<T extends keyof typeof actions> =
  Parameters<(typeof actions)[T]> extends [PageLoaderContext, ...infer P]
    ? P
    : []

export type ActionReturnType<T extends keyof typeof actions> =
  Awaited<ReturnType<(typeof actions)[T]>> extends FailableResult<infer E> ? E : never

type ActionFunctionType<T extends keyof typeof actions> =
  (request: PageLoaderContext, ...args: unknown[]) => Promise<FailableResult<ActionReturnType<T>>>

export const runActionForLoader = async <T extends keyof typeof actions>(
  action: T,
  request: PageLoaderContext,
  ...args: ActionParameters<T>
): Promise<ActionReturnType<T>> => {
  if (action in actions) {
    const fn = actions[action] as ActionFunctionType<T>
    const [kind, value] = await fn(request, ...args)
    if (kind === 'k') {
      return value
    }
    if (kind === 'e') {
      throw new Error(value.message, { cause: value.cause })
    }
    if (kind === 'v') {
      throw new Error('The request is invalid according to the provided fields')
    }
  }

  throw new Error('Action not found')
}

export const runAction = async <T extends keyof typeof actions>(
  action: T,
  request: PageLoaderContext,
  ...args: ActionParameters<T>
): Promise<FailableResult<ActionReturnType<T>>> => {
  try {
    const fn = actions[action] as ActionFunctionType<T>
    return await fn(request, ...args)
  } catch (e) {
    if (isSsrError(e)) {
      throw e
    }

    if (e instanceof Error) {
      return error(e)
    }

    return error(new Error('Unhandled error', { cause: e }))
  }
}
