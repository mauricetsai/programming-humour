import { useCallback, useEffect, useState } from 'react'

export type VoteHandMode = 'left' | 'right'

const STORAGE_KEY = 'programming-humour:vote-hand'
// Fired when you move the vote buttons in the header — home listens and updates.
const CHANGE_EVENT = 'programming-humour:vote-hand-change'

function readStored(): VoteHandMode {
  if (typeof window === 'undefined') return 'right'
  const v = window.localStorage.getItem(STORAGE_KEY)
  return v === 'left' || v === 'right' ? v : 'right'
}

export function useVoteHandMode() {
  const [mode, setModeState] = useState<VoteHandMode>('right')

  useEffect(() => {
    const sync = () => setModeState(readStored())
    sync()
    window.addEventListener(CHANGE_EVENT, sync)
    return () => window.removeEventListener(CHANGE_EVENT, sync)
  }, [])

  const setMode = useCallback((next: VoteHandMode) => {
    setModeState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // private mode / blocked storage — whatever
    }
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }, [])

  return { mode, setMode }
}
