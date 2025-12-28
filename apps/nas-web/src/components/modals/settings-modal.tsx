import { useCallback } from 'react'
// eslint-disable-next-line import-x/no-unresolved
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useSettingsContext } from '@/hooks/use-settings'
import { env } from '@/utils/config'
import { RadioButton, RadioButtonGroup } from '../core/radio-button-group'
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
  readonly onClose: () => void
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

  const onThemeChanged = useCallback((value: string) => update('theme', value as never), [update])
  const onHideFilesVisibilityClicked = useCallback(() => update('hidden', (v) => !v), [update])
  const onEntryViewTypeChanged = useCallback((value: string) => update('entryViewType', value as never), [update])
  const onShowThumbnailsVisibilityClicked = useCallback(() => update('showThumbnails', (v) => !v), [update])

  return (
    <Modal id="settings-modal" title="Settings" show={show} onClose={onClose}>
      <div className="text-center">
        <div className="mb-2">
          <div className="mb-1 select-none">Theme</div>
          <div className="btn-group btn-group-toggle btn-group-sm" role="group">
            <RadioButtonGroup color="secondary" name="theme" value={theme} onChange={onThemeChanged}>
              <RadioButton value="system" icon={<CircleHalfStrokeIcon />}>System</RadioButton>
              <RadioButton value="dark" icon={<MoonIcon />}>Dark</RadioButton>
              <RadioButton value="light" icon={<SunIcon />}>Light</RadioButton>
            </RadioButtonGroup>
          </div>
        </div>
        <div className="mb-2">
          <div className="mb-1 select-none">Item View Style</div>
          <RadioButtonGroup color="secondary" name="entryViewType" value={entryViewType} onChange={onEntryViewTypeChanged}>
            <RadioButton value="list" icon={<BarsIcon />}>List</RadioButton>
            <RadioButton value="grid" icon={<GridIcon />}>Grid</RadioButton>
          </RadioButtonGroup>
        </div>

        <div>
          <Switch
            id="toggle-hidden-files"
            checked={hidden}
            onChange={onHideFilesVisibilityClicked}
          >
            Show hidden files
          </Switch>
        </div>

        <div>
          <Switch
            id="toggle-thumbnails"
            checked={showThumbnails}
            onChange={onShowThumbnailsVisibilityClicked}
          >
            Show thumbnails
          </Switch>
        </div>

        <div
          className="text-text-secondary mt-3 select-none"
        >
          {`v${env.version} (${env.revision})`}
          {needRefresh && ' (New Version available!)'}
        </div>
        <div
          className="text-text-secondary mt-0.5 select-none"
        >
          {env.buildDate.toLocaleString()}
        </div>
      </div>
    </Modal>
  )
}
