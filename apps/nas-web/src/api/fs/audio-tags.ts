export interface Rating {
  /**
     * Rating source, could be an e-mail address
     */
  source?: string
  /**
     * Rating [0..1]
     */
  rating: number
}

export interface CommonTags {
  track: {
    no: number
    of: number
  }
  disk: {
    no: number
    of: number
  }
  /**
     * Release year
     */
  year?: number
  /**
     * Track title
     */
  title?: string
  /**
     * Track, maybe several artists written in a single string.
     */
  artist?: string
  /**
     * Track artists, aims to capture every artist in a different string.
     */
  artists?: string[]
  /**
     * Track album artists
     */
  albumartist?: string
  /**
     * Album title
     */
  album?: string
  /**
     * Release data
     */
  date?: string
  /**
     * Original release date
     */
  originaldate?: string
  /**
     * Original release yeat
     */
  originalyear?: number
  /**
     * List of comments
     */
  comment?: string[]
  /**
     * Genre
     */
  genre?: string[]
  /**
     * Track composer
     */
  composer?: string[]
  /**
     * Lyrics
     */
  lyrics?: string[]
  /**
     * Album title, formatted for alphabetic ordering
     */
  albumsort?: string
  /**
     * Track title, formatted for alphabetic ordering
     */
  titlesort?: string
  /**
     * The canonical title of the work
     */
  work?: string
  /**
     * Track artist, formatted for alphabetic ordering
     */
  artistsort?: string
  /**
     * Album artist, formatted for alphabetic ordering
     */
  albumartistsort?: string
  /**
     * Composer(s), formatted for alphabetic ordering
     */
  composersort?: string[]
  /**
     * Lyricist(s)
     */
  lyricist?: string[]
  /**
     * Writer(s)
     */
  writer?: string[]
  /**
     * Conductor(s)
     */
  conductor?: string[]
  /**
     * Remixer(s)
     */
  remixer?: string[]
  /**
     * Arranger(s)
     */
  arranger?: string[]
  /**
     * Engineer(s)
     */
  engineer?: string[]
  /**
     * Producer(s)
     */
  producer?: string[]
  /**
     * Mix-DJ(s)
     */
  djmixer?: string[]
  /**
     * Mixed by
     */
  mixer?: string[]
  technician?: string[]
  label?: string[]
  grouping?: string[]
  subtitle?: string[]
  discsubtitle?: string[]
  totaltracks?: string
  totaldiscs?: string
  compilation?: string
  rating?: Rating[]
  bpm?: number
  /**
     * Keywords to reflect the mood of the audio, e.g. 'Romantic' or 'Sad'
     */
  mood?: string
  /**
     * Release format, e.g. 'CD'
     */
  media?: string
  /**
     * Release catalog number(s)
     */
  catalognumber?: string[]
  /**
     * TV show title
     */
  tvShow?: string
  /**
     * TV show title, formatted for alphabetic ordering
     */
  tvShowSort?: string
  /**
     * TV season title sequence number
     */
  tvSeason?: number
  /**
     * TV Episode sequence number
     */
  tvEpisode?: number
  /**
     * TV episode ID
     */
  tvEpisodeId?: string
  /**
     * TV network
     */
  tvNetwork?: string
  podcast?: string
  podcasturl?: string
  releasestatus?: string
  releasetype?: string[]
  releasecountry?: string
  script?: string
  language?: string
  copyright?: string
  license?: string
  encodedby?: string
  encodersettings?: string
  gapless?: boolean
  barcode?: string
  isrc?: string[]
  asin?: string
  musicbrainz_recordingid?: string
  musicbrainz_trackid?: string
  musicbrainz_albumid?: string
  musicbrainz_artistid?: string[]
  musicbrainz_albumartistid?: string[]
  musicbrainz_releasegroupid?: string
  musicbrainz_workid?: string
  musicbrainz_trmid?: string
  musicbrainz_discid?: string
  acoustid_id?: string
  acoustid_fingerprint?: string
  musicip_puid?: string
  musicip_fingerprint?: string
  website?: string
  'performer:instrument'?: string[]
  averageLevel?: number
  peakLevel?: number
  notes?: string[]
  originalalbum?: string
  originalartist?: string
  discogs_artist_id?: number[]
  discogs_release_id?: number
  discogs_label_id?: number
  discogs_master_release_id?: number
  discogs_votes?: number
  discogs_rating?: number
  /**
     * Track gain in dB; eg: "-7.03 dB"
     */
  replaygain_track_gain?: string
  /**
     * Track peak [0..1]
     */
  replaygain_track_peak?: number
}

export interface Tag {
  id: string
  value: unknown
}

export interface NativeTags {
  [tagType: string]: Tag[]
}

export interface AudioTags extends CommonTags {
  rawTags: NativeTags
}
