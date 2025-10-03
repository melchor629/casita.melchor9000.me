import {
  Arg,
  Ctx, FieldResolver, ID, Int, Mutation, Resolver, Root,
} from 'type-graphql'
import { Permission, User, UserPermission } from '../../../orm/nas-auth/entities/index.js'
import Authorized from '../authorized.js'
import type { NasAuthGraphQLContext } from '../index.js'
import {
  CreateUserPermissionInput,
  EditUserPermissionInput,
} from '../models/index.js'

@Resolver(() => UserPermission)
export default class UserPermissionResolver {
  @Mutation(() => UserPermission, { description: 'Adds a new user permission' })
  @Authorized(['user', 'update'])
  async addUserPermission(
    @Arg('data', () => CreateUserPermissionInput) data: CreateUserPermissionInput,
    @Ctx() ctx: NasAuthGraphQLContext,
  ) {
    const repository = ctx.connection.getRepository(UserPermission)
    const { identifiers: [{ id }] } = await repository.insert({
      delete: data.delete,
      permissionId: parseInt(data.permissionId, 10),
      userId: parseInt(data.userId, 10),
      write: data.write,
    })

    return {
      id: id as number,
      delete: data.delete,
      permissionId: parseInt(data.permissionId, 10),
      userId: parseInt(data.userId, 10),
      write: data.write,
    }
  }

  @Mutation(() => UserPermission, { nullable: true, description: 'Updates an existing user permission' })
  @Authorized(['user', 'update'])
  async updateUserPermission(
    @Arg('data', () => EditUserPermissionInput) data: EditUserPermissionInput,
    @Ctx() ctx: NasAuthGraphQLContext,
  ) {
    const repository = ctx.connection.getRepository(UserPermission)
    const toUpdate: Partial<Omit<UserPermission, 'permission' | 'user'>> = {}

    if (data.permissionId) {
      toUpdate.permissionId = data.permissionId
    }
    if (data.write != null) {
      toUpdate.write = data.write
    }
    if (data.delete != null) {
      toUpdate.delete = data.delete
    }

    const { affected } = await repository.update(data.id, toUpdate)
    if (!affected) {
      return null
    }

    return repository.findOneBy({ id: data.id })
  }

  @Mutation(() => Int, { description: 'Deletes an user permission' })
  @Authorized(['user', 'update'])
  async deleteUserPermission(
    @Arg('id', () => ID) id: number,
    @Ctx() ctx: NasAuthGraphQLContext,
  ) {
    const repository = ctx.connection.getRepository(UserPermission)
    const { affected } = await repository.delete({ id })
    return affected ?? 0
  }

  @FieldResolver(() => User, { description: 'The user that has this permission' })
  @Authorized(['user', 'read'])
  user(@Root() userPermission: UserPermission, @Ctx() ctx: NasAuthGraphQLContext) {
    return ctx.userRepository.get(userPermission.userId)
  }

  @FieldResolver(() => Permission, { description: 'The permission the user has' })
  @Authorized(['permission', 'read'])
  permission(@Root() userPermission: UserPermission, @Ctx() ctx: NasAuthGraphQLContext) {
    return ctx.permissionRepository.get(userPermission.permissionId)
  }
}
