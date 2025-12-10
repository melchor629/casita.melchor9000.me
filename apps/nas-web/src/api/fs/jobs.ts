interface JobCreationRequest<DataType> {
  name: string
  params: DataType
}

export interface JobCreatedResponse {
  jobId: string
}

interface JobDetails<DataType, ReturnValueType = undefined> {
  attemptsMade: number
  data: DataType
  failedReason: string
  finishedOn?: number
  id: string
  name: string
  opts: unknown
  processedOn?: number
  progress: number
  stackTrace?: string
  returnValue: ReturnValueType
  timestamp: number
  state: 'active' | 'delayed' | 'completed' | 'failed' | 'waiting' | 'unknown'
}

interface GenerateThumbnailArguments {
  path: string
  generateThumbnails?: {
    sizes: Array<'xsm' | 'sm' | 'md' | 'lg' | 'xlg'>
    formats: Array<'jpg' | 'webp' | 'png' | 'avif'>
  }
}

export type GenerateThumbnailRequest = JobCreationRequest<GenerateThumbnailArguments>

export type GenerateThumbnailJobDetails = JobDetails<GenerateThumbnailArguments>

interface SynchronizeArguments {
  path: string
  recursive?: boolean
  extractImageForThumbnails?: boolean
}

export type SynchronizeRequest = JobCreationRequest<SynchronizeArguments>

export type SynchronizeJobDetails = JobDetails<SynchronizeArguments, string[]>
