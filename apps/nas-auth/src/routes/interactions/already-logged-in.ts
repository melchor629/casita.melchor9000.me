import oidc from '../../oidc/oidc.ts'
import type { Controller, GenericRoute } from '../models.ts'

interface Route extends GenericRoute {
  Querystring: { accountId?: string }
  Reply:
    | void
    | { message: string }
}

const alreadyLoggedInController: Controller<Route> = async (req, res) => {
  const interaction = await req.trace(
    'interaction details',
    {},
    () => oidc.interactionDetails(req.raw, res.raw),
  )
  const { prompt } = interaction
  if (prompt.name !== 'login') {
    await res.status(400).send({ message: 'Interaction is not a login' })
    return
  }

  const { accountId } = req.query
  if (!accountId) {
    await res.status(400).send({ message: 'No user logged in' })
    return
  }

  await req.trace('interaction finished', {}, () => oidc.interactionFinished(
    req.raw,
    res.raw,
    { login: { accountId } },
    { mergeWithLastSubmission: false },
  ))
}

alreadyLoggedInController.options = {}

export default alreadyLoggedInController
