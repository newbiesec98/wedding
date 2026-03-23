import React, { useState, useEffect } from 'react';
import { getGuests, addGuest } from '../data/guestStore';
import { FaUserCircle, FaPaperPlane } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../utils/LanguageContext';

export default function GuestBook({ guestName }) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState({
    name: guestName || '',
    message: ''
  });

  useEffect(() => {
    loadMessages();
    // In a real app we'd use polling or websockets. Here we just load once.
  }, []);

  const loadMessages = async () => {
    const guests = await getGuests();
    // Filter visitors who have left a message
    const msgList = guests
      .filter(g => g.message && g.message.trim() !== '')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setMessages(msgList);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.name.trim() || !newMsg.message.trim()) return;

    // Treat as a new guest entry or an update via guest storage
    await addGuest({
      name: newMsg.name,
      message: newMsg.message,
      status: '-',
      rsvpStatus: false
    });

    setNewMsg({ ...newMsg, message: '' });
    await loadMessages();
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const date = new Date(ts);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-auto overflow-hidden border border-gold/20">
      <div className="bg-gradient-to-r from-dark-green to-[#1A3A2A] py-6 px-8 text-center text-white">
        <h3 className="text-3xl font-playfair mb-2">{t('guestBook')}</h3>
        <p className="font-poppins text-sm text-gold/80">{t('guestBookIntro')}</p>
      </div>

      <div className="p-8">
        <form onSubmit={handleSend} className="mb-8 space-y-4">
          <input
            type="text"
            required
            placeholder="Nama Anda"
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent font-poppins text-sm outline-none transition"
            value={newMsg.name}
            onChange={(e) => setNewMsg({...newMsg, name: e.target.value})}
          />
          <textarea
            required
            rows="3"
            placeholder="Tulis ucapan dan doa..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent font-poppins text-sm outline-none transition resize-none"
            value={newMsg.message}
            onChange={(e) => setNewMsg({...newMsg, message: e.target.value})}
          ></textarea>
          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: "0 5px 15px rgba(201,168,76,0.3)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="flex items-center justify-center w-full sm:w-auto px-8 py-3 bg-gold text-white font-medium rounded-lg font-poppins transition space-x-2 shadow-md ml-auto"
          >
            <span>{t('send')}</span>
            <FaPaperPlane size={14} />
          </motion.button>
        </form>

        {/* Message List */}
        <div className="space-y-6 max-h-96 overflow-y-auto pr-2 custom-scrollbar overflow-x-hidden">
          {messages.length === 0 ? (
            <p className="text-center text-gray-400 font-poppins text-sm italic py-8">Belum ada ucapan. Jadilah yang pertama!</p>
          ) : (
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div 
                  key={msg.id || idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(idx * 0.1, 1), duration: 0.5 }}
                  className="flex space-x-4 bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-[#a1822f] flex items-center justify-center text-white font-playfair font-bold text-lg shadow-sm border border-gold/20 select-none">
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-dark-green font-poppins truncate">
                        {msg.name}
                      </p>
                      <p className="text-xs text-gray-400 font-poppins">
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                    <p className="text-sm text-gray-700 font-poppins break-words leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
