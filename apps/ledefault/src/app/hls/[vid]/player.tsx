import { useSearchParams } from '@melchor629/nice-ssr'
import { PlayCircle } from '@melchor629/ui/icons'
import { clsx } from 'clsx'
import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import 'shaka-player/dist/controls.css'
import type Shaka from 'shaka-player/dist/shaka-player.ui.js'
import type { Manifest } from './page'
import styles from './player.module.css'

export default function Player({ manifest }: { readonly manifest: Manifest }) {
  const [pendingToPlay, setPendingToPlay] = useState(true)
  const [video, setVideo] = useState<HTMLVideoElement | null>(null)
  const [player, setPlayer] = useState<Shaka.Player | null>(null)
  const searchParams = useSearchParams()

  const onVideoPosterClick = useCallback(() => {
    video
      ?.play()
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
    import('shaka-player/dist/shaka-player.ui.js')
      .then(async ({ default: shaka }) => {
        const player = new shaka.Player()
        const playerUi = new shaka.ui.Overlay(player, video.parentElement!, video)
        playerUi.configure({
          enableTooltips: false,
          keyboardSeekDistance: 5,
          controlPanelElements: [
            'play_pause',
            'time_and_duration',
            'spacer',
            'mute',
            'volume',
            'quality',
            'playback_rate',
            'cast',
            'fullscreen',
          ],
          customContextMenu: true,
          contextMenuElements: ['save_video_frame', 'mute', 'statistics'],
          seekBarColors: {
            adBreaks: 'red',
            base: 'var(--color-text-secondary)',
            buffered: 'var(--color-text-main)',
            played: 'var(--color-primary-main)',
            chapters: 'var(--color-secondary-main)',
          },
        } satisfies Partial<ReturnType<(typeof playerUi)['getConfiguration']>>)
        setPlayer(player)
        cleanupFn = () => {
          playerUi
            .destroy()
            .then(() => player.detach())
            .catch(() => {})
        }

        await player.attach(video)
      })
      .catch((error: Shaka.util.Error) => {
        console.error('Error code', error.code, 'object', error)
        alert(`Video cannot be played in this browser. (${error.code})`)
      })
    return () => cleanupFn()
  }, [video])

  useLayoutEffect(() => {
    if (!player) {
      return
    }

    player.load(manifest.src.path, null, manifest.src.type).catch((error: Shaka.util.Error) => {
      console.error('Error code', error.code, 'object', error)
      alert(`Video cannot be played in this browser. (${error.code})`)
    })
  }, [player, manifest.src])

  return (
    <div className="flex h-dvh w-dvw items-center justify-center bg-black scheme-dark">
      <main className={clsx('aspect-video relative', styles.llea)}>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={setVideo}
          className="video-js size-full"
          preload="auto"
          poster={manifest.poster}
          autoPlay={useMemo(() => !!searchParams.get('ap'), [searchParams])}
        />
        {pendingToPlay && (
          <button
            className={clsx(
              'absolute top-0 left-0 w-full h-full z-10',
              'text-white bg-black/10',
              'cursor-pointer',
              'transition ease-in-out duration-150',
              'hover:bg-black/30 hover:text-white/85',
            )}
            onClick={pendingToPlay ? onVideoPosterClick : undefined}
            tabIndex={-1}
          >
            {/* Play Circle (material Icons) */}
            <PlayCircle className="absolute top-4 left-3 text-5xl" />
          </button>
        )}
      </main>
    </div>
  )
}
