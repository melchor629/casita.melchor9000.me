import makeOxlintConfig from '@melchor629/oxlint-config'

export default makeOxlintConfig({
  env: {
    browser: true,
    node: true,
  },
  ts: true,
  jsx: true,
})
