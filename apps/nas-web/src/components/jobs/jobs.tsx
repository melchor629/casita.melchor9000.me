import { Button } from '@melchor629/ui'
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
      <div className="text-center text-text-secondary select-none">
        <span>No jobs</span>
      </div>
    )
  }

  return (
    <>
      <div className="text-right">
        <Button type="button" size="small" variant="text" onClick={clearCompleted}>
          Clear completed
        </Button>
      </div>

      {jobs.map((job) => <Job key={job.id} job={job} queue={job.queue} />)}
    </>
  )
}

export default Jobs
