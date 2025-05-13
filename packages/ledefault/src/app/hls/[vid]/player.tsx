import { useSearchParams } from '@melchor629/nice-ssr'
import { clsx } from 'clsx'
import { useCallback, useLayoutEffect, useMemo, useState } from 'preact/hooks'
import 'shaka-player/dist/controls.css'
import type { Manifest } from './page'
import styles from './player.module.css'

export default function Player({ manifest }: { readonly manifest: Manifest }) {
  const [pendingToPlay, setPendingToPlay] = useState(true)
  const [video, setVideo] = useState<HTMLVideoElement | null>(null)
  const [player, setPlayer] = useState<shaka.Player | null>(null)
  const searchParams = useSearchParams()

  const onVideoPosterClick = useCallback(() => {
    video?.play()
      .then(() => setPendingToPlay(false))
      .catch((error: DOMException) => {
        console.error('Error code', error.name, 'object', error)
        alert(`Video cannot be played in this browser. (${error.name})`)
      })
  }, [video])

  useLayoutEffect(() => {
    if (!video) {
      return () => {}
    }

    let cleanupFn = () => {}
    // @ts-expect-error it is a CJS in fact
    import('shaka-player/dist/shaka-player.ui.js')
      .then(async (shaka: typeof globalThis.shaka) => {
        const player = new shaka.Player()
        const playerUi = new shaka.ui.Overlay(player, video.parentElement!, video)
        playerUi.configure({
          keyboardSeekDistance: 5,
          controlPanelElements: ['play_pause', 'time_and_duration', 'spacer', 'mute', 'volume', 'quality', 'playback_rate', 'fullscreen'],
          customContextMenu: true,
          contextMenuElements: ['save_video_frame', 'mute', 'statistics'],
          seekBarColors: {
            base: 'var(--color-primary-subtle-dark)',
            buffered: 'var(--color-primary-main-dark)',
            played: 'var(--color-primary-text-dark)',
          },
        })
        playerUi.setTextWatermark('Video Audio', {
          text: 'Lea',
          alpha: 1,
          color: 'white',
          displayDuration: 2,
          interval: 2,
          position: 'top-left',
          size: 24,
          skip: 0.5,
          transitionDuration: 0.5,
          type: 'static',
        })
        setPlayer(player)
        cleanupFn = () => {
          playerUi.destroy()
            .then(() => player.detach())
            .catch(() => {})
        }

        await player.attach(video)
      })
      .catch((error: shaka.util.Error) => {
        console.error('Error code', error.code, 'object', error)
        alert(`Video cannot be played in this browser. (${error.code})`)
      })
    return () => cleanupFn()
  }, [video])

  useLayoutEffect(() => {
    if (!player) {
      return
    }

    player.load(manifest.src.path, null, manifest.src.type)
      .catch((error: shaka.util.Error) => {
        console.error('Error code', error.code, 'object', error)
        alert(`Video cannot be played in this browser. (${error.code})`)
      })
  }, [player, manifest.src])

  return (
    <div class="w-dvw h-dvh flex justify-center items-center bg-black">
      <main
        class={clsx(
          'aspect-video relative',
          styles.llea,
        )}
      >
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={setVideo}
          class="video-js w-full h-full"
          preload="auto"
          poster={manifest.poster}
          autoplay={useMemo(() => !!searchParams.get('ap'), [searchParams])}
        />
        {pendingToPlay && (
          /* eslint-disable-next-line jsx-a11y/click-events-have-key-events */
          <div
            role="button"
            class={clsx(
              'absolute top-0 left-0 w-full h-full z-10',
              'text-white bg-primary-bg-dark/10',
              'cursor-pointer',
              'transition ease-in-out duration-150',
              'hover:bg-primary-bg-dark/25 hover:text-white/85',
            )}
            onClick={pendingToPlay ? onVideoPosterClick : undefined}
            tabIndex={-1}
          >
            {/* Play Circle (material Icons) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-12 h-12 absolute top-4 left-3"
              viewBox="0 -960 960 960"
              fill="currentColor"
            >
              <path d="m380-300 280-180-280-180v360ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
            </svg>
          </div>
        )}
      </main>
    </div>
  )
}
