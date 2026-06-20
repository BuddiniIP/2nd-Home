import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Send, MessageSquare, User, ArrowLeft } from 'lucide-react';

const Chat = () => {
  const navigate = useNavigate();
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
  const token = localStorage.getItem('token');
  const authHeaders = { Authorization: `Bearer ${token}` };

  const goBack = () => { if (window.history.length > 1) navigate(-1); else navigate('/'); };
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const msgsEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetch(`${apiBase}/api/chat/conversations`, { headers: authHeaders })
      .then(r => r.json())
      .then(setConversations)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeConv) return;
    fetch(`${apiBase}/api/chat/conversations/${activeConv._id}/messages`, { headers: authHeaders })
      .then(r => r.json())
      .then(setMessages)
      .catch(() => {});
  }, [activeConv]);

  useEffect(() => {
    msgsEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;
    setSending(true);
    try {
      const res = await fetch(`${apiBase}/api/chat/conversations/${activeConv._id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ content: newMessage.trim() }),
      });
      if (res.ok) {
        const msg = await res.json();
        setMessages(prev => [...prev, msg]);
        setNewMessage('');
        setConversations(prev => prev.map(c =>
          c._id === activeConv._id ? { ...c, lastMessage: msg.content, lastMessageAt: msg.createdAt } : c
        ));
      }
    } catch {}
    finally { setSending(false); }
  };

  const otherParticipant = (conv: any) => {
    const me = localStorage.getItem('userId');
    return conv.participants?.find((p: any) => p._id !== me) || conv.participants?.[0] || {};
  };

  const formatTime = (t: string) => {
    if (!t) return '';
    const d = new Date(t);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString();
  };

  return (
    <div className="pt-32 pb-24 px-6 bg-[#F8F8F8] min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-accent-orange transition-colors uppercase tracking-widest">
            <ChevronLeft size={14} /> Back
          </button>
          <h1 className="text-5xl font-display font-bold text-black tracking-tight">Messages</h1>
        </div>

        <div className="flex gap-6 h-[600px]">
          {/* Sidebar */}
          <div className="w-80 shrink-0 bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-50">
              <h2 className="text-sm font-bold uppercase tracking-widest">Conversations</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">No conversations yet</div>
              ) : conversations.map((conv) => {
                const other = otherParticipant(conv);
                const isActive = activeConv?._id === conv._id;
                return (
                  <button key={conv._id} onClick={() => setActiveConv(conv)}
                    className={`w-full text-left p-5 border-b border-gray-50 hover:bg-gray-50 transition-all ${isActive ? 'bg-gray-50' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                        <User size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold truncate">{other.firstName} {other.lastName}</p>
                        <p className="text-xs text-gray-400 truncate">{conv.lastMessage || 'No messages yet'}</p>
                      </div>
                      {conv.lastMessageAt && (
                        <span className="text-[9px] text-gray-400 shrink-0">{formatTime(conv.lastMessageAt)}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-gray-50 flex flex-col overflow-hidden">
            {!activeConv ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <MessageSquare size={36} />
                  </div>
                  <p className="text-sm font-bold">Select a conversation</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="p-6 border-b border-gray-50 flex items-center gap-4">
                  <button className="md:hidden" onClick={() => setActiveConv(null)}>
                    <ArrowLeft size={18} />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{otherParticipant(activeConv).firstName} {otherParticipant(activeConv).lastName}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                      {activeConv.listing?.title || 'General'}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm py-12">No messages yet. Say hello!</div>
                  ) : messages.map((msg) => {
                    const isMine = msg.sender?._id === localStorage.getItem('userId');
                    return (
                      <div key={msg._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed ${isMine ? 'bg-black text-white rounded-br-md' : 'bg-gray-100 text-black rounded-bl-md'}`}>
                          <p>{msg.content}</p>
                          <p className={`text-[9px] mt-1 ${isMine ? 'text-gray-400' : 'text-gray-400'}`}>
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={msgsEnd} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 border-t border-gray-50 flex gap-3">
                  <input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 bg-[#F8F8F8] border border-transparent focus:border-accent-orange focus:bg-white transition-all rounded-full px-6 py-3 text-sm outline-none" />
                  <button type="submit" disabled={sending || !newMessage.trim()} className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-accent-orange transition-all disabled:opacity-50">
                    <Send size={16} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
