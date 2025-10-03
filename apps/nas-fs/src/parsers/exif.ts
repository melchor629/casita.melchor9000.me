import exifreader, { type ExpandedTags } from 'exifreader'
import type {
  ImageExifTags,
  ImageFileTags,
  ImageGpsTags,
  ImageTags,
} from '../models/exif.ts'

const mapFileTags = ({ file }: ExpandedTags): ImageFileTags | null => (file
  ? {
      // @ts-expect-error sometimes it returns an object like the others
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      fileType: file.FileType?.description ?? file.FileType ?? 'unknown',
      bitsPerSample: file['Bits Per Sample']?.description,
      width: file['Image Width']?.description,
      height: file['Image Height']?.description,
      components: file['Color Components']?.description,
      subsampling: file.Subsampling?.description,
    }
  : null)

const mapExifTags = ({ exif }: ExpandedTags): ImageExifTags | null => (exif
  ? {
      cameraMaker: exif.Make?.description,
      cameraModel: exif.Model?.description,
      orientation: exif.Orientation?.description,
      software: exif.Software?.description,
      artist: exif.Artist?.description,
      copyright: exif.Copyright?.description,
      exposureTime: exif.ExposureTime?.description,
      exposureMode: exif.ExposureMode?.description,
      aperture: (exif.FNumber ?? exif.ApertureValue)?.description,
      iso: exif.ISOSpeedRatings?.value,
      flash: exif.Flash?.description,
      focalLength: exif.FocalLength?.description,
      whiteBalance: exif.WhiteBalance?.description,
      lensMaker: exif.LensMake?.description,
      lensModel: exif.LensModel?.description,
    }
  : null)

const mapGpsTags = ({ gps }: ExpandedTags): ImageGpsTags | null => (gps
  ? {
      latitude: gps.Latitude ?? null,
      longitude: gps.Longitude ?? null,
      altitude: gps.Altitude ?? null,
    }
  : null)

const readExif = async (file: string): Promise<ImageTags> => {
  const tags = await exifreader.load(file, { async: true, expanded: true })
  delete tags.exif?.MakerNote
  delete tags.Thumbnail
  delete tags.jfif?.['JFIF Thumbnail']
  return Object.freeze({
    file: mapFileTags(tags),
    exif: mapExifTags(tags),
    gps: mapGpsTags(tags),
  })
}

export default readExif
