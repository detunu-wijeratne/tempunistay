import './StudentMessages.css';
import { useState, useEffect, useRef } from 'react';
import { Search, Send, Paperclip, MoreVertical, X, Plus } from 'lucide-react';
import DashboardLayout from 'components/layout/DashboardLayout/DashboardLayout';
import { useAuth } from 'context/AuthContext';
import { messageAPI, userAPI } from 'services/api';
import toast from 'react-hot-toast';

import { LayoutDashboard, BookOpen, Utensils, CreditCard, Sparkles, Shirt, Wrench, MessageSquare, Settings } from 'lucide-react';
const navItems = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/booking', label: 'My Booking', icon: BookOpen },
  { to: '/student/meals', label: 'Meal Orders', icon: Utensils },
  { to: '/student/payments', label: 'Payments', icon: CreditCard },
  { to: '/student/cleaning', label: 'Cleaning', icon: Sparkles },
  { to: '/student/laundry', label: 'Laundry', icon: Shirt },
  { to: '/student/maintenance', label: 'Maintenance', icon: Wrench },
  { to: '/student/messages', label: 'Messages', icon: MessageSquare },
  { to: '/student/settings', label: 'Settings', icon: Settings },
];

const ROLE_LABELS = {
  student: '🎓 Student', landlord: '🏠 Landlord',
  meal_provider: '🍽️ Meal Provider', facility: '🔧 Facility',
};
const ROLE_COLORS = {
  student: 'bg-blue-100 text-blue-700', landlord: 'bg-indigo-100 text-indigo-700',
  meal_provider: 'bg-orange-100 text-orange-700', facility: 'bg-teal-100 text-teal-700',
};
const CONTACTABLE = ['landlord','meal_provider','facility'];

export default function StudentMessages() {
  const { user } = useAuth();
  const [inbox, setInbox]           = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState('');
  const [search, setSearch]         = useState('');
  const [showNew, setShowNew]       = useState(false);
  const [contacts, setContacts]     = useState([]);
  const [contactSearch, setContactSearch] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(false);
  const bottomRef = useRef(null);
  const accent = { background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' };

  useEffect(() => {
    messageAPI.getInbox()
      .then(r => { setInbox(r.data.data); if (r.data.data.length) setActiveConv(r.data.data[0]); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeConv) return;
    messageAPI.getConversation(activeConv.partner._id)
      .then(r => setMessages(r.data.data))
      .catch(() => {});
  }, [activeConv]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (!showNew) return;
    setLoadingContacts(true);
    userAPI.getContacts(CONTACTABLE.join(','))
      .then(r => setContacts(r.data.data || []))
      .catch(() => setContacts([]))
      .finally(() => setLoadingContacts(false));
  }, [showNew]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeConv) return;
    try {
      const r = await messageAPI.send({ receiver: activeConv.partner._id, content: input });
      setMessages(prev => [...prev, r.data.data]);
      setInput('');
      setInbox(prev => prev.map(c =>
        c.partner._id === activeConv.partner._id ? { ...c, lastMessage: r.data.data } : c
      ));
    } catch { toast.error('Failed to send message'); }
  };

  const startConversation = (contact) => {
    const existing = inbox.find(c => c.partner._id === contact._id);
    if (existing) { setActiveConv(existing); }
    else {
      const newConv = { partner: contact, lastMessage: null, unreadCount: 0 };
      setInbox(prev => [newConv, ...prev]);
      setActiveConv(newConv);
      setMessages([]);
    }
    setShowNew(false);
    setContactSearch('');
  };

  const isMe = (msg) => {
    const sid = msg.sender?._id || msg.sender;
    return sid === user?._id || sid?.toString() === user?._id?.toString();
  };

  const filteredInbox = inbox.filter(c =>
    `${c.partner.firstName} ${c.partner.lastName}`.toLowerCase().includes(search.toLowerCase())
  );
  const filteredContacts = contacts.filter(c =>
    `${c.firstName} ${c.lastName} ${c.businessName || ''}`.toLowerCase().includes(contactSearch.toLowerCase())
  );

  return (
    <DashboardLayout navItems={navItems} accentColor="blue">
      <div className="flex gap-6 h-[calc(100vh-10rem)]">

        {/* Inbox list */}
        <div className="w-72 glass-panel flex flex-col flex-shrink-0 overflow-hidden">
          <div className="p-4 border-b border-slate-200 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none"
                placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button onClick={() => setShowNew(true)}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-white rounded-lg transition hover:opacity-90"
              style={accent}>
              <Plus className="w-4 h-4" /> New Message
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredInbox.length === 0 && !showNew && (
              <p className="text-xs text-slate-400 text-center p-6 leading-relaxed">
                No conversations yet.<br/>Click "New Message" to start one.
              </p>
            )}
            {filteredInbox.map(conv => (
              <div key={conv.partner._id} onClick={() => { setActiveConv(conv); setShowNew(false); }}
                className={`p-3 rounded-xl cursor-pointer flex gap-3 transition ${activeConv?.partner._id === conv.partner._id && !showNew ? 'bg-white border border-blue-200 shadow-sm' : 'hover:bg-white/50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${ROLE_COLORS[conv.partner.role] || 'bg-slate-100 text-slate-600'}`}>
                  {conv.partner.firstName?.[0]}{conv.partner.lastName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{conv.partner.firstName} {conv.partner.lastName}</p>
                  <p className="text-[10px] font-semibold text-slate-400">{ROLE_LABELS[conv.partner.role] || conv.partner.role}</p>
                  {conv.lastMessage && <p className="text-xs text-slate-500 truncate mt-0.5">{conv.lastMessage.content?.slice(0,35)}...</p>}
                </div>
                {conv.unreadCount > 0 && <span className="self-center w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* Main panel */}
        <div className="flex-1 glass-panel flex flex-col overflow-hidden">
          {showNew ? (
            <>
              <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white/50 flex-shrink-0">
                <h3 className="font-bold text-slate-800">New Message</h3>
                <button onClick={() => setShowNew(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                <p className="text-sm text-slate-500 mb-4">Select who you want to message:</p>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input className="w-full pl-9 pr-4 py-2.5 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Search by name..." value={contactSearch} onChange={e => setContactSearch(e.target.value)} autoFocus />
                </div>
                {loadingContacts ? (
                  <p className="text-sm text-slate-400 text-center py-10">Loading contacts...</p>
                ) : filteredContacts.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-10">No contacts found</p>
                ) : (
                  <div className="space-y-2">
                    {filteredContacts.map(contact => (
                      <button key={contact._id} onClick={() => startConversation(contact)}
                        className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition text-left">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${ROLE_COLORS[contact.role] || 'bg-slate-100 text-slate-600'}`}>
                          {contact.firstName?.[0]}{contact.lastName?.[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900">{contact.firstName} {contact.lastName}</p>
                          {contact.businessName && <p className="text-xs text-slate-500">{contact.businessName}</p>}
                          <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${ROLE_COLORS[contact.role] || 'bg-slate-100 text-slate-600'}`}>
                            {ROLE_LABELS[contact.role] || contact.role}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : !activeConv ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-3">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 opacity-30" />
              </div>
              <p className="font-semibold text-slate-500">Select a conversation or start a new one</p>
            </div>
          ) : (
            <>
              <div className="h-16 px-6 border-b border-slate-200 flex items-center justify-between bg-white/50 backdrop-blur-sm flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${ROLE_COLORS[activeConv.partner.role] || 'bg-slate-100 text-slate-600'}`}>
                    {activeConv.partner.firstName?.[0]}{activeConv.partner.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{activeConv.partner.firstName} {activeConv.partner.lastName}</p>
                    <p className="text-[10px] font-bold text-slate-400">{ROLE_LABELS[activeConv.partner.role] || activeConv.partner.role}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><MoreVertical className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 && (
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
                      Start the conversation
                    </span>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={msg._id || i} className={`flex ${isMe(msg) ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex flex-col ${isMe(msg) ? 'items-end' : 'items-start'} max-w-[75%]`}>
                      <div className={`p-3.5 text-sm shadow-sm ${isMe(msg) ? 'text-white rounded-[12px_12px_0_12px]' : 'bg-white text-slate-700 border border-slate-100 rounded-[12px_12px_12px_0]'}`}
                        style={isMe(msg) ? accent : {}}>
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <div className="p-4 bg-white border-t border-slate-200 flex-shrink-0">
                <form onSubmit={handleSend} className="flex gap-2 items-center">
                  <button type="button" className="p-3 rounded-xl hover:bg-slate-100 text-slate-400 transition flex-shrink-0">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input className="flex-1 bg-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Type a message..." value={input} onChange={e => setInput(e.target.value)} />
                  <button type="submit" className="p-3 text-white rounded-xl hover:opacity-90 transition flex-shrink-0" style={accent}>
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
