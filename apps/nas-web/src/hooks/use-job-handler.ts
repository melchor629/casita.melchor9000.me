import { nanoid } from 'nanoid'
import { useMemo } from 'react'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import type { ApiClient } from '../api/api-client'
import synchronizationWorker from '../utils/synchronize-manager'
import thumbnailDeleteWorker from '../utils/thumbnail-delete-manager'
import { thumbnailGenerationWorker } from '../utils/thumbnail-manager'
import uploadWorker from '../utils/upload-manager'
import useApiClient from './use-api-client'

export type JobState = (
  { state: 'enqueued' } |
  { state: 'processing', progress?: number | { value: number, description: string } | null } |
  { state: 'succeeded', resume?: string } |
  { state: 'failed', message?: string, error?: Error } |
  { state: 'aborted' }
) & { id: string }

interface EnqueuedJobData<Data extends object> {
  name: string
  abortable: boolean
  retriable: boolean
  data: Data
}

export interface JobWorker<Params extends object, Data extends object> {
  enqueue(this: void, apiClient: ApiClient, jobRequest: JobRequest<Params>): Promise<EnqueuedJobData<Data>>
  retry(this: void, apiClient: ApiClient, job: Job<Data>): Promise<Data>
  abort(this: void, apiClient: ApiClient, job: Job<Data>): Promise<void>
  update(this: void, apiClient: ApiClient, jobs: Job<Data>[]): Promise<JobState[]>
}

export type JobRequest<Params extends object> = Params

export type JobWorkerTypes = keyof typeof jobWorkers
type JobParamsType<T> = T extends JobWorker<infer U, object>
  ? U
  : (
      T extends JobWorkerTypes
        ? ((typeof jobWorkers)[T] extends JobWorker<infer U, object> ? U : never)
        : never
    )
type JobDataType<T> = T extends JobWorker<object, infer U>
  ? U
  : (
      T extends JobWorkerTypes
        ? ((typeof jobWorkers)[T] extends JobWorker<object, infer U> ? U : never)
        : never
    )
type JobRequestWithType<Type extends JobWorkerTypes> = JobParamsType<Type> & { type: Type }

export interface Job<Data = object> {
  id: string
  name: string
  state: 'enqueued' | 'processing' | 'succeeded' | 'failed' | 'aborted'
  progress?: number | { value: number, description: string } | null
  retryCount: number
  error?: Error
  message?: string
  abortable: boolean
  retriable: boolean
  data: Data
}

interface State {
  jobs: (Job<JobDataType<JobWorkerTypes>> & { queue: JobWorkerTypes })[]
}

interface Actions {
  enqueue<JWT extends JobWorkerTypes>(this: void, queue: JWT, job: Job<JobDataType<JWT>>): void
  update(this: void, jobStates: JobState[]): void
  retry(this: void, jobId: string, data: JobDataType<JobWorkerTypes>): void
  abort(this: void, jobId: string): void
  remove(this: void, jobIds: string[]): void
}

interface JobHandlerActions {
  register<T extends JobWorkerTypes>(this: void, request: JobRequestWithType<T>): Promise<string>
  update(this: void): Promise<void>
  retry(this: void, jobId: string): Promise<void>
  abort(this: void, jobId: string): Promise<void>
  remove(this: void, jobIds: string[]): void
}

const jobWorkers = Object.freeze({
  synchronization: synchronizationWorker,
  thumbnailGeneration: thumbnailGenerationWorker,
  thumbnailDelete: thumbnailDeleteWorker,
  upload: uploadWorker,
}) satisfies Record<string, JobWorker<object, object>>

const useJobState = create<State & Actions>()(
  persist(
    devtools(
      (set, get): State & Actions => ({
        jobs: [],

        abort(jobId) {
          const idx = get().jobs.findIndex((job) => job.id === jobId)
          if (idx === -1) {
            return
          }

          set((state) => ({
            jobs: [
              ...state.jobs.slice(0, idx),
              {
                ...state.jobs[idx],
                state: 'aborted',
              },
              ...state.jobs.slice(idx + 1),
            ],
          }))
        },

        enqueue(queue, job) {
          set((state) => ({
            jobs: [
              ...state.jobs,
              { ...job, queue },
            ],
          }))
        },

        remove(jobIds) {
          set((state) => ({
            jobs: state.jobs
              .filter((job) => !jobIds.includes(job.id)),
          }))
        },

        retry(jobId, data) {
          const idx = get().jobs.findIndex((job) => job.id === jobId)
          if (idx === -1) {
            return
          }

          set((state) => ({
            jobs: [
              ...state.jobs.slice(0, idx),
              {
                ...state.jobs[idx],
                retryCount: state.jobs[idx].retryCount + 1,
                state: 'enqueued',
                data,
              },
              ...state.jobs.slice(idx + 1),
            ],
          }))
        },

        update(jobStates) {
          set((state) => ({
            jobs: state.jobs.map((job) => {
              const jobState = jobStates.find((js) => js.id === job.id)
              switch (jobState?.state) {
                case 'enqueued':
                case 'aborted':
                  return { ...job, state: jobState.state }
                case 'succeeded':
                  return { ...job, state: 'succeeded', message: jobState.resume }
                case 'processing':
                  return { ...job, state: 'processing', progress: jobState.progress }
                case 'failed':
                  return { ...job, state: 'failed', message: jobState.message }
                default: return job
              }
            }),
          }))
        },
      }),
      {
        name: 'nas-fs:jobs',
        enabled: import.meta.env.DEV,
      },
    ),
    {
      name: 'nas-fs:jobs',
      storage: createJSONStorage(() => window.localStorage),
      partialize: ({ jobs }) => ({ jobs }),
      version: 1,
      migrate(state, version): unknown {
        if (!version) {
          return state
        }

        return state
      },
    },
  ),
)

const useJobHandler = () => {
  const jobs = useJobState((state) => state.jobs)
  const apiClient = useApiClient()

  const actions = useMemo<JobHandlerActions>(() => ({
    register: async <T extends JobWorkerTypes>({ type, ...request }: JobRequestWithType<T>) => {
      const id = `${type}:${nanoid()}`
      const worker = jobWorkers[type]
      const {
        abortable, data, name, retriable,
      } = await worker.enqueue(apiClient, request as never)
      useJobState.getState().enqueue(type, {
        id,
        name,
        abortable,
        retriable,
        retryCount: 0,
        state: 'enqueued',
        data: data as never,
      })
      return id
    },
    retry: async (jobId: string) => {
      const state = useJobState.getState()
      const job = state.jobs.find((j) => j.id === jobId)
      if (!job || !job.retriable) {
        return
      }

      const worker = jobWorkers[job.queue]
      const newData = await worker.retry(apiClient, job as never)
      state.retry(jobId, newData)
    },
    abort: async (jobId: string) => {
      const state = useJobState.getState()
      const job = state.jobs.find((j) => j.id === jobId)
      if (!job || !job.abortable) {
        return
      }

      const worker = jobWorkers[job.queue]
      await worker.abort(apiClient, job as never)
      state.abort(jobId)
    },
    remove: (jobIds) => useJobState.getState().remove(jobIds),
    update: async () => {
      const state = useJobState.getState()
      const unfinishedJobs = state.jobs
        .filter((j) => j.state === 'enqueued' || j.state === 'processing')
      const unfinishedJobsPerWorker = unfinishedJobs
        .reduce<{ [JK in JobWorkerTypes]: Job<JobDataType<JK>>[] }>(
          (groups, job) => ({ ...groups, [job.queue]: [...groups[job.queue], job] }),
          {
            synchronization: [],
            thumbnailGeneration: [],
            thumbnailDelete: [],
            upload: [],
          },
        )
      const newJobStates = await Promise.all(
        Object.entries(unfinishedJobsPerWorker)
          .map(([q, j]) => jobWorkers[q as JobWorkerTypes].update(apiClient, j as never)),
      )
      state.update(newJobStates.flat())
    },
  }), [apiClient])

  return [actions, jobs] as const
}

export default useJobHandler
