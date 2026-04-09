'use client'

import { useState, useEffect, useRef } from 'react'
import { AppState, Scene } from '@/lib/types'
import BootSequence from '@/components/BootSequence'
import DialogueBox from '@/components/DialogueBox'
import OakSprite from '@/components/OakSprite'
import NameEntry from '@/components/NameEntry'
import PokeballTable from '@/components/PokeballTable'
import PokedexReveal from '@/components/PokedexReveal'
import HoekemonCard from '@/components/HoekemonCard'
import ShareButton from '@/components/ShareButton'
import WipeTransition from '@/components/WipeTransition'

// ─── Dialogue lines ───────────────────────────────────────────────────────────

const OAK_INTRO_LINES = [
  'Hello there!',
  'Welcome to the world of\nHOE-KEMON!',
  'My name is OAK!\nPeople call me the\nHOE-KEMON PROF!',
  'This world is inhabited by\ncreatures called HOE-KEMON!',
  'For some people, they are pets.\nOthers use them for CLOUT.',
  'Myself...\nI study HOE-KEMON as a\nprofession.',
  'First, what is your name?',
]

const OAK_CONNECT_LINES = (name: string) => [
  `${name.toUpperCase()}?\nThat's an interesting name.`,
  'One moment — I need to\nverify your HOE-KEMON data.',
]

const OAK_POST_CONNECT_LINES = ['Ah yes.', 'Just as I suspected.', 'Come with me.']


const OAK_OUTRO_LINES = (name: string) => [
  '...',
  'Remarkable.',
  'I have studied HOE-KEMON\nfor 40 years.',
  'I have never seen anything\nquite like this.',
  `${name.toUpperCase()}'s data has been\nadded to the HOE-KDEX.`,
  '...',
  "Please don't show your\nmother.",
]

// ─── Page component ───────────────────────────────────────────────────────────

export default function Page() {
  const [state, setState] = useState<AppState>({
    scene: 'boot',
    playerName: '',
    hoekemon: null,
    spriteUrl: null,
    spriteLoading: false,
    connectionId: null,
  })
  const [wiping, setWiping] = useState(false)
  const [connectComplete, setConnectComplete] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [connectUrl, setConnectUrl] = useState<string | null>(null)
  const [connectError, setConnectError] = useState<string | null>(null)
  const [connectLoading, setConnectLoading] = useState(false)

  // Ref so the postMessage handler always has the current player name
  const playerNameRef = useRef('')
  useEffect(() => {
    playerNameRef.current = state.playerName
  }, [state.playerName])

  // ODL Connect postMessage listener — registered once
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.origin !== 'https://dashboard.opendatalabs.com') return
      if (e.data?.type === 'success') {
        const connectionId: string = e.data.connectionId
        setShowConnectModal(false)
        setConnectComplete(true)
        beginGeneration(connectionId, playerNameRef.current)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function wipeToScene(next: Scene) {
    setWiping(true)
    setTimeout(() => {
      setState((s) => ({ ...s, scene: next }))
      setWiping(false)
    }, 700)
  }

  async function handleConnectClick() {
    setConnectLoading(true)
    setConnectError(null)
    try {
      const res = await fetch('/api/connect/session', { method: 'POST' })
      const data = await res.json()
      console.log('[ODL] Session API response:', data)
      if (!res.ok || data.error) throw new Error(data.error ?? `HTTP ${res.status}`)
      if (!data.connectUrl) throw new Error('No connect URL returned')
      setConnectUrl(data.connectUrl)
      setShowConnectModal(true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error('[ODL] Failed to create session:', msg)
      setConnectError(msg)
    } finally {
      setConnectLoading(false)
    }
  }

  function beginGeneration(connectionId: string, name: string) {
    setState((s) => ({ ...s, spriteLoading: true, connectionId }))
    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ connectionId, playerName: name }),
    })
      .then((r) => r.json())
      .then(({ hoekemon, replicateId }) => {
        setState((s) => ({ ...s, hoekemon }))
        if (replicateId) pollSprite(replicateId)
        else setState((s) => ({ ...s, spriteLoading: false }))
      })
      .catch((err) => {
        console.error('[Generate] Failed:', err)
        setState((s) => ({ ...s, spriteLoading: false }))
      })
  }

  function pollSprite(id: string) {
    const poll = () => {
      fetch(`/api/sprite/${id}`)
        .then((r) => r.json())
        .then(({ status, url }: { status: string; url?: string }) => {
          if (status === 'ready' && url) {
            setState((s) => ({ ...s, spriteUrl: url, spriteLoading: false }))
          } else if (status !== 'failed') {
            setTimeout(poll, 2000)
          } else {
            setState((s) => ({ ...s, spriteLoading: false }))
          }
        })
        .catch(() => setState((s) => ({ ...s, spriteLoading: false })))
    }
    poll()
  }

  // Auto-advance from loading screen once hoekemon data is ready
  useEffect(() => {
    if (state.scene === 'battle-loading' && state.hoekemon) {
      wipeToScene('pokedex-species')
    }
  }, [state.hoekemon, state.scene]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Scene renderer ─────────────────────────────────────────────────────────

  const renderScene = () => {
    switch (state.scene) {
      case 'boot':
        return <BootSequence onComplete={() => wipeToScene('oak-intro')} />

      case 'oak-intro':
        return (
          <div className="screen" style={{ background: '#F0F0F0', position: 'relative' }}>
            <OakSprite />
            <DialogueBox
              speaker="OAK"
              lines={OAK_INTRO_LINES}
              onComplete={() => wipeToScene('name-entry')}
            />
          </div>
        )

      case 'name-entry':
        return (
          <NameEntry
            onSubmit={(name) => {
              setState((s) => ({ ...s, playerName: name }))
              wipeToScene('connect-instagram')
            }}
          />
        )

      case 'connect-instagram':
        return (
          <div className="screen" style={{ background: '#F0F0F0', position: 'relative' }}>
            <OakSprite />
            <DialogueBox
              speaker="OAK"
              lines={[
                ...OAK_CONNECT_LINES(state.playerName),
                '__CONNECT_BUTTON__',
                ...OAK_POST_CONNECT_LINES,
              ]}
              onComplete={() => wipeToScene('lab')}
              onConnectClick={handleConnectClick}
              connectComplete={connectComplete}
              connectLoading={connectLoading}
              connectError={connectError}
            />

            {/* ODL Connect iframe overlay */}
            {showConnectModal && connectUrl && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.88)',
                  zIndex: 500,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ position: 'relative', width: '90%', maxWidth: 480 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowConnectModal(false)
                    }}
                    style={{
                      position: 'absolute',
                      top: -36,
                      right: 0,
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: 8,
                      color: 'white',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    ✕ CANCEL
                  </button>
                  <iframe
                    src={connectUrl}
                    style={{ width: '100%', height: 700, border: 0, borderRadius: 8 }}
                  />
                </div>
              </div>
            )}
          </div>
        )

      case 'lab':
        return (
          <div className="screen lab-bg">
            <div className="lab-floor-line" />
            <div className="lab-table" />
            <PokeballTable
              onSelect={() => wipeToScene('battle-loading')}
              selectedIndex={null}
            />
            <OakSprite
              style={{ position: 'absolute', left: 40, bottom: 160, transform: 'none' }}
            />
            {/* Static prompt — no window click listener, pokeballs stay fully clickable */}
            <div
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                height: 128,
                background: 'var(--gb-cream)',
                borderTop: '4px solid var(--gb-black)',
                padding: '16px 20px 12px',
                zIndex: 100,
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: -14,
                  left: 16,
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 7,
                  background: 'var(--gb-cream)',
                  border: '2px solid var(--gb-black)',
                  padding: '3px 6px',
                  color: 'var(--gb-black)',
                }}
              >
                OAK
              </span>
              <div
                style={{
                  fontFamily: "'VT323', monospace",
                  fontSize: 22,
                  color: 'var(--gb-black)',
                  lineHeight: 1.5,
                }}
              >
                Go ahead — choose a Pokéball!
              </div>
              <span
                style={{
                  position: 'absolute',
                  bottom: 10,
                  right: 14,
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: 8,
                  color: 'var(--gb-black)',
                  animation: 'blink 0.8s step-end infinite',
                }}
              >
                ▲
              </span>
            </div>
          </div>
        )

      case 'battle-loading':
        return (
          <div
            className="screen"
            style={{
              background: 'var(--gb-screen-dark)',
              flexDirection: 'column',
              gap: 24,
            }}
          >
            <div
              style={{
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 10,
                color: 'var(--gb-screen-green)',
                lineHeight: 2,
                textAlign: 'center',
              }}
            >
              <div>OAK used</div>
              <div style={{ fontSize: 14, marginTop: 8 }}>DATA SCANNER!</div>
            </div>
            <div
              style={{
                fontFamily: "'VT323', monospace",
                fontSize: 22,
                color: 'var(--gb-screen-green)',
                animation: 'blink 0.8s step-end infinite',
                letterSpacing: 2,
              }}
            >
              ANALYSING...
            </div>
          </div>
        )

      case 'pokedex-species':
      case 'pokedex-backstory':
      case 'pokedex-entry':
        return state.hoekemon ? (
          <PokedexReveal
            data={state.hoekemon}
            spriteUrl={state.spriteUrl}
            initialBeat={
              state.scene === 'pokedex-species'
                ? 1
                : state.scene === 'pokedex-backstory'
                ? 2
                : 3
            }
            onComplete={() => wipeToScene('card-reveal')}
            onBeatAdvance={(beat) => {
              if (beat === 2) setState((s) => ({ ...s, scene: 'pokedex-backstory' }))
              if (beat === 3) setState((s) => ({ ...s, scene: 'pokedex-entry' }))
            }}
          />
        ) : (
          <div
            className="screen"
            style={{
              background: '#0a0a0a',
              color: 'var(--gb-screen-green)',
              fontFamily: "'VT323', monospace",
              fontSize: 24,
            }}
          >
            <span style={{ animation: 'blink 0.8s step-end infinite' }}>
              LOADING DATA...
            </span>
          </div>
        )

      case 'card-reveal':
        return state.hoekemon ? (
          <div
            className="screen"
            style={{
              background: '#0a0a0a',
              overflow: 'auto',
              paddingBottom: 148,
              paddingTop: 20,
            }}
          >
            <div className="animate-card-reveal">
              <HoekemonCard data={state.hoekemon} spriteUrl={state.spriteUrl} />
            </div>
            <DialogueBox
              speaker="OAK"
              lines={OAK_OUTRO_LINES(state.playerName)}
              onComplete={() => setState((s) => ({ ...s, scene: 'oak-outro' }))}
            />
          </div>
        ) : null

      case 'oak-outro':
        return state.hoekemon ? (
          <div
            className="screen"
            style={{
              background: '#0a0a0a',
              overflow: 'auto',
              padding: '20px 0 48px',
              gap: 24,
              flexDirection: 'column',
            }}
          >
            <HoekemonCard data={state.hoekemon} spriteUrl={state.spriteUrl} />
            <ShareButton hoekemon={state.hoekemon} spriteUrl={state.spriteUrl} />
          </div>
        ) : null

      default:
        return null
    }
  }

  return (
    <>
      {renderScene()}
      <WipeTransition active={wiping} onComplete={() => {}} />
    </>
  )
}
