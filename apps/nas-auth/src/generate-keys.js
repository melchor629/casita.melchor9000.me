import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'
import * as jose from 'jose'
import { nanoid } from 'nanoid'

const filename = url.fileURLToPath(import.meta.url)
const args = process.argv
  .filter((p) => p !== process.execPath && p !== url.fileURLToPath(import.meta.url))

if (!args.length) {
  process.stderr.write('Expected list of key algorithms (with properties).\n')
  process.stderr.write(`  EXAMPLE: ${process.argv0} ${path.relative(process.cwd(), filename)} ES256 RS256:4098 EdDSA:Ed25519\n`)
  process.exit(1)
}

process.stderr.write('> Generating keys...\n')
const keyArgs = args.map((arg) => {
  if (arg.startsWith('RS')) {
    const [alg, modulusLength] = arg.split(':')
    process.stderr.write(` - Generating RSASSA-PKCS1-v1_5 key with SHA${alg.slice(2)} using modulus ${modulusLength || '2048'}\n`)
    return [alg, { modulusLength: parseInt(modulusLength || '2048', 10) }]
  }

  if (arg.startsWith('PS')) {
    const [alg, modulusLength] = arg.split(':')
    process.stderr.write(` - Generating RSASSA-PSS key with SHA${alg.slice(2)} and MGF1 with SHA${alg.slice(2)} using modulus ${modulusLength || '2048'}\n`)
    return [alg, { modulusLength: parseInt(modulusLength || '2048', 10) }]
  }

  if (arg.startsWith('HS')) {
    const alg = arg
    process.stderr.write(` - Generating HMAC key with SHA${alg.slice(2)}\n`)
    return [alg]
  }

  if (arg.startsWith('ES')) {
    const alg = arg
    process.stderr.write(` - Generating ECDSA key using P-${alg.slice(2)} with SHA${alg.slice(2)}\n`)
    return [alg]
  }

  if (arg.startsWith('EdDSA')) {
    const [alg, crv] = arg.split(':')
    process.stderr.write(` - Generating EdDSA key using ${crv || 'Ed25519'} curve\n`)
    return [alg, { crv: crv || 'Ed25519' }]
  }

  process.stderr.write(` - Generating key using ${arg}\n`)
  return [arg]
})

// https://datatracker.ietf.org/doc/html/rfc7518#section-3
Promise.all(
  keyArgs.map((a) => jose.generateKeyPair(...a)),
).then(async (pairs) => {
  process.stderr.write('> Exporting keys to JWK\n')
  const keys = await Promise.all(pairs.map((pair) => pair.privateKey).map(jose.exportJWK))
  keys.forEach((key) => {
    key.kid = key.kid || nanoid()
  })

  process.stderr.write('> Exporting to jwks.json\n')
  const jwksPath = path.resolve(process.env.JWKS_FILE_PATH || 'jwks.json')
  const { generated, keys: existingKeys } = JSON.parse(await fs.readFile(jwksPath, 'utf-8').catch(() => '{}'))

  const jwksJson = JSON.stringify({
    keys: [...keys, ...(existingKeys || [])],
    generated: {
      [new Date().toISOString()]: keys.map((key) => key.kid),
      ...generated,
    },
  }, null, 2)

  await fs.writeFile(jwksPath, jwksJson, 'utf-8')
}).catch((error) => {
  process.stderr.write(`!! Failure: ${error.message}\n`)
  process.stderr.write(error.stack)
  process.exit(1)
})
