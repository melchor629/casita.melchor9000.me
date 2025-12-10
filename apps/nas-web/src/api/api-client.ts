import baseUrl from './base-url'
import {
  type BodyTypes,
  type HTTPResponse,
  type RequestOptions,
  sendRequest,
} from './client'

export class ApiClientException<T = unknown> extends Error {
  public readonly response: HTTPResponse
  public readonly parsedBody: T

  constructor(response: HTTPResponse, parsedBody: T) {
    super(`HTTP request failed with ${response.status} ${response.statusText}`)
    Object.assign(this, response) // TODO ??
    this.response = response
    this.parsedBody = parsedBody
  }

  public getError(): T {
    return this.parsedBody
  }
}

export interface ApiClient {
  get<T>(this: void, url: string, req?: Omit<RequestOptions, 'method'>): Promise<T>
  getRaw(this: void, url: string, type: 'blob', req?: Omit<RequestOptions, 'method'>): Promise<Blob>
  getRaw(this: void, url: string, type: 'text', req?: Omit<RequestOptions, 'method'>): Promise<string>
  getRaw(this: void, url: string, type: 'blob' | 'text', req?: Omit<RequestOptions, 'method'>): Promise<Blob | string>
  post<BT extends BodyTypes, RT>(this: void, url: string, body: BT, req?: Omit<RequestOptions, 'method'>): Promise<RT>
  del<RT>(this: void, url: string, req?: Omit<RequestOptions, 'method'>): Promise<RT>
  patch<BT extends BodyTypes, RT>(this: void, url: string, body: BT, req?: Omit<RequestOptions, 'method'>): Promise<RT>
  put<BT extends BodyTypes, RT>(this: void, url: string, body: BT, req?: Omit<RequestOptions, 'method'>): Promise<RT>
  getAccessToken(this: void): Promise<string | null>
}

const shouldRetry = (res: HTTPResponse) => res.status === 429

const retryWait = (res: HTTPResponse) => {
  const delay = parseInt(res.headers.get('retry-after') || '1', 10)
  return new Promise<void>((resolve) => {
    setTimeout(resolve, delay * 1000)
  })
}

const identifyExceptionAndThrow = async (res: HTTPResponse) => {
  if (!res.headers.get('Content-Type')?.toLowerCase()
    .includes('application/json')) {
    throw new ApiClientException(res, await res.text())
  }

  const parsedJson = await res.json() as object
  throw new ApiClientException(res, parsedJson)
}

const headersWithToken = async (request?: RequestOptionsWithToken): Promise<HeadersInit> => {
  const token = await request?.getToken?.()
  if (!token) {
    return request?.headers || {}
  }

  return {
    ...(request?.headers || {}),
    Authorization: `Bearer ${token}`,
  }
}

const requestOptionsWithToken = async (
  r?: RequestOptionsWithToken,
  method: RequestOptions['method'] = 'get',
): Promise<RequestOptions> => {
  if (r?.getToken) {
    return { ...r, headers: await headersWithToken(r), method }
  }

  return { ...(r || {}), method }
}

const getUrl = (url: string) => {
  if (url.startsWith('http')) {
    return url
  }

  if (url.startsWith('/')) {
    return `${baseUrl}${url.substring(1)}`
  }

  return `${baseUrl}${url}`
}

interface RequestOptionsWithToken extends Omit<RequestOptions, 'method'> {
  getToken?: () => Promise<string | null>
}

export async function get<T>(url: string, r?: RequestOptionsWithToken): Promise<T> {
  const res = await sendRequest(getUrl(url), await requestOptionsWithToken(r))
  if (res.ok) {
    return res.json() as T
  }

  if (shouldRetry(res)) {
    await retryWait(res)
    return get<T>(url, r)
  }

  return identifyExceptionAndThrow(res)
}

export async function getRaw(url: string, type: 'blob', r?: RequestOptionsWithToken): Promise<Blob>
export async function getRaw(url: string, type: 'text', r?: RequestOptionsWithToken): Promise<string>
export async function getRaw(url: string, type: 'blob' | 'text', r?: RequestOptionsWithToken): Promise<Blob | string>
export async function getRaw(url: string, type: 'blob' | 'text', r?: RequestOptionsWithToken): Promise<Blob | string> {
  const res = await sendRequest(getUrl(url), await requestOptionsWithToken(r))
  if (res.ok) {
    return type === 'blob' ? res.blob() : res.text()
  }

  if (shouldRetry(res)) {
    await retryWait(res)
    return getRaw(url, type, r)
  }

  return identifyExceptionAndThrow(res)
}

export async function post<BT extends BodyTypes, RT>(
  url: string,
  body: BT,
  r?: RequestOptionsWithToken,
): Promise<RT> {
  const res = await sendRequest<BT>(getUrl(url), body, await requestOptionsWithToken(r, 'post'))
  if (res.ok) {
    return res.json() as RT
  }

  if (shouldRetry(res)) {
    await retryWait(res)
    return post<BT, RT>(url, body, r)
  }

  return identifyExceptionAndThrow(res)
}

export async function del<RT>(url: string, r?: RequestOptionsWithToken): Promise<RT> {
  const res = await sendRequest(getUrl(url), await requestOptionsWithToken(r, 'delete'))
  if (res.ok) {
    return res.json() as RT
  }

  if (shouldRetry(res)) {
    await retryWait(res)
    return del<RT>(url, r)
  }

  return identifyExceptionAndThrow(res)
}

export async function patch<BT extends BodyTypes, RT>(
  url: string,
  body: BT,
  r?: RequestOptionsWithToken,
): Promise<RT> {
  const res = await sendRequest<BT>(getUrl(url), body, await requestOptionsWithToken(r, 'patch'))
  if (res.ok) {
    return res.json() as RT
  }

  if (shouldRetry(res)) {
    await retryWait(res)
    return patch<BT, RT>(url, body, r)
  }

  return identifyExceptionAndThrow(res)
}

export async function put<BT extends BodyTypes, RT>(
  url: string,
  body: BT,
  r?: RequestOptionsWithToken,
): Promise<RT> {
  const res = await sendRequest<BT>(getUrl(url), body, await requestOptionsWithToken(r, 'put'))
  if (res.ok) {
    return res.json() as RT
  }

  if (shouldRetry(res)) {
    await retryWait(res)
    return put<BT, RT>(url, body, r)
  }

  return identifyExceptionAndThrow(res)
}
