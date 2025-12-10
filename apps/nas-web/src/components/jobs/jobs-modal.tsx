import type { FC } from 'react'
import Modal from '../modal-view'
import Jobs from './jobs'

const JobsModal: FC<{ readonly show: boolean, readonly onClose: () => void }> = ({ onClose, show }) => (
  <Modal id="jobs" title="Jobs" show={show} onClose={onClose}>
    <Jobs shouldUpdate={show} />
  </Modal>
)

export default JobsModal
