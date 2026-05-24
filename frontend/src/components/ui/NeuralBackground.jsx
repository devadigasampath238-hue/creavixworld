import { useEffect, useRef } from 'react'

export default function NeuralBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    // Reduce nodes on mobile/low-end
    const isMobile = window.innerWidth < 768
    const NODE_COUNT = isMobile ? 30 : 60

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2.5 + 1,
      pulse: Math.random() * Math.PI * 2,
      color: Math.random() > 0.6 ? '#9d4edd' : Math.random() > 0.5 ? '#ff006e' : '#00d4ff',
    }))

    let frame = 0
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      nodes.forEach(n => {
        n.x += n.vx
        n.y += n.vy
        n.pulse += 0.02

        if (n.x < 0 || n.x > canvas.width) n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1

        const alpha = 0.4 + Math.sin(n.pulse) * 0.3
        const radius = n.r + Math.sin(n.pulse) * 0.8

        // Node glow
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, radius * 4)
        grad.addColorStop(0, n.color + Math.floor(alpha * 255).toString(16).padStart(2, '0'))
        grad.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(n.x, n.y, radius * 4, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        // Node dot
        ctx.beginPath()
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = n.color
        ctx.globalAlpha = alpha
        ctx.fill()
        ctx.globalAlpha = 1
      })

      // Draw connections
      const maxDist = isMobile ? 120 : 160
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.15
            // Animated data pulse along line
            const progress = (frame * 0.01 + i * 0.3) % 1
            const px = nodes[i].x + (nodes[j].x - nodes[i].x) * progress
            const py = nodes[i].y + (nodes[j].y - nodes[i].y) * progress

            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = `rgba(0,212,255,${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()

            // Data pulse dot
            if (dist < 80) {
              ctx.beginPath()
              ctx.arc(px, py, 1.5, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(0,255,245,${alpha * 3})`
              ctx.fill()
            }
          }
        }
      }

      animId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.6 }}
    />
  )
}
