import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuth, api } from '../../context/AuthContext'
import { RiSendPlaneFill, RiMessage3Line, RiCheckDoubleLine } from 'react-icons/ri'
import { format } from 'date-fns'
import { motion } from 'framer-motion'

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

export default function AdminChat() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv] = useState(null) // { userId, userName, conversationId }
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState(new Set())
  const socketRef = useRef(null)
  const bottomRef = useRef(null)
  const typingTimer = useRef(null)

  useEffect(() => {
    if (!user || user.role !== 'admin') return
    const token = localStorage.getItem('creavix_token')
    const socket = getSocket(token)
    socketRef.current = socket

    socket.on('new_message', (msg) => {
      // Update messages if in active conversation
      setMessages(prev => {
        if (prev.find(m => m._id === msg._id)) return prev
        return [...prev, msg]
      })
      // Update conversation list
      fetchConversations()
    })

    socket.on('user_online', ({ userId, online }) => {
      setOnlineUsers(prev => {
        const next = new Set(prev)
        online ? next.add(userId) : next.delete(userId)
        return next
      })
    })

    socket.on('user_typing', ({ fromUserId, isTyping }) => {
      if (activeConv?.userId === fromUserId) setTyping(isTyping)
    })

    fetchConversations()

    return () => {
      socket.off('new_message')
      socket.off('user_online')
      socket.off('user_typing')
    }
  }, [user])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchConversations = async () => {
    try {
      const res = await api.get('/chat/conversations')
      setConversations(res.data.conversations || [])
    } catch {}
  }

  const openConversation = async (conv) => {
    const userId = conv._id.split('_')[0]
    setActiveConv({ userId, userName: conv.user?.name || 'User', conversationId: conv._id })
    try {
      const res = await api.get(`/chat/history/${userId}`)
      setMessages(res.data.messages || [])
      socketRef.current?.emit('mark_read', { conversationId: conv._id })
    } catch {}
  }

  const sendMessage = () => {
    if (!input.trim() || !activeConv || !socketRef.current) return
    socketRef.current.emit('send_message', { toUserId: activeConv.userId, message: input.trim() })
    setInput('')
  }

  const handleTyping = (e) => {
    setInput(e.target.value)
    if (activeConv && socketRef.current) {
      socketRef.current.emit('typing', { toUserId: activeConv.userId, isTyping: true })
      clearTimeout(typingTimer.current)
      typingTimer.current = setTimeout(() => {
        socketRef.current?.emit('typing', { toUserId: activeConv.userId, isTyping: false })
      }, 1500)
    }
  }

  return (
    <div className="flex h-[600px] glass rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,212,255,0.15)' }}>
      {/* Sidebar - Conversations */}
      <div className="w-64 flex flex-col" style={{ borderRight: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
        <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="font-display text-sm font-bold text-white">Messages</h3>
          <p className="font-mono text-xs text-slate-500">{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 && (
            <div className="p-4 text-center">
              <RiMessage3Line size={24} className="mx-auto text-slate-600 mb-2" />
              <p className="font-body text-xs text-slate-500">No messages yet</p>
            </div>
          )}
          {conversations.map(conv => {
            const userId = conv._id.split('_')[0]
            const isActive = activeConv?.conversationId === conv._id
            const isOnline = onlineUsers.has(userId)
            return (
              <button
                key={conv._id}
                onClick={() => openConversation(conv)}
                className={`w-full text-left px-4 py-3 transition-all ${isActive ? 'bg-neon-blue/10' : 'hover:bg-white/5'}`}
                style={isActive ? { borderLeft: '2px solid #00d4ff' } : { borderLeft: '2px solid transparent' }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #00d4ff40, #9d4edd40)' }}>
                      {conv.user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-dark-900 ${isOnline ? 'bg-green-400' : 'bg-slate-600'}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-display text-xs font-semibold text-white truncate">{conv.user?.name || 'Unknown'}</p>
                      {conv.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-neon-blue text-dark-900 text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="font-body text-[10px] text-slate-500 truncate">
                      {conv.lastMessage?.message || ''}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {!activeConv ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <RiMessage3Line size={40} className="mx-auto text-slate-600 mb-3" />
              <p className="font-display text-sm text-slate-500">Select a conversation</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #9d4edd)' }}>
                {activeConv.userName[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-white">{activeConv.userName}</p>
                <p className="font-mono text-xs text-slate-400">
                  {onlineUsers.has(activeConv.userId) ? '🟢 Online' : '⚫ Offline'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: 'rgba(3,5,8,0.5)' }}>
              {messages.map(msg => {
                const isMe = msg.senderRole === 'admin'
                return (
                  <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-3 py-2 rounded-2xl ${isMe ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
                      style={isMe
                        ? { background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(157,78,221,0.2))', border: '1px solid rgba(0,212,255,0.3)' }
                        : { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }
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
            <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
              <div className="flex gap-2 items-center">
                <input
                  value={input}
                  onChange={handleTyping}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder={`Reply to ${activeConv.userName}...`}
                  className="flex-1 bg-dark-800/80 border border-slate-700/50 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-blue/50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #00d4ff, #9d4edd)' }}
                >
                  <RiSendPlaneFill size={15} className="text-white" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}