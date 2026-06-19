import { useEffect, useRef } from 'react'

/**
 * Rotating 3D dot-globe rendered on a canvas.
 * Dots are placed on a sphere surface using the Fibonacci lattice method
 * (even distribution), then projected with a simple perspective projection.
 * The sphere rotates continuously on the Y-axis; mouse drag lets users
 * spin it manually.
 */
export default function RotatingGlobe({ size = 340 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx    = canvas.getContext('2d')
    const dpr    = window.devicePixelRatio || 1
    const W      = size
    const H      = size
    canvas.width  = W * dpr
    canvas.height = H * dpr
    canvas.style.width  = `${W}px`
    canvas.style.height = `${H}px`
    ctx.scale(dpr, dpr)

    const cx = W / 2
    const cy = H / 2
    const R  = W * 0.42          // globe radius
    const fov = W * 1.5          // perspective focal length

    // ── Generate evenly-distributed points on a unit sphere ──────────────
    const N       = 320
    const golden  = Math.PI * (3 - Math.sqrt(5))
    const points3d = []

    for (let i = 0; i < N; i++) {
      const y     = 1 - (i / (N - 1)) * 2           // -1 to 1
      const rSlice = Math.sqrt(Math.max(0, 1 - y * y))
      const theta = golden * i
      points3d.push({
        x: Math.cos(theta) * rSlice,
        y,
        z: Math.sin(theta) * rSlice,
      })
    }

    // ── Rotation state ────────────────────────────────────────────────────
    let rotY  = 0
    let rotX  = 0.18         // slight tilt so we can see latitude rings
    let velY  = 0.004        // auto-spin speed
    let velX  = 0
    let isDragging = false
    let lastMX = 0
    let lastMY = 0

    const onMouseDown = (e) => {
      isDragging = true
      lastMX = e.clientX
      lastMY = e.clientY
      velY = 0; velX = 0
    }
    const onMouseMove = (e) => {
      if (!isDragging) return
      const dx = e.clientX - lastMX
      const dy = e.clientY - lastMY
      velY = dx * 0.005
      velX = dy * 0.003
      rotY += dx * 0.005
      rotX += dy * 0.003
      lastMX = e.clientX
      lastMY = e.clientY
    }
    const onMouseUp = () => { isDragging = false }

    // Touch support
    const onTouchStart = (e) => {
      isDragging = true
      lastMX = e.touches[0].clientX
      lastMY = e.touches[0].clientY
      velY = 0; velX = 0
    }
    const onTouchMove = (e) => {
      if (!isDragging) return
      const dx = e.touches[0].clientX - lastMX
      const dy = e.touches[0].clientY - lastMY
      velY = dx * 0.005
      velX = dy * 0.003
      rotY += dx * 0.005
      rotX += dy * 0.003
      lastMX = e.touches[0].clientX
      lastMY = e.touches[0].clientY
    }
    const onTouchEnd = () => { isDragging = false }

    canvas.addEventListener('mousedown',  onMouseDown)
    window.addEventListener('mousemove',  onMouseMove)
    window.addEventListener('mouseup',    onMouseUp)
    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove',  onTouchMove,  { passive: true })
    window.addEventListener('touchend',   onTouchEnd)

    // ── Rotate a 3D point around Y then X ─────────────────────────────────
    const rotate = (p, ry, rx) => {
      // Y-axis rotation
      let x1 =  p.x * Math.cos(ry) + p.z * Math.sin(ry)
      let z1 = -p.x * Math.sin(ry) + p.z * Math.cos(ry)
      let y1 = p.y
      // X-axis rotation
      let y2 =  y1 * Math.cos(rx) - z1 * Math.sin(rx)
      let z2 =  y1 * Math.sin(rx) + z1 * Math.cos(rx)
      return { x: x1, y: y2, z: z2 }
    }

    // ── Project 3D → 2D with perspective ──────────────────────────────────
    const project = (p) => {
      const scale = fov / (fov + p.z * R)
      return {
        sx:    cx + p.x * R * scale,
        sy:    cy + p.y * R * scale,
        scale,
        depth: p.z,
      }
    }

    let raf

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      if (!isDragging) {
        rotY += velY
        // Gently damp manual spin back to auto-rotation
        velX *= 0.92
      }

      // Project all points
      const projected = points3d.map((p) => {
        const r = rotate(p, rotY, rotX)
        const proj = project(r)
        return { ...proj, orig: r }
      })

      // Sort back-to-front so front dots render on top
      projected.sort((a, b) => a.depth - b.depth)

      projected.forEach(({ sx, sy, scale, depth }) => {
        const isFront = depth > 0
        // Dots on the far side are fainter and smaller
        const alpha   = isFront ? 0.75 + depth * 0.25 : 0.15 + (depth + 1) * 0.1
        const r       = (scale * 2.2)

        // Color: cycle between pink and purple based on position
        const hue = ((sx / W) * 60 + 260) % 360  // 260-320 = blue-violet-pink
        ctx.beginPath()
        ctx.arc(sx, sy, Math.max(0.5, r), 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${hue}, 85%, 65%, ${alpha})`
        ctx.fill()
      })

      raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('mousedown',  onMouseDown)
      window.removeEventListener('mousemove',  onMouseMove)
      window.removeEventListener('mouseup',    onMouseUp)
      canvas.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove',  onTouchMove)
      window.removeEventListener('touchend',   onTouchEnd)
    }
  }, [size])

  return (
    <canvas
      ref={canvasRef}
      style={{ cursor: 'grab', width: size, height: size }}
      className="select-none"
    />
  )
}
