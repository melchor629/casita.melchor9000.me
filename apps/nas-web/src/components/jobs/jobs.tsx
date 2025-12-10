import { type FC, useCallback, useEffect } from 'react'
import useJobHandler from '@/hooks/use-job-handler'
import Job from './job'

const Jobs: FC<{ readonly shouldUpdate: boolean }> = ({ shouldUpdate }) => {
  const [{ remove, update }, jobs] = useJobHandler()

  const clearCompleted = useCallback(() => {
    const jobsToRemove = jobs
      .filter((job) => job.state === 'succeeded')
      .map((job) => job.id)
    remove(jobsToRemove)
  }, [jobs, remove])

  useEffect(() => {
    if (shouldUpdate) {
      const h = setInterval(() => void update().catch(() => {}), 2000)
      update().catch(() => {})
      return () => clearInterval(h)
    }

    return () => {}
  }, [update, shouldUpdate])

  if (!jobs.length) {
    return (
      <div className="text-center">
        <span>No jobs</span>
      </div>
    )
  }

  return (
    <>
      <div className="text-right">
        <button type="button" className="btn btn-sm btn-outline-primary" onClick={clearCompleted}>
          Clear completed
        </button>
      </div>

      {jobs.map((job) => <Job key={job.id} job={job} queue={job.queue} />)}
    </>
  )
}

export default Jobs
