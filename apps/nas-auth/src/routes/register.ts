import type { FastifyInstance } from 'fastify'
import alreadyLoggedInController from './interactions/already-logged-in.ts'
import cancelController from './interactions/cancel.ts'
import confirmGrantsController from './interactions/confirm-grants.ts'
import postExternalLoginController from './interactions/post-external-login.ts'
import userPasswordLoginController from './interactions/user-password-login.ts'
import finishPasskeyLoginController from './passkeys/finish-login.ts'
import finishPasskeyRegistrationController from './passkeys/finish-registration.ts'
import startPasskeyLoginController from './passkeys/start-login.ts'
import startPasskeyRegistrationController from './passkeys/start-registration.ts'
import getPermissionsForToken from './permissions.ts'

const registerRoutes = (app: FastifyInstance) => {
  app.get('/i/:uid/login', alreadyLoggedInController.options, alreadyLoggedInController)
  app.post('/i/:uid/login', userPasswordLoginController.options, userPasswordLoginController)
  app.post('/i/:uid/confirm', confirmGrantsController.options, confirmGrantsController)
  app.get('/i/:uid/cancel', cancelController.options, cancelController)
  app.get('/i/:uid/post-external', postExternalLoginController.options, postExternalLoginController)

  app.post('/pk/register/start', startPasskeyRegistrationController.options, startPasskeyRegistrationController)
  app.post('/pk/register/finish', finishPasskeyRegistrationController.options, finishPasskeyRegistrationController)
  app.post('/i/:uid/pk/start', startPasskeyLoginController.options, startPasskeyLoginController)
  app.post('/i/:uid/pk/finish', finishPasskeyLoginController.options, finishPasskeyLoginController)

  app.options('/token/permissions', getPermissionsForToken)
  app.get('/token/permissions', getPermissionsForToken)

  // oidc redirections
  for (const route of ['.well-known/openid-configuration', 'jwks']) {
    app.get(`/${route}`, (req, res) => {
      // if we have an origin, add it for CORS
      if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin)
      }
      res.redirect(`/oidc/${route}`, 301)
    })
  }
}

export default registerRoutes
