import { useRef } from 'react'
import { motion } from 'framer-motion'
import { RiPrinterLine, RiDownloadLine, RiShieldCheckLine } from 'react-icons/ri'
import { format } from 'date-fns'

export default function PrintCard({ user }) {
  const cardRef = useRef(null)

  const handlePrint = () => {
    const printContent = cardRef.current.innerHTML
    const win = window.open('', '_blank', 'width=800,height=600')
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>CREAVIX WORLD — Member Card</title>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@400;600&display=swap" rel="stylesheet"/>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: #020408; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: 'Exo 2', sans-serif; }
          .card-wrapper { width: 420px; }
          @media print {
            body { background: #020408 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="card-wrapper">${printContent}</div>
        <script>setTimeout(() => { window.print(); window.close(); }, 500)</script>
      </body>
      </html>
    `)
    win.document.close()
  }

  const handleDownload = () => {
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="420" height="240">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a1020"/>
      <stop offset="100%" style="stop-color:#060a10"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#00d4ff"/>
      <stop offset="100%" style="stop-color:#9d4edd"/>
    </linearGradient>
  </defs>
  <rect width="420" height="240" rx="16" fill="url(#bg)" stroke="rgba(0,212,255,0.3)" stroke-width="1"/>
  <rect x="0" y="0" width="420" height="3" rx="1" fill="url(#accent)"/>
  <text x="24" y="40" font-family="Orbitron,monospace" font-size="13" font-weight="900" fill="white" letter-spacing="4">CREAVIX</text>
  <text x="100" y="40" font-family="Orbitron,monospace" font-size="13" font-weight="900" fill="#00d4ff" letter-spacing="4">.WORLD</text>
  <text x="24" y="58" font-family="Exo 2,sans-serif" font-size="9" fill="rgba(0,212,255,0.5)" letter-spacing="3">MEMBER CARD</text>
  <rect x="24" y="72" width="40" height="40" rx="8" fill="rgba(0,212,255,0.1)" stroke="rgba(0,212,255,0.3)" stroke-width="1"/>
  <text x="44" y="97" font-family="Orbitron,monospace" font-size="14" font-weight="900" fill="#00d4ff" text-anchor="middle">${user?.name?.[0]?.toUpperCase() || 'U'}</text>
  <text x="76" y="90" font-family="Orbitron,monospace" font-size="14" font-weight="700" fill="white">${user?.name || 'Member'}</text>
  <text x="76" y="106" font-family="Exo 2,sans-serif" font-size="10" fill="rgba(148,163,184,0.7)">${user?.email || ''}</text>
  <text x="24" y="140" font-family="Exo 2,sans-serif" font-size="9" fill="rgba(148,163,184,0.5)" letter-spacing="2">MEMBER SINCE</text>
  <text x="24" y="155" font-family="Orbitron,monospace" font-size="11" fill="#00d4ff">${user?.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : format(new Date(), 'MMM dd, yyyy')}</text>
  <text x="200" y="140" font-family="Exo 2,sans-serif" font-size="9" fill="rgba(148,163,184,0.5)" letter-spacing="2">STATUS</text>
  <text x="200" y="155" font-family="Orbitron,monospace" font-size="11" fill="#22c55e">VERIFIED ✓</text>
  <rect x="24" y="170" width="372" height="1" fill="rgba(0,212,255,0.1)"/>
  <text x="24" y="192" font-family="Exo 2,sans-serif" font-size="9" fill="rgba(148,163,184,0.4)">This card certifies membership with CREAVIX WORLD digital agency.</text>
  <text x="24" y="208" font-family="Exo 2,sans-serif" font-size="9" fill="rgba(148,163,184,0.4)">instagram.com/creavixworld • teamcreavixworld.org@gmail.com</text>
  <rect x="340" y="170" width="56" height="56" rx="6" fill="rgba(0,212,255,0.05)" stroke="rgba(0,212,255,0.2)" stroke-width="1"/>
  <text x="368" y="202" font-family="Orbitron,monospace" font-size="8" fill="rgba(0,212,255,0.4)" text-anchor="middle">CX</text>
</svg>`

    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `creavix-member-${user?.name?.replace(/\s+/g, '-') || 'card'}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Card preview */}
      <div ref={cardRef}>
        <div
          className="relative rounded-2xl overflow-hidden w-full max-w-sm mx-auto"
          style={{
            background: 'linear-gradient(135deg, #0a1020 0%, #060a10 100%)',
            border: '1px solid rgba(0,212,255,0.25)',
            boxShadow: '0 0 30px rgba(0,212,255,0.1)',
            aspectRatio: '1.75',
            padding: '24px',
          }}
        >
          {/* Top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
            style={{ background: 'linear-gradient(90deg, #00d4ff, #7b2fff, #9d4edd)' }} />

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(0,212,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,1) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-display text-sm font-black text-white tracking-widest">CREAVIX</span>
                <span className="font-display text-sm font-black tracking-widest" style={{ color: '#00d4ff' }}>.WORLD</span>
              </div>
              <div className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(0,212,255,0.5)', fontSize: '8px' }}>
                Member Card
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-display text-base font-black flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(157,78,221,0.2))', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <div className="font-display text-sm font-bold text-white">{user?.name || 'Member'}</div>
                <div className="font-body text-xs" style={{ color: 'rgba(148,163,184,0.6)', fontSize: '10px' }}>{user?.email}</div>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <div className="font-mono uppercase tracking-widest mb-0.5" style={{ fontSize: '8px', color: 'rgba(148,163,184,0.4)' }}>Member Since</div>
                <div className="font-mono text-xs" style={{ color: '#00d4ff' }}>
                  {user?.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : format(new Date(), 'MMM dd, yyyy')}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono uppercase tracking-widest mb-0.5" style={{ fontSize: '8px', color: 'rgba(148,163,184,0.4)' }}>Status</div>
                <div className="flex items-center gap-1">
                  <RiShieldCheckLine size={12} style={{ color: '#22c55e' }} />
                  <span className="font-mono text-xs" style={{ color: '#22c55e' }}>Verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Corner decoration */}
          <div className="absolute bottom-4 right-4 w-10 h-10 rounded-lg flex items-center justify-center opacity-20"
            style={{ border: '1px solid rgba(0,212,255,0.5)' }}>
            <span className="font-display text-xs font-bold text-neon-blue">CX</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/10 transition-all font-body text-sm"
        >
          <RiPrinterLine size={16} />
          Print Card
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10 transition-all font-body text-sm"
        >
          <RiDownloadLine size={16} />
          Download SVG
        </motion.button>
      </div>
    </div>
  )
}
