import {
  Arg, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root,
} from 'type-graphql'
import { ApiResource, Application } from '../../../orm/nas-auth/entities/index.js'
import Authorized from '../authorized.js'
import type { NasAuthGraphQLContext } from '../index.js'
import { CreateApiResourceInput, UpdateApiResourceInput } from '../models/index.js'

@Resolver(() => ApiResource)
export default class ApiResourceResolver {
  @Query(() => [ApiResource], { description: 'List of all registered API Resources' })
  @Authorized(['api-resource', 'read'])
  apiResources(@Ctx() ctx: NasAuthGraphQLContext) {
    const repository = ctx.connection.getRepository(ApiResource)
    return repository.find({
      cache: {
        id: 'apiResource',
        milliseconds: 1000,
      },
    })
  }

  @Query(() => ApiResource, { nullable: true, description: 'Get an API Resource' })
  @Authorized(['api-resource', 'read'])
  apiResource(
    @Arg('key', () => ID) key: string,
    @Ctx() ctx: NasAuthGraphQLContext,
  ) {
    const repository = ctx.connection.getRepository(ApiResource)
    return repository.findOneBy({ key })
  }

  @Mutation(() => ApiResource, { description: 'Creates a new API Resource' })
  @Authorized(['api-resource', 'create'])
  async addApiResource(
    @Arg('data', () => CreateApiResourceInput) data: CreateApiResourceInput,
    @Ctx() ctx: NasAuthGraphQLContext,
  ) {
    const repository = ctx.connection.getRepository(ApiResource)
    const apiResource: Partial<Omit<ApiResource, 'application'>> = {
      accessTokenFormat: data.accessTokenFormat,
      accessTokenTTL: data.accessTokenTTL,
      applicationId: parseInt(data.applicationId, 10),
      audience: data.audience,
      jwt: data.jwt,
      key: data.key,
      name: data.name,
      paseto: data.paseto,
      scopes: data.scopes,
    }
    const { identifiers: [{ id }] } = await repository.insert(apiResource)

    return { id: id as number, ...apiResource }
  }

  @Mutation(() => ApiResource, { description: 'Updates an API Resource', nullable: true })
  @Authorized(['api-resource', 'update'])
  async updateApiResource(
    @Arg('data', () => UpdateApiResourceInput) data: UpdateApiResourceInput,
    @Ctx() ctx: NasAuthGraphQLContext,
  ) {
    const repository = ctx.connection.getRepository(ApiResource)
    const { affected } = await repository.update({ key: data.key }, {
      accessTokenFormat: data.accessTokenFormat,
      accessTokenTTL: data.accessTokenTTL,
      audience: data.audience,
      jwt: data.jwt,
      name: data.name,
      paseto: data.paseto,
      scopes: data.scopes,
    })

    if ((affected ?? 0) === 0) {
      return null
    }

    return repository.findOneBy({ key: data.key })
  }

  @Mutation(() => Boolean, { description: 'Deletes an API Resource' })
  @Authorized(['api-resource', 'delete'])
  async deleteApiResource(@Arg('key', () => ID) key: string, @Ctx() ctx: NasAuthGraphQLContext) {
    const repository = ctx.connection.getRepository(ApiResource)
    const { affected } = await repository.delete({ key })
    return (affected ?? 0) > 0
  }

  @FieldResolver(() => Application, { description: 'Application in which this resource belongs to' })
  @Authorized(['application', 'read'])
  application(@Root() apiResource: ApiResource, @Ctx() ctx: NasAuthGraphQLContext) {
    return ctx.applicationRepository.get(apiResource.applicationId)
  }
}
