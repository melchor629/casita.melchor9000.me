#!/usr/bin/env node

import { createBuilder } from 'vite'

console.log('> Reading vite configuration')
const builder = await createBuilder({})

console.log('> Bulding vite app')
await builder.buildApp()
