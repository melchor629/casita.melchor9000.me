import startCase from 'lodash-es/startCase'
import type { FC } from 'react'
import { ApiClientException } from '@/api/api-client'
import useJobHandler, { type Job as IJob, type JobWorkerTypes } from '@/hooks/use-job-handler'
import { Redo, Remove, Stop } from '../icons'

interface Props {
  readonly job: IJob
  readonly queue: JobWorkerTypes
}

const Job: FC<Props> = ({ job, queue }) => {
  const [{ abort, remove, retry }] = useJobHandler()

  const colorClass = {
    enqueued: 'text-secondary',
    processing: 'text-primary',
    succeeded: 'text-success',
    failed: 'text-danger',
    aborted: 'text-warning',
  }[job.state]

  const progressValue = (typeof job.progress === 'number' ? job.progress : job.progress?.value ?? 0) * 100
  const progressDescription = typeof job.progress === 'object' ? job.progress?.description : `${progressValue.toFixed(0)}%`
  return (
    <div className="p-2">
      <div className="d-flex justify-content-between mb-2">
        <small className={colorClass}>{startCase(job.state)}</small>
        <small>{startCase(queue)}</small>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <span>{job.name}</span>
        <div>
          {(job.state === 'processing' || job.state === 'enqueued') && job.abortable && (
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={() => void abort(job.id)}
              aria-label="Stop job"
            >
              <Stop width={12} />
            </button>
          )}
          {job.state === 'failed' && job.retriable && (
            <button
              type="button"
              className="btn btn-sm btn-outline-primary me-1"
              onClick={() => void retry(job.id)}
              aria-label="Retry job"
            >
              <Redo width={12} />
            </button>
          )}
          {job.state !== 'processing' && job.state !== 'enqueued' && (
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => remove([job.id])}
              aria-label="Remove job"
            >
              <Remove width={12} />
            </button>
          )}
        </div>
      </div>
      <div>
        {job.state === 'processing' && job.progress && (
          <div className="mt-2">
            <div className="progress" style={{ height: 2 }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progressValue}%` }}
                aria-valuenow={Math.trunc(progressValue)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-labelledby={`job-progress-${job.id}-label`}
              />
            </div>
            <div className="text-center" id={`job-progress-${job.id}-label`}>
              <small>{progressDescription}</small>
            </div>
          </div>
        )}
        {job.state === 'succeeded' && job.message && <p>{job.message}</p>}
        {job.state === 'failed' && (
          <code>
            {job.message
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              || (job.error instanceof ApiClientException && job.error.parsedBody?.message as string)
              || job.error?.message
              || `${job.error}`}
          </code>
        )}
      </div>
    </div>
  )
}

export default Job
