import type { ApiClient } from '../api-client'
import baseUrl from '../base-url'

type FSEventType = 'add' | 'change' | 'unlink' | 'addDir' | 'unlinkDir' | 'thumbnail'

interface FSEvent {
  path: string
}

type EventListeners = Record<FSEventType, (message: FSEvent) => void> & {
  open: () => void
  error: (error: unknown) => void
  message: (message: unknown) => void
}

const fsEventsCache = new Map<string, FSEvents>()

export default class FSEvents {
  #source: EventSource | null = null
  readonly #urlFactory: () => Promise<string>

  private eventListeners = Object.freeze({
    add: [],
    addDir: [],
    change: [],
    error: [],
    message: [],
    open: [],
    thumbnail: [],
    unlink: [],
    unlinkDir: [],
  } as { [K in keyof EventListeners]: Array<EventListeners[K]> })

  static createForModule(module: string, apiClient: ApiClient) {
    let fsEvents = fsEventsCache.get(module)

    if (!fsEvents) {
      fsEvents = new FSEvents(
        async () => `${baseUrl}${module}/fs-changes?token=${await apiClient.getAccessToken()}`,
      )
      fsEventsCache.set(module, fsEvents)
    }

    return fsEvents
  }

  constructor(urlFactory: () => Promise<string>) {
    this.#urlFactory = urlFactory
    void this.connect()
  }

  get state() {
    if (this.#source === null) {
      return 'connecting'
    }

    switch (this.#source.readyState) {
      case EventSource.OPEN:
        return 'open'
      case EventSource.CLOSED:
        return 'closed'
      case EventSource.CONNECTING:
        return 'connecting'
      default:
        return 'unknown'
    }
  }

  reconnect() {
    if (this.state !== 'closed') {
      throw new Error('Event Source is not closed')
    }

    if (this.#source) {
      this.#source.close()
    }

    void this.connect()
  }

  close() {
    if (!this.#source) {
      return
    }

    this.#source.close()
  }

  on<TEvent extends keyof EventListeners>(event: TEvent, listener: EventListeners[TEvent]): this {
    if (this.listenerCount(event) === 0 && !['open', 'error', 'message'].includes(event)) {
      this.#source?.addEventListener(event, this.handleEvent)
    }
    this.eventListeners[event].push(listener)
    return this
  }

  off<TEvent extends keyof EventListeners>(event: TEvent, listener: EventListeners[TEvent]): this {
    if (this.listenerCount(event) === 1 && !['open', 'error', 'message'].includes(event)) {
      this.#source?.removeEventListener(event, this.handleEvent)
    }

    const idx = this.eventListeners[event].indexOf(listener)
    if (idx !== -1) {
      this.eventListeners[event].slice(idx, 1)
    }

    return this
  }

  private listenerCount<TEvent extends keyof EventListeners>(event: TEvent) {
    return this.eventListeners[event].length ?? 0
  }

  private emit<TEvent extends keyof EventListeners>(event: TEvent, ...payload: Parameters<EventListeners[TEvent]>) {
    // @ts-expect-error ??¿
    this.eventListeners[event].forEach((cbk) => cbk(...payload))
  }

  private readonly handleEvent = (event: MessageEvent<string>) => {
    const data = JSON.parse(event.data) as FSEvent
    this.emit(event.type as FSEventType, data)
  }

  private async connect() {
    const url = await this.#urlFactory()
    this.#source = new EventSource(url)
    this.#source.addEventListener('open', () => this.emit('open'))
    this.#source.addEventListener('error', (ev) => this.emit('error', (ev as ErrorEvent).error))
    this.#source.addEventListener('message', (ev) => this.emit('message', JSON.parse(ev.data as string) as unknown))
    Object.keys(this.eventListeners)
      .filter((key) => !['open', 'error', 'message'].includes(key))
      .forEach((key) => this.#source!.addEventListener(key, this.handleEvent))
  }
}
