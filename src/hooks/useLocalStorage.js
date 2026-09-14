import { useCallback, useState } from 'react'
import { readJson, writeJson } from '../lib/storage.js'

/** `useState` persisted to localStorage (favourites, preferences). */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readJson(key, initialValue))

  const update = useCallback(
    (next) => {
      setValue((previous) => {
        const resolved = typeof next === 'function' ? next(previous) : next
        writeJson(key, resolved)
        return resolved
      })
    },
    [key],
  )

  return [value, update]
}
