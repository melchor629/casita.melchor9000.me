import {
  Arg,
  Ctx, FieldResolver, ID, Int, Mutation, Query, Resolver, Root,
} from 'type-graphql'
import { Equal } from 'typeorm'
import { Login, User, UserPermission } from '../../../orm/nas-auth/entities/index.js'
import Authorized from '../authorized.js'
import type { NasAuthGraphQLContext } from '../index.js'
import { CreateUserInput, UpdateUserInput } from '../models/index.js'

@Resolver(() => User)
export default class UserResolver {
  @Query(() => [User], { description: 'List of users registered' })
  @Authorized(['user', 'read'])
  users(@Ctx() ctx: NasAuthGraphQLContext) {
    const repository = ctx.connection.getRepository(User)
    return repository.find({
      order: { id: 'ASC' },
      cache: {
        id: 'user',
        milliseconds: 1000,
      },
    })
  }

  @Query(() => User, { nullable: true, description: 'Get the user' })
  @Authorized(['user', 'read'])
  user(
    @Arg('id', () => ID, { nullable: true }) id: number,
    @Arg('userName', () => String, { nullable: true }) userName: string,
    @Ctx() ctx: NasAuthGraphQLContext,
  ) {
    const repository = ctx.connection.getRepository(User)
    return repository.findOneBy(userName ? { userName } : { id })
  }

  @Query(() => User, { nullable: true, description: 'Finds a user that matches one of the arguments' })
  @Authorized(['user', 'read'])
  findUser(
    @Arg('displayName', () => String, { nullable: true }) displayName: string | null,
    @Arg('emails', () => [String], { nullable: true }) emails: string[] | null,
    @Arg('userName', () => String, { nullable: true }) userName: string | null,
    @Ctx() ctx: NasAuthGraphQLContext,
  ) {
    const repository = ctx.connection.getRepository(User)
    const query = repository.createQueryBuilder('user')
    if (displayName) {
      query.orWhere('user.displayName = :displayName', { displayName })
    }
    if (emails?.length) {
      query.orWhere('user.email IN (:...emails)', { emails })
    }
    if (userName) {
      query.orWhere('user.userName = :userName', { userName })
    }

    return query.getOne()
  }

  @FieldResolver(() => [UserPermission], { description: 'Permissions that the user has' })
  @Authorized(['permission', 'read'])
  permissions(@Root() user: User, @Ctx() ctx: NasAuthGraphQLContext) {
    const repository = ctx.connection.getRepository(UserPermission)
    return repository.find({
      where: { userId: user.id },
      cache: { id: `user:${user.id}:permissions`, milliseconds: 1000 },
    })
  }

  @FieldResolver(() => [Login], { description: 'Logins that the user uses to enter in the system' })
  @Authorized(['login', 'read'])
  logins(@Root() user: User, @Ctx() ctx: NasAuthGraphQLContext) {
    const repository = ctx.connection.getRepository(Login)
    return repository.find({
      where: { userId: Equal(user.id) },
      cache: { id: `user:${user.id}:logins`, milliseconds: 1000 },
    })
  }

  @Mutation(() => User, { description: 'Creates a new user' })
  @Authorized(['user', 'create'])
  addUser(
    @Arg('user', () => CreateUserInput) user: CreateUserInput,
    @Ctx() ctx: NasAuthGraphQLContext,
  ) {
    const repository = ctx.connection.getRepository(User)
    const newUser: Partial<User> = {
      displayName: user.displayName,
      userName: user.userName,
    }

    if (user.email) {
      newUser.email = user.email
    }
    if (user.disabled) {
      newUser.disabled = user.disabled
    }
    if (user.givenName) {
      newUser.givenName = user.givenName
    }
    if (user.familyName) {
      newUser.familyName = user.familyName
    }
    if (user.profileImageUrl) {
      newUser.profileImageUrl = user.profileImageUrl
    }

    return repository.save(newUser, { reload: true })
  }

  @Mutation(() => User, { description: 'Updates an existing user' })
  @Authorized(['user', 'update'])
  async updateUser(
    @Arg('userId', () => ID) userId: number | string,
    @Arg('user', () => UpdateUserInput) user: UpdateUserInput,
    @Ctx() ctx: NasAuthGraphQLContext,
  ) {
    const userIdAsNumber = typeof userId === 'string' ? parseInt(userId, 10) : userId

    const repository = ctx.connection.getRepository(User)
    const existingUser = await (
      !Number.isNaN(userIdAsNumber)
        ? repository.findOneByOrFail({ id: userIdAsNumber })
        : repository.findOneByOrFail({ userName: userId.toString() })
    )

    if (user.displayName) {
      existingUser.displayName = user.displayName
    }
    if (user.userName) {
      existingUser.userName = user.userName
    }
    if (user.email) {
      existingUser.email = user.email
    }
    if (user.disabled != null) {
      existingUser.disabled = user.disabled
    }
    if (user.givenName) {
      existingUser.givenName = user.givenName
    }
    if (user.familyName) {
      existingUser.familyName = user.familyName
    }
    if (user.profileImageUrl) {
      existingUser.profileImageUrl = user.profileImageUrl
    }

    return repository.save(existingUser, { reload: true })
  }

  @Mutation(() => Int, { description: 'Deletes an user' })
  @Authorized(['user', 'delete'])
  async deleteUser(
    @Arg('userId', () => ID) userId: number | string,
    @Ctx() ctx: NasAuthGraphQLContext,
  ) {
    const userIdAsNumber = typeof userId === 'string' ? parseInt(userId, 10) : userId
    const repository = ctx.connection.getRepository(User)

    const { affected } = await (
      !Number.isNaN(userIdAsNumber)
        ? repository.delete({ id: userIdAsNumber })
        : repository.delete({ userName: userId.toString() })
    )
    return affected ?? 0
  }
}
