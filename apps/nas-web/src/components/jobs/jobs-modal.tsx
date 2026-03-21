import { Dialog } from '@melchor629/ui'
import type { FC } from 'react'
import Jobs from './jobs'

const JobsModal: FC<{ readonly show: boolean, readonly onClose: () => void }> = ({ onClose, show }) => (
  <Dialog id="jobs" title="Jobs" show={show} onClose={onClose}>
    <Jobs shouldUpdate={show} />
  </Dialog>
)

export default JobsModal
