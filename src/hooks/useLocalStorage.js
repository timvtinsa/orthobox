import { useCallback, useState } from 'react'
import { readJson, writeJson } from '../lib/storage.js'

/** `useState` persisté dans le localStorage (favoris, préférences…). */
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
