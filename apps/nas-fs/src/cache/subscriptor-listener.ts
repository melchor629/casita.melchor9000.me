export type MessageCallback = (channel: string, value: string) => void
export type PatternMessageCallback = (pattern: string, channel: string, value: string) => void

export interface SubscriptorListener {
  subscribe(channel: string): Promise<void>
  subscribe(...channels: string[]): Promise<void>
  unsubscribe(): Promise<void>
  unsubscribe(channel: string): Promise<void>
  unsubscribe(...channels: string[]): Promise<void>

  patternSubscribe(channelPattern: string): Promise<void>
  patternSubscribe(...channelPatterns: string[]): Promise<void>
  patternUnsubscribe(): Promise<void>
  patternUnsubscribe(channelPattern: string): Promise<void>
  patternUnsubscribe(...channelPatterns: string[]): Promise<void>

  on(event: 'message', listener: MessageCallback): void
  on(event: 'patternMessage', listener: PatternMessageCallback): void
  once(event: 'message', listener: MessageCallback): void
  once(event: 'patternMessage', listener: PatternMessageCallback): void
  off(event: 'message', listener: MessageCallback): void
  off(event: 'patternMessage', listener: PatternMessageCallback): void

  dispose(): Promise<void>
}
