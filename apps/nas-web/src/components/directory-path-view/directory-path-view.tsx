import { TextInput } from '@melchor629/ui'
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router'
import * as fs from '@/api/fs'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import useApiClient from '@/hooks/use-api-client'
import * as path from '@/utils/path'
import DirectoryEntries from './directory-entries'

interface DirectoryPathViewProps {
  readonly module: string
  readonly metadata: DirectoryMetadata
  readonly hidden?: boolean
  readonly selectedElements: Array<DirectoryMetadata | FileMetadata>
  readonly setSelectedElements: React.Dispatch<React.SetStateAction<Array<DirectoryMetadata | FileMetadata>>>
}

const localeIncludes = (a: string, b: string, options?: Intl.CollatorOptions) => {
  const collator = new Intl.Collator(undefined, options)
  for (let i = 0; i <= a.length - b.length; i += 1) {
    const suba = a.slice(i, i + b.length)
    const comparison = collator.compare(suba, b)
    if (!comparison) {
      return true
    }
  }

  return false
}

export default function DirectoryPathView({
  hidden,
  metadata,
  module,
  selectedElements,
  setSelectedElements,
}: DirectoryPathViewProps) {
  const navigate = useNavigate()
  const apiClient = useApiClient()
  const [filter, setFilter] = useState('')
  const entriesDivRef = useRef<HTMLDivElement>(null)
  const isRoot = metadata.path === '/'
  const entries = useMemo(() => {
    let e = [...metadata.contents]
    if (!hidden) {
      e = e.filter((entry) => !entry.hidden)
    }

    if (filter.length > 0) {
      e = e.filter((entry) => localeIncludes(
        path.basename(entry.path),
        filter,
        { sensitivity: 'base', usage: 'search', ignorePunctuation: true },
      ))
    }

    if (!isRoot) {
      // Contains fake data
      const parentPath: DirectoryMetadata = {
        type: 'dir',
        contents: [],
        hidden: false,
        path: path.dirname(metadata.path),
        realPath: path.dirname(metadata.path),
        stat: metadata.stat,
      }
      e.unshift(parentPath)
    }

    return e.sort((a, b) => (
      a.type.localeCompare(b.type, undefined, { sensitivity: 'base' })
                || a.path.localeCompare(b.path, undefined, { sensitivity: 'base' })
    ))
  }, [hidden, filter, isRoot, metadata.contents, metadata.path, metadata.stat])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilter('')
    entriesDivRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [module, metadata.path])

  useEffect(() => {
    entriesDivRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [filter])

  const onEntryMove = useCallback((
    entry: DirectoryMetadata | FileMetadata,
    dest: DirectoryMetadata,
  ) => (
    void fs.move(apiClient, module, entry.path, path.join(dest.path, path.basename(entry.path)))
  ), [apiClient, module])

  const onEntryOpen = useCallback((entry: DirectoryMetadata | FileMetadata) => (
    void navigate(path.join('/', module, fs.sanitizePathForUrl(entry.path)))
  ), [navigate, module])

  const onEntrySelected = useCallback((
    entry: DirectoryMetadata | FileMetadata,
    multi?: boolean,
  ) => (
    multi ? setSelectedElements((s) => [...s, entry]) : setSelectedElements([entry])
  ), [setSelectedElements])

  const onEntryDeselected = useCallback((entry: DirectoryMetadata | FileMetadata) => {
    setSelectedElements((s) => {
      const entryPos = s.findIndex((e) => e.path === entry.path)
      const pre = s.slice(0, entryPos)
      const post = s.slice(entryPos + 1)
      return [...pre, ...post]
    })
  }, [setSelectedElements])

  const onEntryRangeSelect = useCallback((endRange: number | DirectoryMetadata | FileMetadata) => {
    setSelectedElements((currentSelection) => {
      if (currentSelection.length === 0) {
        return currentSelection
      }

      const startRangePos = entries.indexOf(currentSelection[0])
      const endRangePos = typeof endRange === 'number' ? endRange : entries.indexOf(endRange)
      const selectedItems: Array<DirectoryMetadata | FileMetadata> = []
      if (endRangePos < startRangePos) {
        for (let i = startRangePos; i >= endRangePos; i -= 1) {
          selectedItems.push(entries[i])
        }
      } else if (endRangePos > startRangePos) {
        for (let i = startRangePos; i <= endRangePos; i += 1) {
          selectedItems.push(entries[i])
        }
      } else {
        selectedItems.push(entries[startRangePos])
      }

      return selectedItems
    })
  }, [entries, setSelectedElements])

  const onUnselectAll = useCallback(() => setSelectedElements((a) => a.length ? [] : a), [setSelectedElements])

  return (
    <>
      <div className="mt-2 mb-6">
        <TextInput
          type="text"
          size="small"
          value={filter}
          onChange={useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            setFilter(e.target.value)
          }, [])}
          placeholder="Filter by name"
          name="directory-list-filter"
          autoComplete="off"
        />
      </div>

      {entries.length > 0
        ? (
          <DirectoryEntries
            ref={entriesDivRef}
            isRoot={isRoot}
            module={module}
            metadata={metadata}
            entries={entries}
            selectedElements={selectedElements}
            onEntryMove={onEntryMove}
            onEntryOpen={onEntryOpen}
            onEntrySelected={onEntrySelected}
            onEntryDeselected={onEntryDeselected}
            onEntryRangeSelect={onEntryRangeSelect}
            onUnselectAll={onUnselectAll}
          />
          )
        : (
          <div className="text-center text-text-secondary">
            {filter.length === 0 ? 'This folder is empty' : 'No entries match the filter'}
          </div>
          )}
    </>
  )
}
