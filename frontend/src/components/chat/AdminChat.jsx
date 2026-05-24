import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuth, api } from '../../context/AuthContext'
import { RiSendPlaneFill, RiMessage3Line, RiCheckDoubleLine, RiRefreshLine } from 'react-icons/ri'
import { format } from 'date-fns'
import { motion } from 'framer-motion'

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'

export default function AdminChat() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState(new Set())
  const [status, setStatus] = useState('disconnected')
  const [loadingConvs, setLoadingConvs] = useState(true)
  const socketRef = useRef(null)
  const bottomRef = useRef(null)
  const typingTimer = useRef(null)
  const activeConvRef = useRef(null)

  // Keep ref in sync so socket handlers can access latest activeConv
  useEffect(() => { activeConvRef.current = activeConv }, [activeConv])

  useEffect(() => {
    if (!user || user.role !== 'admin') return
    const token = localStorage.getItem('creavix_token')

    // Connect socket
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 3000,
    })
    socketRef.current = socket

    socket.on('connect', () => {
      setStatus('connected')
      fetchConversations()
    })
    socket.on('disconnect', () => setStatus('disconnected'))
    socket.on('connect_error', () => setStatus('disconnected'))
    socket.on('reconnect', () => {
      setStatus('connected')
      fetchConversations()
    })

    socket.on('new_message', (msg) => {
      // Add to messages if this conversation is open
      if (activeConvRef.current) {
        const convUserId = activeConvRef.current.userId
        const msgUserId = msg.conversationId?.split('_')[0]
        if (convUserId === msgUserId) {
          setMessages(prev => prev.find(m => m._id === msg._id) ? prev : [...prev, msg])
        }
      }
      // Always refresh conversation list to show latest message
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
      if (activeConvRef.current?.userId === fromUserId) setTyping(isTyping)
    })

    fetchConversations()

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [user])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchConversations = async () => {
    try {
      setLoadingConvs(true)
      const res = await api.get('/chat/conversations')
      setConversations(res.data.conversations || res.data.data?.conversations || [])
    } catch (e) {
      console.error('Failed to fetch conversations', e)
    } finally {
      setLoadingConvs(false)
    }
  }

  const openConversation = async (conv) => {
    const userId = conv._id.split('_')[0]
    const convData = { userId, userName: conv.user?.name || 'User', conversationId: conv._id }
    setActiveConv(convData)
    setMessages([])
    try {
      const res = await api.get(`/chat/history/${userId}`)
      setMessages(res.data.messages || res.data.data?.messages || [])
      socketRef.current?.emit('mark_read', { conversationId: conv._id })
      // Refresh to clear unread badge
      fetchConversations()
    } catch (e) {
      console.error('Failed to load messages', e)
    }
  }

  const sendMessage = () => {
    if (!input.trim() || !activeConv) return

    if (socketRef.current?.connected) {
      socketRef.current.emit('send_message', {
        toUserId: activeConv.userId,
        message: input.trim(),
      })
    } else {
      // REST fallback
      api.post('/chat/send', { toUserId: activeConv.userId, message: input.trim() })
        .then(res => {
          const msg = res.data.message || res.data.data?.message
          if (msg) setMessages(prev => [...prev, msg])
          fetchConversations()
        })
        .catch(() => {})
    }
    setInput('')
  }

  const handleTyping = (e) => {
    setInput(e.target.value)
    if (activeConv && socketRef.current?.connected) {
      socketRef.current.emit('typing', { toUserId: activeConv.userId, isTyping: true })
      clearTimeout(typingTimer.current)
      typingTimer.current = setTimeout(() => {
        socketRef.current?.emit('typing', { toUserId: activeConv.userId, isTyping: false })
      }, 1500)
    }
  }

  const statusDot = status === 'connected' ? 'bg-green-400' : 'bg-red-400 animate-pulse'

  return (
    <div className="flex h-[600px] rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(0,212,255,0.15)', background: 'rgba(6,10,20,0.8)' }}>

      {/* Sidebar */}
      <div className="w-64 flex flex-col flex-shrink-0" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <h3 className="font-display text-sm font-bold text-white">Messages</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${statusDot}`} />
              <p className="font-mono text-xs text-slate-500">{status === 'connected' ? 'Live' : 'Reconnecting...'}</p>
            </div>
          </div>
          <button onClick={fetchConversations} className="text-slate-500 hover:text-neon-blue transition-colors">
            <RiRefreshLine size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-slate-700/50 flex-shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-slate-700/50 rounded w-2/3" />
                    <div className="h-2 bg-slate-700/50 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center mt-8">
              <RiMessage3Line size={24} className="mx-auto text-slate-600 mb-2" />
              <p className="font-body text-xs text-slate-500">No messages yet</p>
              <p className="font-mono text-[10px] text-slate-600 mt-1">Users will appear here when they message you</p>
            </div>
          ) : (
            conversations.map(conv => {
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
                        style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.4), rgba(157,78,221,0.4))' }}>
                        {conv.user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-dark-900 ${isOnline ? 'bg-green-400' : 'bg-slate-600'}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-display text-xs font-semibold text-white truncate">{conv.user?.name || 'Unknown'}</p>
                        {conv.unreadCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-neon-blue text-dark-900 text-[9px] font-bold flex items-center justify-center flex-shrink-0 ml-1">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="font-body text-[10px] text-slate-500 truncate">
                        {conv.lastMessage?.message || ''}
                      </p>
                      <p className="font-mono text-[9px] text-slate-600">
                        {conv.lastMessage?.createdAt ? format(new Date(conv.lastMessage.createdAt), 'MMM d, HH:mm') : ''}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {!activeConv ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <RiMessage3Line size={40} className="mx-auto text-slate-600 mb-3" />
              <p className="font-display text-sm text-slate-500">Select a conversation</p>
              <p className="font-mono text-xs text-slate-600 mt-1">Click a user from the left panel</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
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
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: 'rgba(3,5,8,0.4)' }}>
              {messages.length === 0 && (
                <div className="text-center py-10">
                  <p className="font-body text-xs text-slate-600">No messages yet in this conversation</p>
                </div>
              )}
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
            <div className="px-4 py-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}>
              <div className="flex gap-2 items-center">
                <input
                  value={input}
                  onChange={handleTyping}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder={`Reply to ${activeConv.userName}...`}
                  className="flex-1 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="w-9 h-9 rounded-xl flex items-center justify-center disabled:opacity-30 transition-all"
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