'use client'

import { useState, useEffect, useRef } from 'react'
import { playTypeChar } from '@/lib/audio'

interface DialogueBoxProps {
  speaker?: string
  lines: string[]
  onComplete: () => void
  typingSpeed?: number
  onConnectClick?: () => void
  connectComplete?: boolean
  connectLoading?: boolean
  connectError?: string | null
}

export default function DialogueBox({
  speaker,
  lines,
  onComplete,
  typingSpeed = 35,
  onConnectClick,
  connectComplete,
  connectLoading,
  connectError,
}: DialogueBoxProps) {
  const [lineIdx, setLineIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(false)

  // Refs so event handlers/effects never have stale closures
  const lineIdxRef = useRef(0)
  lineIdxRef.current = lineIdx

  const typingRef = useRef(false)
  typingRef.current = typing

  const linesRef = useRef(lines)
  linesRef.current = lines

  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const intervalRef = useRef<ReturnType<typeof setInterval>>()
  const doneRef = useRef(false)

  const line = lines[lineIdx]
  const isConnect = line === '__CONNECT_BUTTON__'

  // Start typing whenever lineIdx changes
  useEffect(() => {
    if (doneRef.current) return

    const currentLine = linesRef.current[lineIdxRef.current]

    if (currentLine === '__CONNECT_BUTTON__') {
      clearInterval(intervalRef.current)
      setDisplayed('')
      setTyping(false)
      return
    }

    clearInterval(intervalRef.current)
    let i = 0
    setDisplayed('')
    setTyping(true)

    intervalRef.current = setInterval(() => {
      i++
      setDisplayed(currentLine.slice(0, i))
      const ch = currentLine[i - 1]
      if (ch && ch !== ' ' && ch !== '\n') {
        try { playTypeChar() } catch {}
      }
      if (i >= currentLine.length) {
        clearInterval(intervalRef.current)
        setTyping(false)
      }
    }, typingSpeed)

    return () => clearInterval(intervalRef.current)
  }, [lineIdx, typingSpeed])

  // Global click advances dialogue
  useEffect(() => {
    function onClick() {
      if (doneRef.current) return

      const curLine = linesRef.current[lineIdxRef.current]
      if (curLine === '__CONNECT_BUTTON__') return

      if (typingRef.current) {
        // Skip to end of current line
        clearInterval(intervalRef.current)
        setDisplayed(curLine)
        setTyping(false)
        return
      }

      const next = lineIdxRef.current + 1
      if (next >= linesRef.current.length) {
        doneRef.current = true
        onCompleteRef.current()
      } else {
        setLineIdx(next)
      }
    }

    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, []) // stable via refs

  // connectComplete → advance past __CONNECT_BUTTON__
  useEffect(() => {
    if (!connectComplete) return
    if (linesRef.current[lineIdxRef.current] !== '__CONNECT_BUTTON__') return
    const next = lineIdxRef.current + 1
    if (next >= linesRef.current.length) {
      doneRef.current = true
      onCompleteRef.current()
    } else {
      setLineIdx(next)
    }
  }, [connectComplete])

  if (isConnect) {
    return (
      <div className="dialogue-box">
        {speaker && <span className="dialogue-speaker">{speaker}</span>}
        {connectError ? (
          <div>
            <div className="dialogue-text" style={{ color: 'var(--gb-red)', fontSize: 14 }}>
              ERROR: {connectError}
            </div>
            <button
              className="menu-option"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 6 }}
              onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); onConnectClick?.() }}
            >
              RETRY
            </button>
          </div>
        ) : (
          <button
            className="menu-option"
            disabled={connectLoading}
            style={{
              background: 'none',
              border: 'none',
              cursor: connectLoading ? 'wait' : 'pointer',
              width: '100%',
              textAlign: 'left',
              padding: 0,
              opacity: connectLoading ? 0.6 : 1,
            }}
            onClick={(e) => {
              e.stopPropagation()
              e.nativeEvent.stopImmediatePropagation()
              onConnectClick?.()
            }}
          >
            {connectLoading ? 'CONNECTING...' : 'CONNECT INSTAGRAM'}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="dialogue-box">
      {speaker && <span className="dialogue-speaker">{speaker}</span>}
      <div className="dialogue-text">{displayed}</div>
      {!typing && !doneRef.current && (
        <span className="dialogue-advance">▼</span>
      )}
    </div>
  )
}
