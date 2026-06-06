import { useState, type Dispatch } from 'react'

export default function usePropState<T>(propValue: T, setState: Dispatch<T>) {
  const [prevValue, setPrevValue] = useState(propValue)

  if (propValue !== prevValue) {
    setState(propValue)
    setPrevValue(propValue)
  }
}
