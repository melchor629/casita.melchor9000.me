const ssrRawBodySymbol = Symbol.for('ssr:rawBody')
const textStatusToNumber = Object.freeze({
  ok: 200,
  'moved-permanently': 301,
  'temporary-redirect': 307,
  'permanent-redirect': 308,
  'bad-request': 400,
  unauthorized: 401,
  forbidden: 403,
  'not-found': 404,
  'method-not-allowed': 405,
  teapot: 418,
  'internal-server-error': 500,
})

export class SsrResponse extends Response {
  /**
   * Creates a new response builder.
   * @param init Request initialization options
   * @returns Response builder
   */
  static new(init?: Omit<ResponseInit, 'body'>) {
    const headers = new Headers(init?.headers)
    let status = init?.status ?? 200
    return Object.freeze({
      /**
       * Changes the status code of this request for the one provided by value.
       * If using a string, it will be converted to the corresponding number.
       * @param st HTTP Status code number or string.
       */
      status(st: number | keyof typeof textStatusToNumber) {
        status = typeof st === 'number' ? st : textStatusToNumber[st]
        return this
      },

      /**
       * Sets one or more values to the header. Previous values will be removed.
       * @param name Header name.
       * @param value Header value or values.
       */
      header(name: string, value: string | string[]) {
        if (typeof value === 'string') {
          headers.set(name, value)
        } else {
          headers.delete(name)
          value.forEach((value) => headers.append(name, value))
        }
        return this
      },

      /**
       * Creates the response with text as body. The string will be encoded
       * using `utf-8`.
       * @param text The text to return in the body.
       * @param encoding String encoding.
       */
      text(text: string | Buffer, encoding = 'utf-8') {
        headers.set('content-type', `text/plain; charset=${encoding}`)
        return new SsrResponse(text, { ...init, headers, status })
      },

      /**
       * Creates the response with the object provided as body. It will serialize
       * the response as JSON using `utf-8` encoding.
       * @param value JSON value to return in the body.
       */
      json(value: unknown) {
        headers.set('content-type', 'application/json; charset=utf-8')
        return new SsrResponse(value, { ...init, headers, status })
      },

      /**
       * Creates the response using the provided stream as body to send.
       * @param stream Stream to send to send as response.
       */
      stream(stream: ReadableStream | import('node:stream').Readable) {
        if (!headers.has('content-type')) {
          headers.set('content-type', 'application/octet-stream')
        }
        return new SsrResponse(stream, { ...init, headers, status })
      },

      /**
       * Creates a response without body.
       */
      empty() {
        return new SsrResponse(undefined, { ...init, headers, status })
      },

      /**
       * Creates a response with the provided redirection and empty body. There are
       * three types of redirections:
       *
       * - `'moved'`: the resource is in another place permanently but not keep request (see [301](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/301))
       * - `'temporary'`: go to another resource for now (see [307](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/307))
       * - `'permanent'`: the resource is in another place permanently and keep request (see [308](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/308))
       *
       * By default uses `'temporary'` redirect.
       * @param to URL or relative path to redirect to.
       * @param type Type of redirection.
       */
      redirect(to: `/${string}` | URL, type: 'moved' | 'temporary' | 'permanent' = 'temporary') {
        headers.set('Location', to.toString())
        if (type === 'moved') {
          status = textStatusToNumber['moved-permanently']
        } else if (type === 'permanent') {
          status = textStatusToNumber['permanent-redirect']
        } else {
          status = textStatusToNumber['temporary-redirect']
        }
        return new SsrResponse(undefined, { ...init, headers, status })
      },
    })
  }

  /**
   * Use in the middleware to notify that the request can continue. Any headers set in
   * the response will be used for the final response.
   * @param init Response initialization object.
   * @returns Response for continuing request.
   */
  static next(init?: Omit<ResponseInit, 'body' | 'status'>) {
    return new SsrResponse(ssrRawBodySymbol, { ...init, status: 599 })
  }

  readonly [ssrRawBodySymbol]: unknown

  constructor(body?: unknown, init?: ResponseInit) {
    super(null, init)
    this[ssrRawBodySymbol] = body
  }

  isNextResponse() {
    return this.status === 599 && this[ssrRawBodySymbol] === ssrRawBodySymbol
  }
}

export const isSsrResponse = (response: Response): response is SsrResponse =>
  response instanceof SsrResponse || ssrRawBodySymbol in response

export const extractBodyFromSsrResponse = (response: SsrResponse) =>
  response[ssrRawBodySymbol]
