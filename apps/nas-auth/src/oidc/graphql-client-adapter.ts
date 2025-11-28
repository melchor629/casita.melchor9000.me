import type { Adapter, AdapterPayload } from 'oidc-provider'
import { getClient } from '../queries/index.ts'

export default class GraphQLClientAdapter implements Adapter {
  /**
   * Finds the payload for the given element id
   * @param id The ID of the element
   * @returns The payload of the element if found
   */
  async find(id: string): Promise<AdapterPayload | undefined> {
    return await getClient(id) ?? undefined
  }

  upsert(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findByUserCode(): Promise<AdapterPayload | undefined> {
    throw new Error('Method not implemented.')
  }

  findByUid(): Promise<AdapterPayload | undefined> {
    throw new Error('Method not implemented.')
  }

  consume(): Promise<undefined> {
    throw new Error('Method not implemented.')
  }

  destroy(): Promise<undefined> {
    throw new Error('Method not implemented.')
  }

  revokeByGrantId(): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
