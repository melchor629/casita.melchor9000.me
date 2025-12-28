import React, {
  memo, useCallback, useEffect, useMemo, useState,
} from 'react'
import { useAuth } from 'react-oidc-context'
import { Link, useLocation, useNavigation } from 'react-router'
import { useTokenInfo } from '@/hooks/use-token-info'
import { env } from '@/utils/config'
import Button from '../core/button'
import {
  Apps as AppsIcon,
  Home as HomeIcon,
  MiscellaneousServices as MiscellaneousServicesIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from '../icons'
import JobsModal from '../jobs'
import { Spinner } from '../loaders'
import SettingsModal from '../modals/settings-modal'
import AppMenuContainer from './app-menu-container'
import AppMenuLink from './app-menu-link'

const NavBar = memo(() => {
  const location = useLocation()
  const { state } = useNavigation()
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showChangeApp, setShowChangeApp] = useState(false)
  const [showJobsModal, setShowJobsModal] = useState(false)
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { removeUser } = useAuth()
  const tokenInfo = useTokenInfo()
  const apps = useMemo(() => {
    const filteredApps = tokenInfo.permissions
      .filter(({ applicationKey }) => applicationKey === 'nas-fs')
      .filter(({ name }) => !name.endsWith(':admin'))
      .map((perm) => ({ key: perm.name, name: perm.displayName }))

    return filteredApps
  }, [tokenInfo.permissions])
  const currentApp = useMemo(
    () => apps.find((app) => new RegExp(`^\\/${app.key}(\\/.*)?$`).exec(location.pathname)),
    [apps, location.pathname],
  )

  const onSettingsModalClose = useCallback(() => setShowSettingsModal(false), [])
  const onJobsModalClose = useCallback(() => setShowJobsModal(false), [])

  useEffect(() => {
    const func = () => setShowChangeApp(false)
    const el = document.body
    el.addEventListener('click', func, false)

    return () => el.removeEventListener('click', func, false)
  }, [])

  const onBrandButtonClicked: React.MouseEventHandler = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowChangeApp((v) => !v)
  }, [])

  const onLogout: React.MouseEventHandler = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()

    removeUser().catch(() => {})
  }, [removeUser])

  const openAuth: React.MouseEventHandler = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()

    window.open(env.identity.authority, '_blank')
  }, [])

  const openAuth2: React.KeyboardEventHandler = useCallback((e) => {
    if (e.code === 'Enter') {
      openAuth(e as never)
    }
  }, [openAuth])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 flex flex-row items-center justify-between px-3 py-2 h-navbar">
        <div className="flex items-center gap-1">
          <Button
            component={Link}
            to="/"
            variant="text"
            color="neutral"
            size="large"
            icon={<HomeIcon />}
          />
          <Button
            type="button"
            variant="text"
            color="neutral"
            size="large"
            icon={<AppsIcon />}
            onClick={onBrandButtonClicked}
            aria-checked={showChangeApp}
          >
            {currentApp?.name ?? 'Home'}
          </Button>
          <Spinner show={state !== 'idle'} />
        </div>
        <div className="flex gap-2 items-center">
          <div
            className="hidden md:inline text-center text-muted select-none cursor-pointer mr-2"
            role="button"
            onClick={openAuth}
            onKeyDown={openAuth2}
            tabIndex={0}
          >
            <span role="img" aria-label="Saluting hand">👋</span>
            <span>
              &nbsp;&nbsp;
              {tokenInfo.displayName || tokenInfo.userName}
            </span>
          </div>
          <Button
            type="button"
            variant="text"
            color="secondary"
            size="large"
            onClick={() => setShowSettingsModal(true)}
            icon={<SettingsIcon />}
            title="Application Settings"
          />
          <Button
            type="button"
            variant="text"
            color="secondary"
            size="large"
            onClick={() => setShowJobsModal(true)}
            icon={<MiscellaneousServicesIcon />}
            title="Jobs Management"
          />
          <Button
            type="button"
            variant="text"
            size="large"
            onClick={onLogout}
            icon={<LogoutIcon />}
            title="Log out"
          />
        </div>
      </nav>

      <SettingsModal
        show={showSettingsModal}
        onClose={onSettingsModalClose}
      />

      <JobsModal
        show={showJobsModal}
        onClose={onJobsModalClose}
      />

      <AppMenuContainer show={showChangeApp}>
        {apps.map(({ key, name }) => <AppMenuLink key={key} appKey={key} name={name} />)}
      </AppMenuContainer>
    </>
  )
})

export default NavBar
