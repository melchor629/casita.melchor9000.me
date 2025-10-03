import {
  Arg, Ctx, ID, Mutation, Query, Resolver,
} from 'type-graphql'
import { Client } from '../../../orm/nas-auth/entities/index.js'
import Authorized from '../authorized.js'
import type { NasAuthGraphQLContext } from '../index.js'
import { CreateClientInput, UpdateClientInput } from '../models/index.js'

@Resolver(() => Client)
export default class ClientResolver {
  @Query(() => [Client], { description: 'List of all registered clients' })
  @Authorized(['client', 'read'])
  clients(@Ctx() ctx: NasAuthGraphQLContext) {
    const repository = ctx.connection.getRepository(Client)
    return repository.find({
      cache: {
        id: 'client',
        milliseconds: 1000,
      },
    })
  }

  @Query(() => Client, { nullable: true, description: 'Gets one client' })
  @Authorized(['client', 'read'])
  client(
    @Arg('id', () => ID) id: string,
    @Ctx() ctx: NasAuthGraphQLContext,
  ) {
    const repository = ctx.connection.getRepository(Client)
    return repository.findOneBy({ clientId: id })
  }

  @Mutation(() => Client, { nullable: false, description: 'Creates a new client' })
  @Authorized(['client', 'create'])
  async addClient(
    @Arg('data', () => CreateClientInput) data: CreateClientInput,
    @Ctx() ctx: NasAuthGraphQLContext,
  ) {
    const repository = ctx.connection.getRepository(Client)
    const client: Omit<Client, 'id'> = {
      clientId: data.clientId,
      clientName: data.clientName,
      fields: data.fields ?? {},
    }

    const { identifiers: [{ id }] } = await repository.insert(client)
    return { ...client, id: id as number }
  }

  @Mutation(() => Client, { nullable: true, description: 'Updates a client' })
  @Authorized(['client', 'update'])
  async updateClient(
    @Arg('data', () => UpdateClientInput) data: UpdateClientInput,
    @Ctx() ctx: NasAuthGraphQLContext,
  ) {
    const repository = ctx.connection.getRepository(Client)
    const currentClient = await repository.findOneBy({ clientId: data.clientId })
    if (!currentClient) {
      return null
    }

    const newFields = data.fields ? { ...currentClient.fields, ...data.fields } : undefined

    await repository.update({ clientId: data.clientId }, {
      clientName: data.clientName,
      fields: newFields,
    })

    return repository.findOneBy({ clientId: data.clientId })
  }

  @Mutation(() => Boolean, { nullable: false, description: 'Deletes a client' })
  @Authorized(['client', 'delete'])
  async deleteClient(@Arg('id', () => ID) id: string, @Ctx() ctx: NasAuthGraphQLContext) {
    const repository = ctx.connection.getRepository(Client)
    const { affected } = await repository.delete({ clientId: id })
    return (affected ?? 0) > 0
  }
}
