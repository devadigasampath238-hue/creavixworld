import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const cursorRef = useRef(null)
  const trailRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const trail = trailRef.current
    if (!cursor || !trail) return

    let mouseX = 0, mouseY = 0
    let trailX = 0, trailY = 0

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      cursor.style.left = `${mouseX}px`
      cursor.style.top = `${mouseY}px`
    }

    const animate = () => {
      trailX += (mouseX - trailX) * 0.12
      trailY += (mouseY - trailY) * 0.12
      trail.style.left = `${trailX}px`
      trail.style.top = `${trailY}px`
      requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove)
    const id = requestAnimationFrame(animate)

    // Scale on click
    const onDown = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(0.7)'
    }
    const onUp = () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)'
    }
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(id)
    }
  }, [])

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] hidden lg:block"
        style={{
          width: '10px',
          height: '10px',
          background: '#00d4ff',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.1s ease',
          boxShadow: '0 0 10px #00d4ff, 0 0 20px rgba(0,212,255,0.5)',
          mixBlendMode: 'screen',
        }}
      />
      {/* Trailing ring */}
      <div
        ref={trailRef}
        className="fixed pointer-events-none z-[9998] hidden lg:block"
        style={{
          width: '36px',
          height: '36px',
          border: '1.5px solid rgba(0,212,255,0.4)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.2s, height 0.2s, opacity 0.2s',
        }}
      />
    </>
  )
}
