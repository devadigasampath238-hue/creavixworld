import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiRobot2Line, RiCloseLine, RiSendPlane2Line, RiSparklingLine } from 'react-icons/ri'

const SUGGESTED = [
  'What services do you provide?',
  'Can you build AI apps?',
  'Can you create websites?',
  'Pricing details',
]

const RESPONSES = {
  'what services do you provide': `We offer:\n• Web Design & UI/UX\n• Business & Portfolio Websites\n• E-commerce Stores\n• Admin Dashboards\n• Custom Web Applications\n• AI-powered features\n• Branding & Identity`,
  'can you build ai apps': `Absolutely! 🤖 We build:\n• AI Chatbots & Assistants\n• AI Image Generators\n• Smart Recommendation Engines\n• Automation Systems\n• Voice Assistants\n• AI Data Analysis Dashboards`,
  'can you create websites': `Yes! We create stunning websites:\n• Modern responsive designs\n• Cyberpunk/futuristic aesthetics\n• Fast-loading & SEO optimized\n• Mobile-first approach\n• Custom animations\n\nCheck our portfolio for examples!`,
  'pricing details': `Our packages:\n\n💎 Starter — $499\nBasic 5-page website\n\n🚀 Business — $1,299\nFull-featured site + CMS\n\n⚡ Premium — $2,999\nCustom web application\n\nContact us for a custom quote!`,
  default: `Great question! 🌟 I'd recommend reaching out to our team directly for detailed answers.\n\n📧 teamcreavixworld.org@gmail.com\n📸 @creavixworld on Instagram\n\nOr submit a project request from your dashboard!`,
}

function getResponse(msg) {
  const lower = msg.toLowerCase()
  for (const [key, val] of Object.entries(RESPONSES)) {
    if (key !== 'default' && lower.includes(key.split(' ')[1])) return val
  }
  if (lower.includes('price') || lower.includes('cost') || lower.includes('pricing')) return RESPONSES['pricing details']
  if (lower.includes('ai') || lower.includes('chatbot') || lower.includes('smart')) return RESPONSES['can you build ai apps']
  if (lower.includes('web') || lower.includes('site') || lower.includes('design')) return RESPONSES['can you create websites']
  if (lower.includes('service') || lower.includes('what') || lower.includes('offer')) return RESPONSES['what services do you provide']
  return RESPONSES.default
}

function TypingDots() {
  return (
    <div className="flex gap-1 items-center px-4 py-3">
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="w-2 h-2 rounded-full bg-neon-blue"
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
      ))}
    </div>
  )
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'ai', text: "Hi 👋 I'm CREAVIX AI! I can help explain services, answer questions, and suggest solutions." }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [pulse, setPulse] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 5000)
    return () => clearTimeout(t)
  }, [])

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')
    setMessages(prev => [...prev, { from: 'user', text: msg }])
    setTyping(true)
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600))
    setTyping(false)
    setMessages(prev => [...prev, { from: 'ai', text: getResponse(msg) }])
  }

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {pulse && !open && (
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="absolute -top-10 right-0 bg-dark-800 border border-neon-blue/30 text-neon-blue text-xs font-mono px-3 py-1.5 rounded-lg whitespace-nowrap"
              style={{ boxShadow: '0 0 15px rgba(0,212,255,0.2)' }}>
              Ask CREAVIX AI ✨
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse rings */}
        {!open && (
          <>
            <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: '#00d4ff' }} />
            <div className="absolute -inset-2 rounded-full animate-pulse opacity-10" style={{ background: '#00d4ff' }} />
          </>
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(!open)}
          className="relative w-14 h-14 rounded-full flex items-center justify-center text-white font-bold z-10"
          style={{
            background: 'linear-gradient(135deg, #00b8d9, #7b2fff)',
            boxShadow: '0 0 25px rgba(0,212,255,0.4), 0 0 50px rgba(123,47,255,0.2)',
          }}
        >
          <AnimatePresence mode="wait">
            {open
              ? <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><RiCloseLine size={24} /></motion.div>
              : <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><RiRobot2Line size={24} /></motion.div>
            }
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(6,10,20,0.97)',
              border: '1px solid rgba(0,212,255,0.2)',
              boxShadow: '0 0 40px rgba(0,212,255,0.1), 0 20px 60px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div className="p-4 border-b border-neon-blue/10" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(123,47,255,0.08))' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00b8d9, #7b2fff)' }}>
                  <RiRobot2Line size={18} className="text-white" />
                </div>
                <div>
                  <div className="font-display text-xs font-bold text-white tracking-wider">CREAVIX AI</div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="font-mono text-xs text-green-400">Online</span>
                  </div>
                </div>
                <RiSparklingLine className="ml-auto text-neon-blue animate-pulse" size={16} />
              </div>
            </div>

            {/* Messages */}
            <div className="h-72 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'thin' }}>
              {messages.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs font-body leading-relaxed whitespace-pre-line ${
                    m.from === 'user'
                      ? 'text-white rounded-br-none'
                      : 'text-slate-200 rounded-bl-none'
                  }`} style={m.from === 'user'
                    ? { background: 'linear-gradient(135deg, #00b8d9, #7b2fff)' }
                    : { background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }
                  }>
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="rounded-xl rounded-bl-none" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}>
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggested questions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {SUGGESTED.map(q => (
                  <button key={q} onClick={() => sendMessage(q)}
                    className="text-xs font-body px-3 py-1.5 rounded-full border border-neon-blue/20 text-neon-blue hover:bg-neon-blue/10 transition-all">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-neon-blue/10">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask anything..."
                  className="flex-1 bg-dark-800 border border-neon-blue/15 text-white text-xs font-body rounded-lg px-3 py-2 outline-none focus:border-neon-blue/40 placeholder-slate-600"
                />
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => sendMessage()}
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #00b8d9, #7b2fff)' }}>
                  <RiSendPlane2Line size={16} className="text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
