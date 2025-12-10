import { useCallback } from 'react'
// eslint-disable-next-line import-x/no-unresolved
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useSettingsContext } from '@/hooks/use-settings'
import { env } from '@/utils/config'
import { Switch } from '../form'
import {
  Contrast as CircleHalfStrokeIcon,
  DarkMode as MoonIcon,
  GridView as GridIcon,
  LightMode as SunIcon,
  Menu as BarsIcon,
} from '../icons'
import Modal from '../modal-view'

interface SettingsModalProps {
  readonly show?: boolean
  readonly onClose?: () => void
}

export default function SettingsModal({
  onClose,
  show,
}: SettingsModalProps) {
  const {
    update,
    values: {
      entryViewType, hidden, showThumbnails, theme,
    },
  } = useSettingsContext()
  const {
    needRefresh: [needRefresh],
  } = useRegisterSW()

  const onSystemThemeClicked = useCallback(() => update('theme', 'system'), [update])
  const onDarkThemeClicked = useCallback(() => update('theme', 'dark'), [update])
  const onLightThemeClicked = useCallback(() => update('theme', 'light'), [update])
  const onHideFilesVisibilityClicked = useCallback(() => update('hidden', (v) => !v), [update])
  const onListEntryViewTypeClicked = useCallback(() => update('entryViewType', 'list'), [update])
  const onGridEntryViewTypeClicked = useCallback(() => update('entryViewType', 'grid'), [update])
  const onShowThumbnailsVisibilityClicked = useCallback(() => update('showThumbnails', (v) => !v), [update])

  return (
    <Modal id="settings-modal" title="Settings" show={show} onClose={onClose}>
      <div className="text-center">
        <div className="mb-2">
          <div className="mb-1 user-select-none">Theme</div>
          <div className="btn-group btn-group-toggle btn-group-sm" role="group">
            <input
              type="radio"
              name="theme"
              id="theme-system"
              className="btn-check"
              checked={theme === 'system'}
              onChange={onSystemThemeClicked}
            />
            <label
              className={`btn btn-outline-primary ${theme === 'system' ? 'active' : ''}`}
              htmlFor="theme-system"
            >
              <CircleHalfStrokeIcon height={14} />
              {' '}
              System
            </label>

            <input
              type="radio"
              name="theme"
              id="theme-dark"
              className="btn-check"
              checked={theme === 'dark'}
              onChange={onDarkThemeClicked}
            />
            <label
              className={`btn btn-outline-primary ${theme === 'dark' ? 'active' : ''}`}
              htmlFor="theme-dark"
            >
              <MoonIcon height={14} />
              {' '}
              Dark
            </label>

            <input
              type="radio"
              name="theme"
              id="theme-light"
              className="btn-check"
              checked={theme === 'light'}
              onChange={onLightThemeClicked}
            />
            <label
              className={`btn btn-outline-primary ${theme === 'light' ? 'active' : ''}`}
              htmlFor="theme-light"
            >
              <SunIcon height={14} />
              {' '}
              Light
            </label>
          </div>
        </div>
        <div className="mb-2">
          <div className="mb-1 user-select-none">Item View Style</div>
          <div className="btn-group btn-group-toggle btn-group-sm">
            <input
              type="radio"
              name="entryViewType"
              id="entry-view-type-list"
              className="btn-check"
              checked={entryViewType === 'list'}
              onChange={onListEntryViewTypeClicked}
            />
            <label
              className={`btn btn-outline-primary ${entryViewType === 'list' ? 'active' : ''}`}
              htmlFor="entry-view-type-list"
            >
              <BarsIcon height={14} />
              {' '}
              List
            </label>

            <input
              type="radio"
              name="entryViewType"
              id="entry-view-type-grid"
              className="btn-check"
              checked={entryViewType === 'grid'}
              onChange={onGridEntryViewTypeClicked}
            />
            <label
              className={`btn btn-outline-primary ${entryViewType === 'grid' ? 'active' : ''}`}
              htmlFor="entry-view-type-grid"
            >
              <GridIcon height={14} />
              {' '}
              Grid
            </label>
          </div>
        </div>

        <div>
          <Switch
            id="toggle-hidden-files"
            className="d-inline-block"
            checked={hidden}
            onChange={onHideFilesVisibilityClicked}
          >
            Show hidden files
          </Switch>
        </div>

        <div>
          <Switch
            id="toggle-thumbnails"
            className="d-inline-block"
            checked={showThumbnails}
            onChange={onShowThumbnailsVisibilityClicked}
          >
            Show thumbnails
          </Switch>
        </div>

        <div
          className="text-muted mt-3 no-select"
        >
          {`v${env.version} (${env.revision})`}
          {needRefresh && ' (New Version available!)'}
        </div>
        <div
          className="text-muted mt-1 no-select"
        >
          {env.buildDate.toLocaleString()}
        </div>
      </div>
    </Modal>
  )
}
