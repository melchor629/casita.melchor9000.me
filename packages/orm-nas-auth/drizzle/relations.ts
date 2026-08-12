import { defineRelations } from "drizzle-orm";
import * as schema from "./schema.ts";

export const relations = defineRelations(schema, (r) => ({
  apiResource: {
    application: r.one.application({
      from: r.apiResource.applicationId,
      to: r.application.id,
      optional: false,
    }),
  },
  application: {
    apiResources: r.many.apiResource(),
    permissions: r.many.permission(),
  },
  login: {
    user: r.one.user({
      from: r.login.userId,
      to: r.user.id,
      optional: false,
    }),
  },
  user: {
    logins: r.many.login(),
    permissions: r.many.permission(),
    userPermissions: r.many.userPermission(),
  },
  userPermission: {
    user: r.one.user({
      from: r.userPermission.userId,
      to: r.user.id,
      optional: false,
    }),
    permission: r.one.permission({
      from: r.userPermission.permissionId,
      to: r.permission.id,
      optional: false,
    })
  },
  permission: {
    application: r.one.application({
      from: r.permission.applicationId,
      to: r.application.id,
      optional: false,
    }),
    users: r.many.user({
      from: r.permission.id.through(r.userPermission.permissionId),
      to: r.user.id.through(r.userPermission.userId),
    }),
  },
}))
