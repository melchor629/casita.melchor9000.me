import {
  Arg, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root,
} from 'type-graphql'
import { Equal } from 'typeorm'
import { ApiResource, Application, Permission } from '../../../orm/nas-auth/entities/index.js'
import Authorized from '../authorized.js'
import type { NasAuthGraphQLContext } from '../index.js'
import CreateApplicationInput from '../models/create-application-input.js'
import UpdateApplicationInput from '../models/update-application-input.js'

@Resolver(() => Application)
export default class ApplicationResolver {
  @Query(() => [Application], { description: 'List of all registered applications' })
  @Authorized(['application', 'read'])
  applications(@Ctx() ctx: NasAuthGraphQLContext) {
    const repository = ctx.connection.getRepository(Application)
    return repository.find({
      order: { id: 'ASC' },
      cache: {
        id: 'application',
        milliseconds: 1000,
      },
    })
  }

  @Query(() => Application, { nullable: true, description: 'Get an application' })
  @Authorized(['application', 'read'])
  application(
    @Arg('id', () => ID, { nullable: true }) id: number,
    @Arg('key', { nullable: true }) key: string,
    @Ctx() ctx: NasAuthGraphQLContext,
  ) {
    const repository = ctx.connection.getRepository(Application)
    return repository.findOneBy(id ? { id } : { key })
  }

  @Mutation(() => Application, { description: 'Creates a new application' })
  @Authorized(['application', 'create'])
  async addApplication(
    @Arg('data', () => CreateApplicationInput) data: CreateApplicationInput,
    @Ctx() ctx: NasAuthGraphQLContext,
  ) {
    const repository = ctx.connection.getRepository(Application)
    const { identifiers: [{ id }] } = await repository.insert({
      key: data.key,
      name: data.name,
    })

    return {
      id: id as number,
      key: data.key,
      name: data.name,
    }
  }

  @Mutation(() => Application, { description: 'Updates an application', nullable: true })
  @Authorized(['application', 'update'])
  async updateApplication(
    @Arg('data', () => UpdateApplicationInput) data: UpdateApplicationInput,
    @Ctx() ctx: NasAuthGraphQLContext,
  ) {
    const repository = ctx.connection.getRepository(Application)
    const { affected } = await repository.update({ id: parseInt(data.id, 10) }, {
      key: data.key,
      name: data.name,
    })

    if (!affected) {
      return null
    }

    return repository.findOneBy({
      id: parseInt(data.id, 10),
    })
  }

  @Mutation(() => Boolean, { description: 'Deletes an application' })
  @Authorized(['application', 'delete'])
  async deleteApplication(@Arg('id', () => ID) id: string, @Ctx() ctx: NasAuthGraphQLContext) {
    const repository = ctx.connection.getRepository(Application)
    const { affected } = await repository.delete({ id: parseInt(id, 10) })
    return (affected ?? 0) > 0
  }

  @FieldResolver(() => [Permission], { description: 'Permissions related to that application' })
  @Authorized(['permission', 'read'])
  permissions(@Root() application: Application, @Ctx() ctx: NasAuthGraphQLContext) {
    const repository = ctx.connection.getRepository(Permission)
    return repository.find({
      where: { applicationId: Equal(application.id) },
      cache: { id: `application:${application.id}:permissions`, milliseconds: 1000 },
    })
  }

  @FieldResolver(() => [ApiResource], { description: 'API Resources of the application' })
  @Authorized(['api-resource', 'read'])
  apiResources(@Root() application: Application, @Ctx() ctx: NasAuthGraphQLContext) {
    const repository = ctx.connection.getRepository(ApiResource)
    return repository.find({
      where: { applicationId: Equal(application.id) },
      cache: { id: `application:${application.id}:apiResources`, milliseconds: 1000 },
    })
  }
}
