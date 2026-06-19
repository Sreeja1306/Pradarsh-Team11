import { useEffect, useRef } from 'react'

export default function InteractiveMesh() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width  = (canvas.width  = canvas.parentElement.offsetWidth)
    let height = (canvas.height = canvas.parentElement.offsetHeight)

    const particles = []
    const particleCount = Math.min(70, Math.floor((width * height) / 12000))
    const connectionDistance = 130
    const mouse = { x: null, y: null, radius: 180 }

    class Particle {
      constructor() {
        this.x  = Math.random() * width
        this.y  = Math.random() * height
        this.vx = (Math.random() - 0.5) * 0.4
        this.vy = (Math.random() - 0.5) * 0.4
        this.radius = Math.random() * 2 + 1.2
        this.color  = Math.random() > 0.5
          ? 'rgba(139, 92, 246, 0.35)'
          : 'rgba(236, 72, 153, 0.35)'
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        if (this.x < 0 || this.x > width)  this.vx *= -1
        if (this.y < 0 || this.y > height)  this.vy *= -1

        if (mouse.x !== null && mouse.y !== null) {
          const dx   = mouse.x - this.x
          const dy   = mouse.y - this.y
          const dist = Math.hypot(dx, dy)
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius
            this.x += (dx / dist) * force * 0.4
            this.y += (dy / dist) * force * 0.4
          }
        }
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    for (let i = 0; i < particleCount; i++) particles.push(new Particle())

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const handleMouseLeave = () => { mouse.x = null; mouse.y = null }

    const parent = canvas.parentElement
    parent.addEventListener('mousemove', handleMouseMove)
    parent.addEventListener('mouseleave', handleMouseLeave)

    const handleResize = () => {
      if (!canvas.parentElement) return
      width  = canvas.width  = canvas.parentElement.offsetWidth
      height = canvas.height = canvas.parentElement.offsetHeight
      particles.length = 0
      const newCount = Math.min(70, Math.floor((width * height) / 12000))
      for (let i = 0; i < newCount; i++) particles.push(new Particle())
    }
    window.addEventListener('resize', handleResize)

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      particles.forEach((p) => { p.update(); p.draw() })

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]

        if (mouse.x !== null && mouse.y !== null) {
          const dx   = mouse.x - p1.x
          const dy   = mouse.y - p1.y
          const dist = Math.hypot(dx, dy)
          if (dist < mouse.radius) {
            const alpha = (1 - dist / mouse.radius) * 0.22
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(mouse.x, mouse.y)
            const grad = ctx.createLinearGradient(p1.x, p1.y, mouse.x, mouse.y)
            grad.addColorStop(0, p1.color)
            grad.addColorStop(1, `rgba(236, 72, 153, ${alpha})`)
            ctx.strokeStyle = grad
            ctx.lineWidth   = 1.0
            ctx.stroke()
          }
        }

        for (let j = i + 1; j < particles.length; j++) {
          const p2   = particles[j]
          const dx   = p1.x - p2.x
          const dy   = p1.y - p2.y
          const dist = Math.hypot(dx, dy)
          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.12
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
            grad.addColorStop(0, p1.color.replace('0.35', String(alpha)))
            grad.addColorStop(1, p2.color.replace('0.35', String(alpha)))
            ctx.strokeStyle = grad
            ctx.lineWidth   = 0.7
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      parent.removeEventListener('mousemove', handleMouseMove)
      parent.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  )
}
