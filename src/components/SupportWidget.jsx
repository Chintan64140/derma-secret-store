import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2, Minimize2, Power } from 'lucide-react';
import { useAuth, API } from '../context/AuthContext';

const SupportWidget = () => {
  const { user, token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null); // holds the active session
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMessages, setFetchingMessages] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Load existing session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('support_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        if (parsed && parsed.id && parsed.status === 'open') {
          setSession(parsed);
        }
      } catch (err) {
        console.error('Error parsing support session:', err);
      }
    }
  }, []);

  // Poll for new messages every 3 seconds if panel is open and session is active
  useEffect(() => {
    if (!isOpen || !session?.id) return;

    const fetchMessages = async () => {
      try {
        const res = await API.get(`/support/messages/${session.id}`);
        setMessages(res.data);
      } catch (err) {
        console.error('Error fetching chat messages:', err.message);
      }
    };

    fetchMessages(); // fetch immediately
    const interval = setInterval(fetchMessages, 3000);

    return () => clearInterval(interval);
  }, [isOpen, session]);

  const handleStartChat = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const payload = {};
      if (!user) {
        payload.guestName = guestName.trim() || 'Anonymous Guest';
        payload.guestEmail = guestEmail.trim();
      }

      const config = {};
      if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
      }

      const res = await API.post('/support/session', payload, config);
      const newSession = res.data;
      
      setSession(newSession);
      localStorage.setItem('support_session', JSON.stringify(newSession));
      setMessages([]);
    } catch (err) {
      console.error('Error starting support session:', err);
      const errMsg = err.response?.data?.message || err.message;
      alert(`Failed to start support session: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!message.trim() || !session?.id) return;

    const textToSend = message.trim();
    setMessage('');

    // Append locally immediately for smooth UI
    const tempMsg = {
      id: Date.now(),
      session_id: session.id,
      message: textToSend,
      sender_type: 'customer',
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const config = {};
      if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
      }

      await API.post('/support/message', {
        sessionId: session.id,
        message: textToSend,
        senderType: 'customer'
      }, config);
    } catch (err) {
      console.error('Error sending message:', err.message);
    }
  };

  const handleEndChat = async () => {
    if (!session?.id) return;
    if (!window.confirm('Are you sure you want to end this support session?')) return;

    setLoading(true);
    try {
      await API.post(`/support/session/${session.id}/close`);
      setSession(null);
      localStorage.removeItem('support_session');
      setMessages([]);
      setIsOpen(false);
    } catch (err) {
      console.error('Error ending support session:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* 1. Floating Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-brand-blue text-white rounded-full p-4 shadow-2xl hover:bg-brand-blue/90 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer group relative"
          title="Live Chat Support"
        >
          <MessageSquare size={24} />
          {session?.status === 'open' && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full" />
          )}
        </button>
      )}

      {/* 2. Chat Widget Box */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[480px] bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-up transition-colors duration-300">
          
          {/* Header */}
          <div className="bg-brand-blue text-white px-4 py-3.5 flex justify-between items-center select-none shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider font-heading">Derma Lab Support</h3>
                <p className="text-[9px] text-blue-200 font-semibold uppercase">Average reply: 2 mins</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {session && (
                <button
                  onClick={handleEndChat}
                  disabled={loading}
                  className="p-1 rounded text-red-300 hover:bg-white/10 hover:text-red-400 transition-colors cursor-pointer"
                  title="End Chat Session"
                >
                  <Power size={14} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-white/10 text-white transition-colors cursor-pointer"
                title="Minimize"
              >
                <Minimize2 size={15} />
              </button>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 overflow-y-auto p-4 bg-brand-bg-grey/30 dark:bg-zinc-950/20 flex flex-col justify-between">
            
            {/* Case A: Active Session -> Display messages */}
            {session ? (
              <div className="flex-1 flex flex-col space-y-3 overflow-y-auto pr-1">
                <div className="text-center py-2">
                  <span className="bg-brand-blue/10 dark:bg-zinc-800 text-brand-blue text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                    Support Session Initiated
                  </span>
                  <p className="text-[8px] text-brand-grey dark:text-gray-400 mt-1 uppercase tracking-wide">
                    Connected. Type below to converse.
                  </p>
                </div>

                {messages.length === 0 ? (
                  <div className="text-center py-10 text-brand-grey dark:text-gray-400 text-xs">
                    No messages yet. Send a message to start the conversation!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isSelf = msg.sender_type === 'customer';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[75%] ${isSelf ? 'self-end items-end' : 'self-start items-start'}`}
                      >
                        <div
                          className={`px-3 py-2 rounded-2xl text-xs break-words shadow-xs border ${
                            isSelf
                              ? 'bg-brand-blue text-white rounded-tr-none border-brand-blue/30'
                              : 'bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-200 rounded-tl-none border-brand-border dark:border-zinc-800'
                          }`}
                        >
                          {msg.message}
                        </div>
                        <span className="text-[8px] text-brand-grey dark:text-gray-450 mt-0.5">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              
              /* Case B: No Active Session -> Registration Form */
              <div className="flex-1 flex flex-col justify-center p-2 space-y-6">
                <div className="text-center space-y-2">
                  <h4 className="text-sm font-extrabold text-brand-dark dark:text-white uppercase tracking-wider font-heading">
                    Consult Support Team
                  </h4>
                  <p className="text-[10px] text-brand-grey dark:text-gray-450 leading-relaxed max-w-xs mx-auto">
                    Start a live chat session to clear order queries, product prescriptions, or clinical questions.
                  </p>
                </div>

                {user ? (
                  // Logged-in Start
                  <div className="bg-brand-bg-grey dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 rounded-xl p-4 text-center space-y-3.5 shadow-xs">
                    <span className="text-[10px] font-bold text-brand-blue dark:text-blue-400 uppercase tracking-widest block font-heading">Logged In</span>
                    <p className="text-xs text-brand-dark dark:text-gray-300 font-semibold">
                      Welcome back, <strong className="text-brand-blue">{user.name}</strong>
                    </p>
                    <button
                      onClick={handleStartChat}
                      disabled={loading}
                      className="w-full py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded font-bold font-heading text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={13} className="animate-spin" /> Starting...
                        </>
                      ) : (
                        'Start Support Chat'
                      )}
                    </button>
                  </div>
                ) : (
                  // Guest Start
                  <form onSubmit={handleStartChat} className="space-y-3 bg-white dark:bg-zinc-900 p-4 border border-brand-border dark:border-zinc-850 rounded-xl shadow-xs">
                    <div>
                      <label className="block text-[9px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        className="w-full px-3 py-1.5 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
                        placeholder="e.g. Amit Sharma"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-brand-grey dark:text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        className="w-full px-3 py-1.5 border border-brand-border dark:border-zinc-800 rounded text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
                        placeholder="e.g. amit@example.com"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white rounded font-bold font-heading text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-sm mt-3"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={13} className="animate-spin" /> Connecting...
                        </>
                      ) : (
                        'Connect to Chat'
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Typing area */}
          {session && (
            <form onSubmit={handleSendMessage} className="border-t border-brand-border dark:border-zinc-800 p-3 flex gap-2 bg-white dark:bg-zinc-900 transition-colors duration-300">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-brand-border dark:border-zinc-800 rounded-lg text-xs bg-white dark:bg-zinc-850 text-brand-dark dark:text-gray-150 focus:outline-none focus:border-brand-blue"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="bg-brand-blue hover:bg-brand-blue-dark text-white p-2.5 rounded-lg disabled:opacity-40 transition-colors flex items-center justify-center cursor-pointer shadow-xs"
              >
                <Send size={14} />
              </button>
            </form>
          )}

        </div>
      )}
    </div>
  );
};

export default SupportWidget;
