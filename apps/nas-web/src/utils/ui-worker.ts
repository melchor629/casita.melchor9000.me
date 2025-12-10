import { nanoid } from 'nanoid'
import type { ApiClient } from '../api/api-client'
import type { Job as OtherJob, JobState, JobWorker } from '../hooks/use-job-handler'

interface Job<Params, Data, ReturnValue> {
  state: 'enqueued' | 'processing' | 'succeeded' | 'failed' | 'aborted'
  params: Params
  data: Data
  abort: AbortController
  apiClient: ApiClient
  progress?: number | { value: number, description: string } | null
  error?: Error
  returnValue?: ReturnValue
}

export interface JobContext<Params, Data> {
  readonly apiClient: ApiClient
  readonly params: Readonly<Params>
  readonly data: Readonly<Data>
  readonly progress?: number | { value: number, description: string } | null
  readonly abortSignal: AbortSignal

  onProgress(progress: number | { value: number, description: string } | null): void
}

export default abstract class UiWorker<
  Params extends object,
  Data extends { jobId: string },
  ReturnValue = void,
> implements JobWorker<Params, Data> {
  readonly #jobs: Job<Params, Data, ReturnValue>[] = []

  #processPromise: Promise<void> | null = null

  async enqueue(apiClient: ApiClient, params: Params) {
    const data = await this.prepare(apiClient, params)
    const jobId = nanoid()
    this.#jobs.push({
      params,
      data: { ...data, jobId } as Data,
      state: 'enqueued',
      abort: new AbortController(),
      apiClient,
    })
    this.#startProgress()
    return {
      data: { ...data, jobId } as Data,
      abortable: true,
      retriable: true,
      name: this.generateName?.(params) || jobId,
    }
  }

  async retry(apiClient: ApiClient, job: OtherJob<Data>) {
    const iJob = this.#jobs.find((j) => j.data.jobId === job.data.jobId)
    if (!iJob) {
      return job.data
    }

    iJob.apiClient = apiClient
    iJob.progress = undefined
    try {
      const newData = await this.prepareRetry(apiClient, job, iJob.params)
      iJob.state = 'enqueued'
      iJob.data = { ...newData, jobId: iJob.data.jobId } as Data
      this.#startProgress()
    } catch (e) {
      iJob.state = 'failed'
      iJob.error = e as Error
    }
    return iJob.data
  }

  abort(apiClient: ApiClient, job: OtherJob<Data>) {
    const iJob = this.#jobs.find((j) => j.data.jobId === job.data.jobId)
    if (!iJob) {
      return Promise.resolve()
    }

    iJob.apiClient = apiClient
    iJob.state = 'aborted'
    iJob.abort.abort()
    return Promise.resolve()
  }

  update(apiClient: ApiClient, jobs: OtherJob<Data>[]) {
    const iJobs = jobs.map((j) => (
      [j, this.#jobs.find((ij) => ij.data.jobId === j.data.jobId)] as const
    ))
    iJobs.forEach(([, j]) => {
      if (j) {
        j.apiClient = apiClient
      }
    })

    const jobStates = iJobs.map(([{ id }, ij]): JobState => {
      if (!ij) {
        return { id, state: 'failed', message: 'Job does not exist' }
      }

      switch (ij.state) {
        case 'aborted': return { id, state: 'aborted' }
        case 'enqueued': return { id, state: 'enqueued' }
        case 'failed': return { id, state: 'failed', error: ij.error }
        case 'processing': return { id, state: 'processing', progress: ij.progress }
        case 'succeeded': return { id, state: 'succeeded' }
        default: return { id, state: 'failed' }
      }
    })
    return Promise.resolve(jobStates)
  }

  #startProgress() {
    if (this.#processPromise === null) {
      this.#processPromise = this.#progress()
    }
  }

  async #progress() {
    let job: Job<Params, Data, ReturnValue> | undefined

    while ((job = this.#jobs.find((j) => j.state === 'enqueued'))) {
      job.state = 'processing'
      const j = job
      const context = Object.freeze<JobContext<Params, Data>>({
        abortSignal: j.abort.signal,
        get apiClient() { return j.apiClient },
        data: j.data,
        onProgress(progress) {
          j.progress = progress
        },
        params: j.params,
        get progress() { return j.progress },
      })

      try {
        job.returnValue = await this.process(context)
        job.state = 'succeeded'
      } catch (e) {
        job.state = 'failed'
        job.error = e as Error
      }
    }

    this.#processPromise = null
  }

  protected abstract prepare(apiClient: ApiClient, params: Params): Promise<Omit<Data, 'jobId'>>
  protected generateName?: (params: Params) => string
  protected abstract process(context: JobContext<Params, Data>): Promise<ReturnValue>
  protected abstract prepareRetry(apiClient: ApiClient, job: OtherJob<Data>, params: Params): Promise<Omit<Data, 'jobId'>>
}
