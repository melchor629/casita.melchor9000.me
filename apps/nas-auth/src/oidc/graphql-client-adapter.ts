import type { Adapter, AdapterPayload } from 'oidc-provider'
import { getClient } from '../queries/index.ts'

export default class GraphQLClientAdapter implements Adapter {
  /**
   * Finds the payload for the given element id
   * @param id The ID of the element
   * @returns The payload of the element if found
   */
  async find(id: string): Promise<AdapterPayload | undefined | void> {
    return await getClient(id) ?? undefined
  }

  upsert(): Promise<undefined | void> {
    throw new Error('Method not implemented.')
  }

  findByUserCode(): Promise<AdapterPayload | undefined | void> {
    throw new Error('Method not implemented.')
  }

  findByUid(): Promise<AdapterPayload | undefined | void> {
    throw new Error('Method not implemented.')
  }

  consume(): Promise<undefined | void> {
    throw new Error('Method not implemented.')
  }

  destroy(): Promise<undefined | void> {
    throw new Error('Method not implemented.')
  }

  revokeByGrantId(): Promise<undefined | void> {
    throw new Error('Method not implemented.')
  }
}
