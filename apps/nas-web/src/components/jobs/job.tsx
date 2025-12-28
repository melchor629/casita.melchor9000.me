import startCase from 'lodash-es/startCase'
import type { FC } from 'react'
import { ApiClientException } from '@/api/api-client'
import useJobHandler, { type Job as IJob, type JobWorkerTypes } from '@/hooks/use-job-handler'
import Button from '../core/button'
import ProgressBar from '../core/progress-bar'
import { Redo, Remove, Stop } from '../icons'

interface Props {
  readonly job: IJob
  readonly queue: JobWorkerTypes
}

const Job: FC<Props> = ({ job, queue }) => {
  const [{ abort, remove, retry }] = useJobHandler()

  const colorClass = {
    enqueued: 'text-text-secondary',
    processing: 'text-text-main',
    succeeded: 'text-secondary-main',
    failed: 'text-primary-main',
    aborted: 'text-primary-main',
  }[job.state]

  const progressValue = (typeof job.progress === 'number' ? job.progress : job.progress?.value ?? 0) * 100
  const progressDescription = typeof job.progress === 'object' ? job.progress?.description : `${progressValue.toFixed(0)}%`
  return (
    <div className="p-2">
      <div className="flex justify-between mb-2 select-none">
        <small className={colorClass}>{startCase(job.state)}</small>
        <small className="text-text-secondary">{startCase(queue)}</small>
      </div>
      <div className="flex justify-between items-center">
        <span>{job.name}</span>
        <div>
          {(job.state === 'processing' || job.state === 'enqueued') && job.abortable && (
            <Button
              type="button"
              variant="text"
              size="small"
              color="error"
              onClick={() => void abort(job.id)}
              aria-label="Stop job"
              icon={<Stop />}
            />
          )}
          {job.state === 'failed' && job.retriable && (
            <Button
              type="button"
              variant="text"
              size="small"
              color="primary"
              className="me-1"
              onClick={() => void retry(job.id)}
              aria-label="Retry job"
              icon={<Redo />}
            />
          )}
          {job.state !== 'processing' && job.state !== 'enqueued' && (
            <Button
              type="button"
              variant="text"
              size="small"
              color="neutral"
              onClick={() => remove([job.id])}
              aria-label="Remove job"
              icon={<Remove />}
            />
          )}
        </div>
      </div>
      <div>
        {job.state === 'processing' && job.progress && (
          <div className="mt-2">
            <ProgressBar value={Math.trunc(progressValue)} aria-labelledby={`job-progress-${job.id}-label`} />
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
