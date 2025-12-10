import React, {
  memo, useCallback, useEffect, useMemo, useState,
} from 'react'
import { useAuth } from 'react-oidc-context'
import { Link, useLocation, useNavigation } from 'react-router'
import { useTokenInfo } from '@/hooks/use-token-info'
import { env } from '@/utils/config'
import JobsModal from '../jobs'
import { Spinner } from '../loaders'
import SettingsModal from '../modals/settings-modal'
import AppMenuContainer from './app-menu-container'
import AppMenuLink from './app-menu-link'
import AppsIcon from './apps-icon'
import HomeIcon from './home-icon'
import LogoutIcon from './logout-icon'
import MiscellaneousServicesIcon from './miscellaneous-services-icon'
import SettingsIcon from './settings-icon'

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
      <nav className="navbar fixed-top bg-transparent">
        <div className="container-fluid">
          <div className="d-flex align-items-center">
            <Link
              to="/"
              className="navbar-brand btn btn-sm btn-link m-0"
            >
              <HomeIcon />
            </Link>
            <button
              type="button"
              className="navbar-brand btn btn-sm btn-link"
              onClick={onBrandButtonClicked}
            >
              <AppsIcon />
              &nbsp;
              {currentApp?.name ?? 'Home'}
            </button>
            {state !== 'idle' && (
              <Spinner size="md" />
            )}
          </div>
          <div>
            <div
              className="d-none d-md-inline text-center text-muted no-select"
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
            <button
              type="button"
              className="ms-4 btn btn-sm btn-outline-secondary"
              onClick={() => setShowSettingsModal(true)}
              aria-label="Application Settings"
            >
              <SettingsIcon />
            </button>
            <button
              type="button"
              className="ms-2 btn btn-sm btn-outline-secondary"
              onClick={() => setShowJobsModal(true)}
              aria-label="Jobs Management"
            >
              <MiscellaneousServicesIcon />
            </button>
            <button
              type="button"
              className="ms-2 btn btn-sm btn-outline-primary"
              onClick={onLogout}
              aria-label="Log out"
            >
              <LogoutIcon />
            </button>
          </div>
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

      <AppMenuContainer $show={showChangeApp} className="list-group">
        {apps.map(({ key, name }) => <AppMenuLink key={key} appKey={key} name={name} />)}
      </AppMenuContainer>
    </>
  )
})

export default NavBar
