import type { FileMetadata } from './file'
import type { Metadata } from './metadata'

export interface DirectoryMetadata extends Metadata<'dir'> {
  contents: Array<DirectoryMetadata | FileMetadata>
}
