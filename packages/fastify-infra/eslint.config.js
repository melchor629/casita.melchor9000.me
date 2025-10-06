import melchor629 from '@melchor629/eslint-config'

export default melchor629({
  dirname: import.meta.dirname,
  env: ['node', 'nodeBuiltin'],
  moduleResolution: 'node-esm',
  ts: true,
})
