import { EventEmitter } from 'node:events'
import { Redis } from 'ioredis'
import parentLogger from '../logger.ts'
import type { SubscriptorListener } from './subscriptor-listener.ts'

const logger = parentLogger.child({ module: 'cache.redis-subscriptor-listener' })

export default class RedisSubscriptorListener extends EventEmitter implements SubscriptorListener {
  private readonly client: Redis
  private readonly key: (key: string) => string

  constructor(
    client: Redis,
    key: (key: string) => string,
    signal?: AbortSignal,
  ) {
    super()
    this.client = client
    this.key = key
    this.client.on('message', this.onMessageReceived)
    this.client.on('pmessage', this.onPMessageReceived)

    signal?.addEventListener('abort', () => {
      this.dispose().catch(error => this.emit('error', error))
    }, false)
  }

  public async subscribe(...channels: string[]): Promise<void> {
    const mappedChannels = channels.map(this.key)
    logger.trace({ op: 'subscribe', channels: mappedChannels }, 'Subscribing to new channels')
    await this.client.subscribe(...mappedChannels)
  }

  public async unsubscribe(...channels: string[]): Promise<void> {
    const mappedChannels = channels.map(this.key)
    logger.trace({ op: 'unsubscribe', channels: mappedChannels }, 'Unsubscribing of channels')
    await this.client.unsubscribe(...mappedChannels)
  }

  public async patternSubscribe(...channelPatterns: string[]): Promise<void> {
    const mappedChannelPatterns = channelPatterns.map(this.key)
    logger.trace(
      { op: 'patternSubscribe', channelPatterns: mappedChannelPatterns },
      'Subscribing to new channel patterns',
    )
    await this.client.psubscribe(...mappedChannelPatterns)
  }

  public async patternUnsubscribe(...channelPatterns: string[]): Promise<void> {
    const mappedChannelPatterns = channelPatterns.map(this.key)
    logger.trace(
      { op: 'patternUnsubscribe', channelPatterns: mappedChannelPatterns },
      'Unubscribing of channel patterns',
    )
    await this.client.punsubscribe(...channelPatterns)
  }

  public async dispose(): Promise<void> {
    this.client.off('message', this.onMessageReceived)
    this.client.off('pmessage', this.onPMessageReceived)
    await this.client.quit()
  }

  private onMessageReceived = (channel: string, value: string) => {
    this.emit('message', channel.replace(this.key(''), ''), value)
  }

  private onPMessageReceived = (pattern: string, channel: string, value: string) => {
    this.emit('patternMessage', pattern.replace(this.key(''), ''), channel.replace(this.key(''), ''), value)
  }
}
