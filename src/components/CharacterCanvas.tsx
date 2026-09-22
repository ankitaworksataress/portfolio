import { useEffect, useRef, useState } from 'react'
import {
  BG,
  CENTER_URL,
  DEADZONE,
  FRAME_COUNT,
  LERP,
  angleToFrameIndex,
  frameUrl,
  lerpAngle,
} from '../lib/tracking'

type Point = { x: number; y: number }

export default function CharacterCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cursorRef = useRef<Point>({ x: 0, y: 0 })
  const angleRef = useRef(0)
  const targetAngleRef = useRef(0)
  const inDeadzoneRef = useRef(true)
  const framesRef = useRef<HTMLImageElement[]>([])
  const centerRef = useRef<HTMLImageElement | null>(null)
  const readyRef = useRef(false)
  const [ready, setReady] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let cancelled = false
    const images: HTMLImageElement[] = []
    let loaded = 0
    const total = FRAME_COUNT + 1

    const bump = () => {
      loaded += 1
      if (!cancelled) setProgress(loaded / total)
      if (loaded >= total && !cancelled) {
        framesRef.current = images
        readyRef.current = true
        setReady(true)
      }
    }

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image()
      img.decoding = 'async'
      img.onload = bump
      img.onerror = bump
      img.src = frameUrl(i)
      images[i] = img
    }

    const center = new Image()
    center.decoding = 'async'
    center.onload = bump
    center.onerror = bump
    center.src = CENTER_URL
    centerRef.current = center

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    // Seed center of screen so first paint isn't stuck
    cursorRef.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useEffect(() => {
    if (!ready) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let raf = 0
    let lastDrawn: HTMLImageElement | null = null

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      lastDrawn = null
    }
    resize()
    window.addEventListener('resize', resize)

    const faceCenter = () => ({
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.42,
    })

    const drawCover = (img: HTMLImageElement) => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const ir = img.naturalWidth / img.naturalHeight
      const vr = vw / vh
      let dw: number
      let dh: number
      if (vr > ir) {
        dw = vw
        dh = vw / ir
      } else {
        dh = vh
        dw = vh * ir
      }
      const dx = (vw - dw) / 2
      const dy = (vh - dh) / 2
      ctx.fillStyle = BG
      ctx.fillRect(0, 0, vw, vh)
      // Exactly one crisp frame at 100% opacity — no alpha blending
      ctx.globalAlpha = 1
      ctx.drawImage(img, dx, dy, dw, dh)
    }

    const tick = () => {
      const face = faceCenter()
      const { x, y } = cursorRef.current
      const dx = x - face.x
      const dy = y - face.y
      const dist = Math.hypot(dx, dy)
      const radius = Math.min(window.innerWidth, window.innerHeight) * DEADZONE
      const inDeadzone = dist < radius
      inDeadzoneRef.current = inDeadzone

      if (!inDeadzone) {
        targetAngleRef.current = Math.atan2(dy, dx)
      }

      angleRef.current = lerpAngle(
        angleRef.current,
        targetAngleRef.current,
        LERP,
      )

      let img: HTMLImageElement | null
      if (inDeadzone) {
        img = centerRef.current
      } else {
        const idx = angleToFrameIndex(angleRef.current)
        img = framesRef.current[idx] ?? null
      }

      if (img?.complete && img.naturalWidth > 0 && img !== lastDrawn) {
        drawCover(img)
        lastDrawn = img
      } else if (!lastDrawn && img?.complete && img.naturalWidth > 0) {
        drawCover(img)
        lastDrawn = img
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [ready])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="character-canvas"
        aria-hidden
      />
      {!ready && (
        <div className="loader">
          <div className="loader-bar">
            <span style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
          <p>Loading character…</p>
        </div>
      )}
    </>
  )
}
