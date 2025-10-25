import type { InteractionResults } from 'oidc-provider'
import oidc from '../../oidc/oidc.ts'
import type { Controller, GenericRoute } from '../models.ts'

interface Route extends GenericRoute {
  Reply: void
}

const confirmGrantsController: Controller<Route> = async (req, res) => {
  const interaction = await req.trace(
    'interaction details',
    {},
    () => oidc.interactionDetails(req.raw, res.raw),
  )
  const { params, prompt: { details, name } } = interaction
  if (name !== 'consent' || !interaction.session) {
    await res.status(400).send({ message: 'Interaction is not a consent' })
    return
  }

  let { grantId, session: { accountId } } = interaction
  let grant: InstanceType<typeof oidc['Grant']>
  if (grantId) {
    grant = (await req.trace(
      'find grant',
      {},
      () => oidc.Grant.find(grantId!),
    ))!
  } else {
    grant = new oidc.Grant({
      accountId,
      clientId: params.client_id as string,
    })
  }

  // TODO add ability to accept partially some of the scopes, claims and resource-scopes
  if (Array.isArray(details.missingOIDCScope)) {
    grant.addOIDCScope(details.missingOIDCScope.join(' '))
  }
  if (Array.isArray(details.missingOIDCClaims)) {
    grant.addOIDCClaims(details.missingOIDCClaims as string[])
  }
  if (typeof details.missingResourceScopes === 'object') {
    for (const [indicator, scopes] of Object.entries(details.missingResourceScopes as Record<string, string[]>)) {
      grant.addResourceScope(indicator, scopes.join(' '))
    }
  }

  grantId = await req.trace('save grant', {}, () => grant.save())

  const result: InteractionResults = { consent: {} }
  if (!interaction.grantId) {
    // we don't have to pass grantId to consent, we're just modifying existing one
    result.consent!.grantId = grantId
  }

  await req.trace(
    'interaction finished',
    {},
    () => oidc.interactionFinished(req.raw, res.raw, result, { mergeWithLastSubmission: true }),
  )
}

confirmGrantsController.options = {}

export default confirmGrantsController
