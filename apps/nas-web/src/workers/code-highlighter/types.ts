export interface CodeHighlightRequest {
  reqId: string
  code: string
  lang?: string
}

interface CodeHighlightOkResponse {
  reqId: string
  success: true
  result: {
    language?: string
    relevance: number
    value: string
    secondBest?: {
      language?: string
      relevance: number
      value: string
    }
  }
}

interface CodeHighlightErrorResponse {
  reqId: string
  success: false
  error: object
}

export type CodeHighlightResponse = CodeHighlightOkResponse | CodeHighlightErrorResponse
