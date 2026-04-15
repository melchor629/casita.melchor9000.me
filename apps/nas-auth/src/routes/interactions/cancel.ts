import oidc from '../../oidc/oidc.ts'
import type { Controller, GenericRoute } from '../models.ts'

interface Route extends GenericRoute {
  Reply: void
}

const cancelController: Controller<Route> = async (req, res) => {
  const result = {
    error: 'access_denied',
    error_description: 'User aborted interaction',
  }

  const location = await req.trace(
    'interaction finished',
    {},
    () => oidc.interactionResult(req.raw, res.raw, result, { mergeWithLastSubmission: false }),
  )
  return res.redirect(location).send()
}

cancelController.options = {}

export default cancelController
