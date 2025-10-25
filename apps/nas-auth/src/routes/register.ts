import type { FastifyInstance } from 'fastify'
import getHealthController from './health.ts'
import alreadyLoggedInController from './interactions/already-logged-in.ts'
import cancelController from './interactions/cancel.ts'
import confirmGrantsController from './interactions/confirm-grants.ts'
import postExternalLoginController from './interactions/post-external-login.ts'
import userPasswordLoginController from './interactions/user-password-login.ts'
import getPermissionsForToken from './permissions.ts'

const registerRoutes = (app: FastifyInstance) => {
  app.get('/i/:uid/login', alreadyLoggedInController)
  app.post('/i/:uid/login', userPasswordLoginController)
  app.post('/i/:uid/confirm', confirmGrantsController)
  app.get('/i/:uid/cancel', cancelController)
  app.get('/i/:uid/post-external', postExternalLoginController)

  app.options('/token/permissions', getPermissionsForToken)
  app.get('/token/permissions', getPermissionsForToken)

  app.get('/health', getHealthController)

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
