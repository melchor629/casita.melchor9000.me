#!/usr/bin/env node

import { createBuilder } from 'vite'

console.log('> Reading vite configuration')
const [csrBuilder, ssrBuilder] = await Promise.all([
  createBuilder({}),
  createBuilder({
    build: {
      ssr: true,
    },
  }, true),
])

console.log('\n> Compiling Client')
await csrBuilder.buildApp()

console.log('\n> Compiling Server')
await ssrBuilder.buildApp()
