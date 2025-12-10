import {
  memo,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { MediaInfo, MediaInfoTrack } from '../api/fs/mediainfo'
import { humanBytes, humanDuration } from '../utils/number-format'
import highlightCode from '../workers/code-highlighter'
import { Launch } from './icons'
import Modal from './modal-view'

type NullableTupleValues<T extends readonly [...unknown[]]> = (
  T extends readonly [...infer Item]
    ? [...(Item[0] | null | undefined)[]]
    : (
        T extends readonly [infer First, ...infer Rest]
          ? [First | null | undefined, ...NullableTupleValues<Rest>]
          : (T extends readonly [infer First] ? [First] : [])
      )
)

interface MediaInfoTrackPropertyMapper<T extends readonly [...string[]] = readonly [...string[]]> {
  keys: T
  name: string
  map?: (v: NullableTupleValues<T>) => string | false | null | undefined
}

const MediaInfoTrackView = memo(({
  properties,
  track,
}: { readonly track: MediaInfoTrack, readonly properties: MediaInfoTrackPropertyMapper[] }) => (
  <li>
    {`${track['@type']} #${track['@typeorder'] || '1'}`}
    <ul>
      {properties
        .map((property) => [
          property,
          property.keys.map((key) => track[key] as string | undefined),
        ] as const)
        .map(([property, values]) => [
          property,
          property.map ? property.map(values) : values.filter((val) => !!val).join(' '),
        ] as const)
        .filter(([, value]) => value)
        .map(([property, value]) => (
          <li key={property.keys.join(',')}>
            <b>{property.name}</b>
            {`: ${value}`}
          </li>
        ))}
    </ul>
  </li>
))

const audioProperties: MediaInfoTrackPropertyMapper[] = [
  {
    keys: ['Format', 'Format_Version', 'Format_Profile', 'Format_AdditionalFeatures'],
    name: 'Codec',
    map([format, version, profile, additionalFeatures]) {
      if (!format) {
        return null
      }

      return `${format} ${version || ''} ${profile || ''} ${additionalFeatures || ''}`
        .replaceAll(/ +/g, ' ')
    },
  },
  {
    keys: ['BitRate', 'BitRate_Mode'],
    name: 'Bitrate',
    map: ([v, b]) => v && `${parseFloat(v) / 1000}Kbps ${b || ''}`.trimEnd(),
  },
  {
    keys: ['Compression_Mode'],
    name: 'Is Lossless?',
    map: ([v]) => v && (v.toLowerCase() === 'lossless' ? 'Yes' : 'No'),
  },
  {
    keys: ['SamplingRate'],
    name: 'Sample Rate',
    map: ([v]) => v && `${parseFloat(v) / 1000}KHz`,
  },
  { keys: ['BitDepth', 'Bit depth'], name: 'Bit Depth' },
  { keys: ['Channels', 'Channel(s)'], name: 'Channels' },
  { keys: ['Language'], name: 'Language' },
  { keys: ['Title'], name: 'Name' },
  {
    keys: ['StreamSize'],
    name: 'Size',
    map: ([v]) => v && humanBytes(parseFloat(v), true),
  },
]

const videoProperties: MediaInfoTrackPropertyMapper[] = [
  { keys: ['Format'], name: 'Codec' },
  {
    keys: ['BitRate'] as const,
    name: 'Bitrate',
    map: ([v]) => v && `${parseFloat(v) / 1000}Kbps`,
  },
  { keys: ['FrameRate', 'Frame rate'], name: 'FPS' },
  { keys: ['Width'], name: 'Width' },
  { keys: ['Height'], name: 'Height' },
  {
    keys: ['colour_primaries'],
    name: 'HDR',
    map: (v) => (v.includes('BT.2020') ? 'yes' : 'no'),
  },
  { keys: ['BitDepth'], name: 'Bit depth' },
  { keys: ['Title'], name: 'Name' },
  {
    keys: ['StreamSize'],
    name: 'Size',
    map: ([v]) => v && humanBytes(parseFloat(v), true),
  },
]

const subtitleProperties: MediaInfoTrackPropertyMapper[] = [
  { keys: ['Language'], name: 'Language' },
  { keys: ['Title'], name: 'Name' },
]

const MediaInfoChaptersView = memo(({ value }: { readonly value: MediaInfoTrack }) => (
  <li>
    Chapters
    <ul>
      {Object.entries(value.extra!)
        .map(([time, chapter]) => [
          time.split('_').slice(1),
          chapter.split(':').slice(1).join(':'),
        ] as const)
        .map(([time, chapter]) => (
          <li key={time.join(':')}>
            <code>{`${time[0]}:${time[1]}:${time[2]}.${time[3]}`}</code>
            {': '}
            {chapter}
          </li>
        ))}
    </ul>
  </li>
))

export default function MediaInfoView({ mediainfo }: { readonly mediainfo: MediaInfo }) {
  const [showRaw, setShowRaw] = useState(false)
  const rawMediainfo = useMemo(() => JSON.stringify(mediainfo, undefined, 2), [mediainfo])
  const [highlightedMediainfo, setHighlightedMediainfo] = useState('')
  const general = useMemo(
    () => mediainfo.media.track.find((track) => track['@type'] === 'General')!,
    [mediainfo.media.track],
  )
  const videos = useMemo(
    () => mediainfo.media.track.filter((track) => track['@type'] === 'Video'),
    [mediainfo.media.track],
  )
  const audios = useMemo(
    () => mediainfo.media.track.filter((track) => track['@type'] === 'Audio'),
    [mediainfo.media.track],
  )
  const subtitles = useMemo(
    () => mediainfo.media.track.filter((track) => track['@type'] === 'Text'),
    [mediainfo.media.track],
  )
  const chapters = useMemo(
    () => mediainfo.media.track.filter((track) => track['@type'] === 'Menu'),
    [mediainfo.media.track],
  )

  useEffect(() => {
    const abort = new AbortController()
    highlightCode({
      code: rawMediainfo,
      lang: 'json',
    }, abort.signal)
      .then((res) => res.success && setHighlightedMediainfo(res.result.value))
      .catch(() => {})

    return () => abort.abort()
  }, [rawMediainfo])

  return (
    <>
      <div className="d-flex mb-2">
        <h3 className="mb-0">Media info</h3>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary ms-3"
          onClick={() => setShowRaw(true)}
          aria-label="Expand media info"
        >
          <Launch height="16px" />
        </button>
      </div>
      <ul>
        <li>
          <b>Duration</b>
          {': '}
          {humanDuration(parseFloat(general.Duration))}
        </li>
        {videos.map((video) => (
          <MediaInfoTrackView
            key={video['@typeorder'] || '1'}
            track={video}
            properties={videoProperties}
          />
        ))}
        {audios.map((audio) => (
          <MediaInfoTrackView
            key={audio['@typeorder'] || '1'}
            track={audio}
            properties={audioProperties}
          />
        ))}
        {subtitles.map((subtitle) => (
          <MediaInfoTrackView
            key={subtitle['@typeorder'] || '1'}
            track={subtitle}
            properties={subtitleProperties}
          />
        ))}
        {!!chapters[0]?.extra && <MediaInfoChaptersView value={chapters[0]} />}
      </ul>

      <Modal
        id="mediainfo-raw"
        title="Complete Media Info"
        size="lg"
        show={showRaw}
        onClose={() => setShowRaw(false)}
      >
        <pre>
          {}
          <code dangerouslySetInnerHTML={{ __html: highlightedMediainfo || rawMediainfo }} />
        </pre>
      </Modal>
    </>
  )
}
