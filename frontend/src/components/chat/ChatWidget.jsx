import { useState, useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'
import { useAuth, api } from '../../context/AuthContext'
import { RiMessage3Line, RiCloseLine, RiSendPlaneFill, RiCheckDoubleLine } from 'react-icons/ri'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'

let socketInstance = null

const getSocket = (token) => {
  if (!socketInstance || !socketInstance.connected) {
    socketInstance = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket'],
    })
  }
  return socketInstance
}

export default function ChatWidget() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [adminId, setAdminId] = useState(null)
  const [typing, setTyping] = useState(false)
  const [unread, setUnread] = useState(0)
  const [connected, setConnected] = useState(false)
  const bottomRef = useRef(null)
  const socketRef = useRef(null)
  const typingTimer = useRef(null)

  useEffect(() => {
    if (!user) return
    const token = localStorage.getItem('creavix_token')
    const socket = getSocket(token)
    socketRef.current = socket

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    socket.on('new_message', (msg) => {
      setMessages(prev => {
        if (prev.find(m => m._id === msg._id)) return prev
        return [...prev, msg]
      })
      if (!open && msg.senderRole === 'admin') {
        setUnread(u => u + 1)
      }
    })

    socket.on('user_typing', ({ isTyping }) => {
      setTyping(isTyping)
    })

    // Fetch history + admin id
    api.get('/chat/history/admin').then(res => {
      setMessages(res.data.messages || [])
      // Get admin id from first admin message or fetch
      const adminMsg = res.data.messages?.find(m => m.senderRole === 'admin')
      if (adminMsg) setAdminId(adminMsg.senderId._id)
    }).catch(() => {})

    // Fetch admin id separately if needed
    api.get('/auth/admin-id').then(res => {
      if (res.data.adminId) setAdminId(res.data.adminId)
    }).catch(() => {})

    return () => {
      socket.off('new_message')
      socket.off('user_typing')
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [user])

  useEffect(() => {
    if (open) {
      setUnread(0)
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [open, messages])

  const sendMessage = () => {
    if (!input.trim() || !adminId || !socketRef.current) return
    socketRef.current.emit('send_message', { toUserId: adminId, message: input.trim() })
    setInput('')
  }

  const handleTyping = (e) => {
    setInput(e.target.value)
    if (adminId && socketRef.current) {
      socketRef.current.emit('typing', { toUserId: adminId, isTyping: true })
      clearTimeout(typingTimer.current)
      typingTimer.current = setTimeout(() => {
        socketRef.current?.emit('typing', { toUserId: adminId, isTyping: false })
      }, 1500)
    }
  }

  if (!user || user.role === 'admin') return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 w-80 sm:w-96 glass rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            style={{ height: '480px', border: '1px solid rgba(0,212,255,0.2)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3"
              style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(157,78,221,0.15))', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white"
                    style={{ background: 'linear-gradient(135deg, #00d4ff, #9d4edd)' }}>
                    CX
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-dark-900 ${connected ? 'bg-green-400' : 'bg-slate-500'}`} />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-white">CREAVIX Support</p>
                  <p className="font-mono text-xs text-slate-400">{connected ? 'Online' : 'Connecting...'}</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <RiCloseLine size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: 'rgba(3,5,8,0.8)' }}>
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <RiMessage3Line size={32} className="mx-auto text-slate-600 mb-2" />
                  <p className="font-body text-xs text-slate-500">Send a message to start chatting with our team!</p>
                </div>
              )}
              {messages.map((msg) => {
                const isMe = msg.senderId?._id === user._id || msg.senderId === user._id
                return (
                  <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-3 py-2 rounded-2xl ${isMe ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
                      style={isMe
                        ? { background: 'linear-gradient(135deg, #00d4ff20, #9d4edd30)', border: '1px solid rgba(0,212,255,0.3)' }
                        : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }
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
                  <div className="px-3 py-2 rounded-2xl rounded-bl-sm" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
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
              <div className="flex gap-2 items-center">
                <input
                  value={input}
                  onChange={handleTyping}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-dark-800/80 border border-slate-700/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-blue/50 transition-colors"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || !adminId}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #00d4ff, #9d4edd)' }}
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