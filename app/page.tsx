'use client'

import { useState, useEffect, useRef } from 'react'
import { AppState, Scene } from '@/lib/types'
import Gameboy from '@/components/Gameboy'
import BootSequence from '@/components/BootSequence'
import DialogueBox from '@/components/DialogueBox'
import NameEntry from '@/components/NameEntry'
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
  'Some trainers battle with them. Others use them to out-hoe every basic in the region.',
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

// ─── Card scenes (break out of GameBoy shell) ─────────────────────────────────
const CARD_SCENES: Scene[] = ['card-reveal', 'oak-outro']

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
  const [generateError, setGenerateError] = useState<string | null>(null)

  const playerNameRef = useRef('')
  useEffect(() => {
    playerNameRef.current = state.playerName
  }, [state.playerName])

  // ODL Connect postMessage listener
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
      if (!res.ok || data.error) throw new Error(data.error ?? `HTTP ${res.status}`)
      if (!data.connectUrl) throw new Error('No connect URL returned')
      setConnectUrl(data.connectUrl)
      setShowConnectModal(true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setConnectError(msg)
    } finally {
      setConnectLoading(false)
    }
  }

  function beginGeneration(connectionId: string, name: string) {
    setState((s) => ({ ...s, spriteLoading: true, connectionId }))
    setGenerateError(null)
    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ connectionId, playerName: name }),
    })
      .then(async (r) => {
        const data = await r.json()
        if (!r.ok || data.error) throw new Error(data.error ?? `HTTP ${r.status}`)
        return data
      })
      .then(({ hoekemon, replicateId }) => {
        setState((s) => ({ ...s, hoekemon }))
        if (replicateId) pollSprite(replicateId)
        else setState((s) => ({ ...s, spriteLoading: false }))
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : String(err)
        setGenerateError(msg)
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

  // Auto-advance from loading once hoekemon data is ready
  useEffect(() => {
    if (state.scene === 'battle-loading' && state.hoekemon) {
      wipeToScene('pokedex-species')
    }
  }, [state.hoekemon, state.scene]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Scene renderer ─────────────────────────────────────────────────────────
  const renderScene = () => {
    switch (state.scene) {
      // ── Boot sequence ──────────────────────────────────────────────────────
      case 'boot':
        return <BootSequence onComplete={() => wipeToScene('oak-intro')} />

      // ── Oak intro: sprite fills GameBoy display, dialogue pinned to bottom ──
      case 'oak-intro':
        return (
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#F0EFE7' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/frames/frame_011.jpg"
              alt=""
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'top center',
              }}
            />
            <DialogueBox
              speaker="OAK"
              lines={OAK_INTRO_LINES}
              onComplete={() => wipeToScene('name-entry')}
            />
          </div>
        )

      // ── Name entry ─────────────────────────────────────────────────────────
      case 'name-entry':
        return (
          <NameEntry
            onSubmit={(name) => {
              setState((s) => ({ ...s, playerName: name }))
              wipeToScene('connect-instagram')
            }}
          />
        )

      // ── Connect Instagram: same Oak sprite, dialogue advances after connect ──
      case 'connect-instagram':
        return (
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#F0EFE7' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/frames/frame_011.jpg"
              alt=""
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'top center',
              }}
            />
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

            {/* ODL iframe — rendered outside GameBoy, covers full viewport */}
            {showConnectModal && connectUrl && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0,0,0,0.88)',
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ position: 'relative', width: '90%', maxWidth: 480 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowConnectModal(false) }}
                    style={{
                      position: 'absolute', top: -36, right: 0,
                      fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                      color: 'white', background: 'none', border: 'none', cursor: 'pointer',
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

      // ── Lab — top-down lab with pokeball hotspots ──────────────────────────
      case 'lab':
        return (
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#F0EFE7' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/frames/frame_097.jpg"
              alt=""
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'top center',
              }}
            />

            {/* Pokeball hotspots — positions adjusted for object-fit:cover crop */}
            {[
              { left: '36%', top: '46%' },
              { left: '52%', top: '44%' },
              { left: '68%', top: '43%' },
            ].map((pos, i) => (
              <div
                key={i}
                onClick={() => wipeToScene('battle-loading')}
                style={{
                  position: 'absolute', ...pos,
                  width: '14%', height: '9%',
                  cursor: 'pointer', borderRadius: '50%',
                  zIndex: 2,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.25)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
              />
            ))}

            {/* Dialogue box pinned to bottom — matches .dialogue-box style */}
            <div className="dialogue-box" style={{ zIndex: 3, pointerEvents: 'none' }}>
              <span className="dialogue-speaker">OAK</span>
              <div className="dialogue-text">Go ahead — choose a HOE-KÉBALL!</div>
              <span className="dialogue-advance">▲</span>
            </div>
          </div>
        )

      // ── Battle loading / scanning ──────────────────────────────────────────
      case 'battle-loading':
        return (
          <div
            className="screen"
            style={{ background: '#F0EFE7', flexDirection: 'column', gap: 24 }}
          >
            {generateError ? (
              <>
                <div style={{
                  fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                  color: '#CC0000', textAlign: 'center', maxWidth: 280, lineHeight: 2,
                }}>
                  SCAN FAILED
                </div>
                <div style={{
                  fontFamily: "'VT323', monospace", fontSize: 18,
                  color: '#000', textAlign: 'center', maxWidth: 300, lineHeight: 1.4,
                }}>
                  {generateError}
                </div>
                <button
                  onClick={() => {
                    setGenerateError(null)
                    beginGeneration(state.connectionId!, state.playerName)
                  }}
                  style={{
                    fontFamily: "'Press Start 2P', monospace", fontSize: 8,
                    color: '#000', background: 'none', border: '2px solid #000',
                    padding: '10px 16px', cursor: 'pointer', marginTop: 8,
                  }}
                >
                  RETRY
                </button>
              </>
            ) : (
              <>
                <div style={{
                  fontFamily: "'Press Start 2P', monospace", fontSize: 9,
                  color: '#000', lineHeight: 2, textAlign: 'center',
                }}>
                  <div>OAK used</div>
                  <div style={{ fontSize: 12, marginTop: 8 }}>DATA SCANNER!</div>
                </div>
                <div style={{
                  fontFamily: "'VT323', monospace", fontSize: 20,
                  color: '#000', animation: 'blink 0.8s step-end infinite', letterSpacing: 2,
                }}>
                  ANALYSING...
                </div>
              </>
            )}
          </div>
        )

      // ── Pokédex reveal ─────────────────────────────────────────────────────
      case 'pokedex-species':
      case 'pokedex-backstory':
      case 'pokedex-entry':
        return state.hoekemon ? (
          <PokedexReveal
            data={state.hoekemon}
            spriteUrl={state.spriteUrl}
            initialBeat={
              state.scene === 'pokedex-species' ? 1
              : state.scene === 'pokedex-backstory' ? 2 : 3
            }
            onComplete={() => wipeToScene('card-reveal')}
            onBeatAdvance={(beat) => {
              if (beat === 2) setState((s) => ({ ...s, scene: 'pokedex-backstory' }))
              if (beat === 3) setState((s) => ({ ...s, scene: 'pokedex-entry' }))
            }}
          />
        ) : (
          <div className="screen" style={{
            background: '#F0EFE7', color: '#000',
            fontFamily: "'VT323', monospace", fontSize: 22,
          }}>
            <span style={{ animation: 'blink 0.8s step-end infinite' }}>LOADING DATA...</span>
          </div>
        )

      // ── Card reveal — BREAKS OUT of GameBoy shell ──────────────────────────
      // screen-card-outer is position: fixed; children here flow normally
      case 'card-reveal':
        return state.hoekemon ? (
          <>
            <div className="animate-card-reveal" style={{ position: 'relative' }}>
              <HoekemonCard data={state.hoekemon} spriteUrl={state.spriteUrl} />
              {/* Dialogue pinned to bottom of card */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                <DialogueBox
                  speaker="OAK"
                  lines={OAK_OUTRO_LINES(state.playerName)}
                  onComplete={() => setState((s) => ({ ...s, scene: 'oak-outro' }))}
                />
              </div>
            </div>
          </>
        ) : null

      case 'oak-outro':
        return state.hoekemon ? (
          <>
            <HoekemonCard data={state.hoekemon} spriteUrl={state.spriteUrl} />
            <ShareButton hoekemon={state.hoekemon} spriteUrl={state.spriteUrl} />
          </>
        ) : null

      default:
        return null
    }
  }

  const isCardScene = CARD_SCENES.includes(state.scene)

  // Card scenes break out of the GameBoy shell entirely
  if (isCardScene) {
    return (
      <>
        <div className="screen-card-outer">
          {renderScene()}
        </div>
        {/* Wipe covers full viewport for the GB→card transition */}
        <WipeTransition active={wiping} onComplete={() => {}} />
      </>
    )
  }

  return (
    <>
      <Gameboy>
        {renderScene()}
        <WipeTransition active={wiping} onComplete={() => {}} />
      </Gameboy>
    </>
  )
}
