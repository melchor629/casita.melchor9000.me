export type QueryMap = { [index: string]: string | string[] | undefined } | URLSearchParams
export type BodyTypes =
  | ArrayBuffer
  | Blob
  | FormData
  | URLSearchParams
  | string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Record<string, any>
  | readonly unknown[]

export interface RequestOptions extends Omit<RequestInit, 'body' | 'method'> {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  query?: QueryMap
}

export type HTTPResponse = Response

const queryMapToUrlencodeString = (q: QueryMap): URLSearchParams => {
  if (q instanceof URLSearchParams) {
    return q
  }

  const p = new URLSearchParams()
  for (const [key, value] of Object.entries(q)) {
    if (Array.isArray(value)) {
      value.forEach((val) => p.append(key, val))
    } else if (typeof value === 'string') {
      p.append(key, value)
    }
  }

  return p
}

const prepareRequest = (r: RequestOptions | undefined, body?: BodyTypes): RequestInit => {
  const opts: RequestInit = r ?? ({})
  opts.method = r ? r.method : 'get'
  if (body !== undefined) {
    if (
      body instanceof ArrayBuffer
            || body instanceof Blob
            || body instanceof FormData
            || body instanceof URLSearchParams
            || typeof body === 'string'
    ) {
      opts.body = body
    } else if (Array.isArray(body) || typeof body === 'object') {
      opts.body = JSON.stringify(body)
      const jsonMime = 'application/json; charset=utf-8'
      if (Array.isArray(opts.headers)) {
        const i = opts.headers.findIndex(([key]) => key.toLowerCase() === 'content-type')
        if (i !== -1) {
          opts.headers[i] = ['Content-Type', jsonMime]
        } else {
          opts.headers.push(['Content-Type', jsonMime])
        }
      } else if (opts.headers instanceof Headers) {
        opts.headers.set('Content-Type', jsonMime)
      } else if (opts.headers !== undefined) {
        opts.headers['Content-Type'] = jsonMime
      } else {
        opts.headers = { 'Content-Type': jsonMime }
      }
    } else {
      throw new TypeError('Unexpected object type in body')
    }
  }

  return opts
}

export function sendRequest(url: string): Promise<HTTPResponse>
export function sendRequest(url: string, req: Partial<RequestOptions>): Promise<HTTPResponse>
export function sendRequest<BT extends BodyTypes>(
  url: string,
  body: BT,
  req: RequestOptions,
): Promise<HTTPResponse>

export async function sendRequest<BT extends BodyTypes>(
  url: string,
  bodyOrReq?: BT | Partial<RequestOptions>,
  reqOpt?: RequestOptions,
) {
  const body = reqOpt !== undefined ? bodyOrReq as BT : undefined
  const req = reqOpt !== undefined ? reqOpt : bodyOrReq as RequestOptions | undefined
  const finalRequest = body ? prepareRequest(req, body) : req

  if (finalRequest) {
    finalRequest.method = finalRequest?.method?.toUpperCase()
  }

  let query = ''
  if (req && req.query) {
    query = queryMapToUrlencodeString(req.query).toString()
    if (query) {
      query = `?${query}`
    }
  }

  const res = await fetch(`${url}${query}`, finalRequest)
  return res
}
