let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

export function playBootChime() {
  const ac = getCtx()
  const notes = [523, 659]
  notes.forEach((freq, i) => {
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.frequency.value = freq
    osc.type = 'square'
    gain.gain.setValueAtTime(0.3, ac.currentTime + i * 0.1)
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + i * 0.1 + 0.08)
    osc.start(ac.currentTime + i * 0.1)
    osc.stop(ac.currentTime + i * 0.1 + 0.08)
  })
}

export function playTypeChar() {
  const ac = getCtx()
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.frequency.value = 880
  osc.type = 'square'
  gain.gain.setValueAtTime(0.05, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.02)
  osc.start(ac.currentTime)
  osc.stop(ac.currentTime + 0.02)
}

export function playRevealFanfare() {
  const ac = getCtx()
  const notes = [523, 587, 659, 784]
  notes.forEach((freq, i) => {
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.frequency.value = freq
    osc.type = 'square'
    const t = ac.currentTime + i * 0.12
    gain.gain.setValueAtTime(0.2, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1)
    osc.start(t)
    osc.stop(t + 0.1)
  })
}

export function playSelect() {
  const ac = getCtx()
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.connect(gain)
  gain.connect(ac.destination)
  osc.frequency.value = 1046
  osc.type = 'square'
  gain.gain.setValueAtTime(0.15, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.05)
  osc.start(ac.currentTime)
  osc.stop(ac.currentTime + 0.05)
}
