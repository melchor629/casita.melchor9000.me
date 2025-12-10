import useMatchMediaQuery from './use-match-media-query'

const useDevicePixelRatio = () => {
  const dpr = window.devicePixelRatio
  // it does not need the returned value, just notify dpr has changed
  useMatchMediaQuery(`(resolution: ${dpr}dppx)`)
  return dpr
}

export default useDevicePixelRatio
