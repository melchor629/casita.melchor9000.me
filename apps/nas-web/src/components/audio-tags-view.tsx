import capitalize from 'lodash-es/capitalize'
import { memo } from 'react'
import type { AudioTags, CommonTags } from '../api/fs/audio-tags'
import Text from './core/text'

const tagKeyToHuman = (tagKey: string) => ({
  albumartist: 'Album Artist',
  replaygain_track_gain: 'ReplayGain Track Gain',
  replaygain_track_peak: 'ReplayGain Track Peak',
  replaygain_album_gain: 'ReplayGain Album Gain',
  replaygain_album_peak: 'ReplayGain Album Peak',
  encodedby: 'Encoded by',
} as { [index: string]: string | undefined })[tagKey.toLowerCase()] ?? capitalize(tagKey)

const AudioTagValueView = memo(({ value }: { readonly value: CommonTags[keyof CommonTags] }) => {
  if (value == null) {
    return null
  }

  if (Array.isArray(value)) {
    return <>{value.map((value) => typeof value === 'object' ? `${value.rating} (${value.source ?? 'unkown'})` : value).join(', ')}</>
  }

  if (typeof value === 'string') {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{value}</>
  }

  if (typeof value === 'object') {
    if ('no' in value) {
      if (value.no != null && value.of == null) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <>{value.no}</>
      } if (value.no != null && 'of' in value && value.of !== null) {
        return (
          <>
            {value.no}
            /
            {value.of}
          </>
        )
      } if (value.no === null) {
        return <>NA</>
      }
    }
  }

  return <>{JSON.stringify(value, undefined, 2)}</>
})

export default function AudioTagsView({ tags: { rawTags, ...tags } }: { readonly tags: AudioTags }) {
  const liStyle: React.CSSProperties = { wordBreak: 'break-all' }
  return (
    <div>
      <Text size="h3" className="mb-2">Track metadata</Text>
      <ul>
        {Object.entries(tags).toSorted(([ak], [bk]) => ak.localeCompare(bk)).map(([key, value]) => (
          <li key={key} style={liStyle}>
            <b>{tagKeyToHuman(key)}</b>
            {': '}
            <AudioTagValueView value={value as CommonTags[keyof CommonTags]} />
          </li>
        ))}
      </ul>
    </div>
  )
}
