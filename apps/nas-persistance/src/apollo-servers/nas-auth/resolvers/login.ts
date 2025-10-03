import {
  Arg, Ctx, FieldResolver, ID, Int, Mutation, Query, Resolver, Root,
} from 'type-graphql'
import { Brackets } from 'typeorm'
import { Login, User } from '../../../orm/nas-auth/entities/index.js'
import Authorized from '../authorized.js'
import type { NasAuthGraphQLContext } from '../index.js'
import { CreateLoginInput, UpdateLoginInput } from '../models/index.js'

@Resolver(() => Login)
export default class LoginResolver {
  @Query(() => Login, { nullable: true, description: 'Get info about an specific login' })
  @Authorized(['login', 'read'])
  login(
    @Arg('id', () => ID) id: number,
    @Ctx() ctx: NasAuthGraphQLContext,
  ) {
    const repository = ctx.connection.getRepository(Login)
    return repository.findOneBy({ id })
  }

  @Query(() => Login, { nullable: true, description: 'Gets a login for the given type and loginId' })
  @Authorized(['login', 'read'])
  findLogin(
    @Arg('loginId', () => String) loginId: string,
    @Arg('provider', () => String) provider: string,
    @Arg('userId', () => ID, { nullable: true }) userId: string | null,
    @Ctx() ctx: NasAuthGraphQLContext,
  ) {
    const repository = ctx.connection.getRepository(Login)
    const query = repository.createQueryBuilder('login')
      .where('login.type = :provider', { provider })
      .andWhere('login.loginId = :loginId', { loginId })
    if (userId) {
      query
        .leftJoin('login.user', 'user')
        .andWhere(new Brackets((qb) => (
          qb.orWhere('user.userName = :userId', { userId })
            .orWhere('user.email = :userId', { userId })
        )))
    }

    return query.getOne()
  }

  @FieldResolver(() => User, { description: 'The user that the login refers to' })
  @Authorized(['user', 'read'])
  user(@Root() login: Login, @Ctx() ctx: NasAuthGraphQLContext) {
    return ctx.userRepository.get(login.userId)
  }

  @Mutation(() => Login, { description: 'Creates a new login for a specific user' })
  @Authorized(['login', 'create'])
  addLogin(
    @Arg('login', () => CreateLoginInput) login: CreateLoginInput,
    @Ctx() ctx: NasAuthGraphQLContext,
  ) {
    const repository = ctx.connection.getRepository(Login)
    const newLogin: Partial<Login> = {
      type: login.type,
      loginId: login.loginId,
      userId: login.userId,
    }

    if (login.data) {
      newLogin.data = JSON.parse(login.data) as Record<string, unknown>
    }
    if (login.disabled) {
      newLogin.disabled = login.disabled
    }

    return repository.save(newLogin, { reload: true })
  }

  @Mutation(() => Login, { description: 'Updates a login' })
  @Authorized(['login', 'update'])
  async updateLogin(
    @Arg('loginId', () => ID) loginId: number,
    @Arg('login', () => UpdateLoginInput) login: UpdateLoginInput,
    @Ctx() ctx: NasAuthGraphQLContext,
  ) {
    const repository = ctx.connection.getRepository(Login)
    const storedLogin = await repository.findOneByOrFail({ id: loginId })

    if (login.data) {
      storedLogin.data = JSON.parse(login.data) as Record<string, unknown>
    }
    if (login.disabled != null) {
      storedLogin.disabled = login.disabled
    }

    return repository.save(storedLogin, { reload: true })
  }

  @Mutation(() => Int, { description: 'Deletes a login' })
  @Authorized(['login', 'delete'])
  async deleteLogin(
    @Arg('loginId', () => ID) id: number,
    @Ctx() ctx: NasAuthGraphQLContext,
  ) {
    const repository = ctx.connection.getRepository(Login)
    const { affected } = await repository.delete({ id })
    return affected ?? 0
  }
}
