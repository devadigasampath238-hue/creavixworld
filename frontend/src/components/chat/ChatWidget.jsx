import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuth, api } from '../../context/AuthContext'
import { RiMessage3Line, RiCloseLine, RiSendPlaneFill, RiCheckDoubleLine } from 'react-icons/ri'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

export default function ChatWidget() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [adminId, setAdminId] = useState(null)
  const [typing, setTyping] = useState(false)
  const [unread, setUnread] = useState(0)
  const [status, setStatus] = useState('disconnected') // disconnected | connecting | connected
  const bottomRef = useRef(null)
  const socketRef = useRef(null)
  const typingTimer = useRef(null)

  useEffect(() => {
    if (!user || user.role === 'admin') return

    const token = localStorage.getItem('creavix_token')

    // Get admin ID first
    api.get('/auth/admin-id')
      .then(res => { if (res.data.adminId) setAdminId(res.data.adminId) })
      .catch(() => {})

    // Connect socket with both transports (polling first, then upgrade to websocket)
    setStatus('connecting')
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['polling', 'websocket'], // polling first for Render compatibility
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })
    socketRef.current = socket

    socket.on('connect', () => {
      setStatus('connected')
      // Load history after connect
      api.get('/chat/history/admin')
        .then(res => setMessages(res.data.messages || []))
        .catch(() => {})
    })

    socket.on('disconnect', () => setStatus('disconnected'))
    socket.on('connect_error', () => setStatus('disconnected'))

    socket.on('new_message', (msg) => {
      setMessages(prev => prev.find(m => m._id === msg._id) ? prev : [...prev, msg])
      if (!open && msg.senderRole === 'admin') setUnread(u => u + 1)
    })

    socket.on('user_typing', ({ isTyping }) => setTyping(isTyping))

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [user])

  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [open, messages])

  const sendMessage = () => {
    if (!input.trim() || !adminId || !socketRef.current || status !== 'connected') return
    socketRef.current.emit('send_message', { toUserId: adminId, message: input.trim() })
    setInput('')
  }

  const handleTyping = (e) => {
    setInput(e.target.value)
    if (adminId && socketRef.current && status === 'connected') {
      socketRef.current.emit('typing', { toUserId: adminId, isTyping: true })
      clearTimeout(typingTimer.current)
      typingTimer.current = setTimeout(() => {
        socketRef.current?.emit('typing', { toUserId: adminId, isTyping: false })
      }, 1500)
    }
  }

  if (!user || user.role === 'admin') return null

  const statusLabel = status === 'connected' ? 'Online' : status === 'connecting' ? 'Connecting...' : 'Offline'
  const statusColor = status === 'connected' ? 'bg-green-400' : status === 'connecting' ? 'bg-yellow-400 animate-pulse' : 'bg-slate-500'
  const canSend = input.trim().length > 0 && adminId && status === 'connected'

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            style={{ height: '480px', background: 'rgba(6,10,20,0.97)', border: '1px solid rgba(0,212,255,0.2)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3"
              style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(157,78,221,0.12))', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white"
                    style={{ background: 'linear-gradient(135deg, #00d4ff, #9d4edd)' }}>
                    CX
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-dark-900 ${statusColor}`} />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-white">CREAVIX Support</p>
                  <p className="font-mono text-xs text-slate-400">{statusLabel}</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <RiCloseLine size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <RiMessage3Line size={32} className="mx-auto text-slate-600 mb-2" />
                  <p className="font-body text-xs text-slate-500">Send a message to start chatting with our team!</p>
                </div>
              )}
              {messages.map((msg) => {
                const isMe = msg.senderRole === 'user'
                return (
                  <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-3 py-2 rounded-2xl ${isMe ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
                      style={isMe
                        ? { background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(157,78,221,0.2))', border: '1px solid rgba(0,212,255,0.3)' }
                        : { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }
                      }
                    >
                      <p className="font-body text-xs text-white leading-relaxed">{msg.message}</p>
                      <p className="font-mono text-[10px] text-slate-500 mt-1 text-right">
                        {format(new Date(msg.createdAt), 'HH:mm')}
                        {isMe && <RiCheckDoubleLine className="inline ml-1 text-neon-cyan" size={11} />}
                      </p>
                    </div>
                  </div>
                )
              })}
              {typing && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-2xl rounded-bl-sm" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="flex gap-1 items-center h-4">
                      {[0,1,2].map(i => (
                        <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(3,5,8,0.9)' }}>
              {status !== 'connected' && (
                <p className="font-mono text-[10px] text-yellow-400 text-center mb-2">
                  {status === 'connecting' ? '⏳ Connecting to server...' : '🔴 Disconnected — retrying...'}
                </p>
              )}
              <div className="flex gap-2 items-center">
                <input
                  value={input}
                  onChange={handleTyping}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder={status === 'connected' ? 'Type a message...' : 'Waiting for connection...'}
                  disabled={status !== 'connected'}
                  className="flex-1 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors disabled:opacity-50"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!canSend}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ background: canSend ? 'linear-gradient(135deg, #00d4ff, #9d4edd)' : 'rgba(255,255,255,0.1)' }}
                >
                  <RiSendPlaneFill size={15} className="text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(o => !o)}
        className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #00d4ff, #9d4edd)' }}
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><RiCloseLine size={24} className="text-white" /></motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><RiMessage3Line size={24} className="text-white" /></motion.div>
          }
        </AnimatePresence>
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </motion.button>
    </div>
  )
}