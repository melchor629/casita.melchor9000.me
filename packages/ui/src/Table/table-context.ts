import { createContext } from 'react'

export const TableContext = createContext<{
  hover?: boolean
}>({})

export const TableScopeContext = createContext<'head' | 'body'>('body')
