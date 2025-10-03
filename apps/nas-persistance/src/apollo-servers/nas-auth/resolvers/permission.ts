import {
  Arg,
  Ctx,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql'
import { Equal } from 'typeorm'
import { Application, Permission, UserPermission } from '../../../orm/nas-auth/entities/index.js'
import Authorized from '../authorized.js'
import type { NasAuthGraphQLContext } from '../index.js'
import { CreatePermissionInput, UpdatePermissionInput } from '../models/index.js'

@Resolver(() => Permission)
export default class PermissionResolver {
  @Query(() => [Permission], { description: 'List of registered permissions' })
  @Authorized(['permission', 'read'])
  permissions(@Ctx() ctx: NasAuthGraphQLContext) {
    const repository = ctx.connection.getRepository(Permission)
    return repository.find({
      cache: {
        id: 'permissions',
        milliseconds: 1000,
      },
    })
  }

  @Mutation(() => Permission, { description: 'Create a new permission' })
  @Authorized(['permission', 'create'])
  async addPermission(
    @Arg('data', () => CreatePermissionInput) data: CreatePermissionInput,
    @Ctx() ctx: NasAuthGraphQLContext,
  ) {
    const repository = ctx.connection.getRepository(Permission)
    const { identifiers: [{ id }] } = await repository.insert({
      name: data.name,
      displayName: data.displayName,
      applicationId: parseInt(data.applicationId, 10),
    })

    return {
      id: id as number,
      name: data.name,
      displayName: data.displayName,
      applicationId: data.applicationId,
    }
  }

  @Mutation(() => Permission, { description: 'Update a permission', nullable: true })
  @Authorized(['permission', 'update'])
  async updatePermission(
    @Arg('data', () => UpdatePermissionInput) data: UpdatePermissionInput,
    @Ctx() ctx: NasAuthGraphQLContext,
  ) {
    const repository = ctx.connection.getRepository(Permission)
    const { affected } = await repository.update({ id: parseInt(data.id, 10) }, {
      name: data.name,
      displayName: data.displayName,
    })

    if ((affected ?? 0) === 0) {
      return null
    }

    return repository.findOneBy({ id: parseInt(data.id, 10) })
  }

  @Mutation(() => Boolean, { description: 'Deletes a permission', nullable: true })
  @Authorized(['permission', 'delete'])
  async deletePermission(@Arg('id', () => ID) id: string, @Ctx() ctx: NasAuthGraphQLContext) {
    const repository = ctx.connection.getRepository(Permission)
    const { affected } = await repository.delete({ id: parseInt(id, 10) })
    return (affected ?? 0) > 0
  }

  @FieldResolver(() => Application, { description: 'Application associated with this permission' })
  @Authorized(['application', 'read'])
  application(@Root() permission: Permission, @Ctx() ctx: NasAuthGraphQLContext) {
    return ctx.applicationRepository.get(permission.applicationId)
  }

  @FieldResolver(() => [UserPermission], { description: 'Users that has this permission assigned' })
  @Authorized(['user', 'read'])
  users(@Root() permission: Permission, @Ctx() ctx: NasAuthGraphQLContext) {
    const repository = ctx.connection.getRepository(UserPermission)
    return repository.find({
      where: { permission: Equal(permission) },
      cache: { id: `permission:${permission.id}:userPermissions`, milliseconds: 1000 },
    })
  }
}
