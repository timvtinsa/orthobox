// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import { StrictMode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAnswerLock } from '../src/hooks/useAnswerLock.js'
import { useCountdown } from '../src/hooks/useCountdown.js'
import { useLocalStorage } from '../src/hooks/useLocalStorage.js'
import { useRounds } from '../src/hooks/useRounds.js'

describe('useAnswerLock', () => {
  it('lets the first tap through and rejects the next ones until released', () => {
    const { result } = renderHook(() => useAnswerLock())
    expect(result.current.take()).toBe(true)
    expect(result.current.take()).toBe(false)
    expect(result.current.take()).toBe(false)
    act(() => result.current.release())
    expect(result.current.take()).toBe(true)
  })
})

describe('useRounds', () => {
  it('advances, ends after the last round and restarts', () => {
    const { result } = renderHook(() => useRounds(2))
    expect(result.current).toMatchObject({ round: 0, total: 2, isOver: false })
    act(() => result.current.next())
    act(() => result.current.next())
    expect(result.current.isOver).toBe(true)
    act(() => result.current.restart())
    expect(result.current).toMatchObject({ round: 0, isOver: false })
  })

  it('reports its progress to the session', () => {
    const setProgress = vi.fn()
    const { result } = renderHook(() => useRounds(5, { setProgress }))
    expect(setProgress).toHaveBeenLastCalledWith(0, 5)
    act(() => result.current.next())
    expect(setProgress).toHaveBeenLastCalledWith(1, 5)
  })
})

describe('useCountdown', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('counts down each second and fires onExpire exactly once', () => {
    const onExpire = vi.fn()
    const { result } = renderHook(() => useCountdown(3, { onExpire }))
    expect(result.current).toBe(3)
    act(() => vi.advanceTimersByTime(2000))
    expect(result.current).toBe(1)
    act(() => vi.advanceTimersByTime(5000))
    expect(result.current).toBe(0)
    expect(onExpire).toHaveBeenCalledTimes(1)
  })

  it('fires onExpire once even under StrictMode, which runs updaters twice', () => {
    const onExpire = vi.fn()
    renderHook(() => useCountdown(2, { onExpire }), { wrapper: StrictMode })
    act(() => vi.advanceTimersByTime(4000))
    expect(onExpire).toHaveBeenCalledTimes(1)
  })

  it('stays put while paused', () => {
    const { result } = renderHook(() => useCountdown(5, { running: false }))
    act(() => vi.advanceTimersByTime(4000))
    expect(result.current).toBe(5)
  })

  it('starts over when the duration changes', () => {
    const { result, rerender } = renderHook(({ seconds }) => useCountdown(seconds), {
      initialProps: { seconds: 4 },
    })
    act(() => vi.advanceTimersByTime(2000))
    expect(result.current).toBe(2)
    rerender({ seconds: 10 })
    expect(result.current).toBe(10)
  })
})

describe('useLocalStorage', () => {
  beforeEach(() => localStorage.clear())

  it('falls back to the initial value, then persists updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', ['a']))
    expect(result.current[0]).toEqual(['a'])
    act(() => result.current[1]((previous) => [...previous, 'b']))
    expect(result.current[0]).toEqual(['a', 'b'])
    expect(JSON.parse(localStorage.getItem('orthobox:test-key'))).toEqual(['a', 'b'])
  })

  it('reads back what a previous visit stored', () => {
    localStorage.setItem('orthobox:test-key', JSON.stringify({ pinned: [1] }))
    const { result } = renderHook(() => useLocalStorage('test-key', {}))
    expect(result.current[0]).toEqual({ pinned: [1] })
  })

  it('survives corrupted storage', () => {
    localStorage.setItem('orthobox:test-key', '{not json')
    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'))
    expect(result.current[0]).toBe('fallback')
  })
})
