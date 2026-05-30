let audioCtx: AudioContext | null = null

function getCtx() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) audioCtx = new AudioContext()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

export function playOrderSound() {
  try {
    const ctx = getCtx()
    if (!ctx) return
    const notes = [523.25, 659.25, 783.99, 1046.50]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      const start = ctx.currentTime + i * 0.12
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.4, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4)
      osc.start(start)
      osc.stop(start + 0.5)
    })
  } catch (err) {
    console.error('Failed to play order sound', err)
  }
}

export function playMessageSound() {
  try {
    const ctx = getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0, ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.3)
  } catch (err) {
    console.error('Failed to play message sound', err)
  }
}

export function flashTabTitle(message: string) {
  if (typeof window === 'undefined') return
  const original = document.title
  let showing = false
  const interval = setInterval(() => {
    document.title = showing ? original : `🛍️ ${message}`
    showing = !showing
  }, 1000)
  window.addEventListener('focus', () => {
    clearInterval(interval)
    document.title = original
  }, { once: true })
}
