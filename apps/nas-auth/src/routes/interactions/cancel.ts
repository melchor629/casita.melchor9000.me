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

  // TODO tries twice and fails for some reason ...
  await req.trace(
    'interaction finished',
    {},
    () => oidc.interactionFinished(req.raw, res.raw, result, { mergeWithLastSubmission: false }).then(() => res.hijack()),
  )
}

cancelController.options = {}

export default cancelController
