import React, { useState } from 'react';
import { submitRSVP } from '../data/guestStore';
import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { useLanguage } from '../utils/LanguageContext';

export default function RSVPForm({ guestName }) {
  const [formData, setFormData] = useState({
    name: guestName || '',
    status: 'hadir',
    count: 1,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submittedGuest, setSubmittedGuest] = useState(null);

  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submitRSVP(formData);
    setSubmittedGuest(result || { id: Date.now(), name: formData.name, guestsCount: formData.count });
    setSubmitted(true);
  };

  if (submitted) {
    const isAttending = formData.status === 'hadir';
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border-2 border-gold/30 text-center shadow-[0_10px_30px_rgba(201,168,76,0.3)]"
      >
        <h3 className="text-2xl font-playfair text-dark-green mb-4">{t('thankYou')}!</h3>
        <p className="font-poppins text-gray-600 mb-6">Terima kasih atas konfirmasinya. {isAttending ? t('seeYou') : 'Kami memaklumi ketidakhadiran Anda.'}</p>
        
        {isAttending && submittedGuest && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl inline-block border border-gold/20 shadow-inner">
            <p className="font-poppins text-sm text-dark-green font-bold mb-3 uppercase tracking-wider">E-Ticket Anda</p>
            <div className="bg-white p-3 rounded-xl shadow-sm inline-block">
              <QRCodeCanvas 
                value={JSON.stringify({ id: submittedGuest.id, name: formData.name, guestsCount: formData.count })} 
                size={160} 
                fgColor="#1A3A2A" 
                level="H"
              />
            </div>
            <p className="font-poppins text-xs text-gray-500 mt-3 font-medium">Tunjukkan QR Code ini pada saat resepsi</p>
            <p className="font-poppins text-xs font-bold text-dark-green mt-1">{formData.name} ({formData.count} Orang)</p>
          </div>
        )}

        <div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSubmitted(false)}
            className="px-6 py-2 border border-gold text-gold rounded-full font-poppins text-sm hover:bg-gold hover:text-white transition inline-block"
          >
            Kembali
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-cream p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-lg mx-auto border border-gold/30 relative overflow-hidden">
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-dark-green/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10">
        <h3 className="text-4xl font-playfair text-center text-dark-green mb-2">{t('rsvpTitle')}</h3>
        <div className="w-16 h-1 bg-gold mx-auto mb-6 rounded-full"></div>
        <p className="text-center font-poppins text-sm text-gray-600 mb-8 leading-relaxed">
          {t('rsvpIntro')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-dark-green uppercase tracking-wider font-poppins mb-2">{t('fullName')}</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 bg-white/70 border border-gold/40 rounded-xl focus:ring-2 focus:ring-gold focus:bg-white focus:border-transparent font-poppins text-sm outline-none transition shadow-inner"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Masukkan nama Anda"
            />
          </div>

          <div>
             <label className="block text-xs font-bold text-dark-green uppercase tracking-wider font-poppins mb-2">{t('attendStatus')}</label>
             <select 
               className="w-full px-4 py-3 bg-white/70 border border-gold/40 rounded-xl focus:ring-2 focus:ring-gold focus:bg-white focus:border-transparent font-poppins text-sm outline-none transition shadow-inner"
               value={formData.status}
               onChange={(e) => setFormData({...formData, status: e.target.value})}
             >
               <option value="hadir">{t('willAttend')}</option>
               <option value="tidak">{t('willNotAttend')}</option>
             </select>
          </div>

          {formData.status === 'hadir' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <label className="block text-xs font-bold text-dark-green uppercase tracking-wider font-poppins mb-2 mt-6">{t('guestCount')}</label>
              <select 
                className="w-full px-4 py-3 bg-white/70 border border-gold/40 rounded-xl focus:ring-2 focus:ring-gold focus:bg-white focus:border-transparent font-poppins text-sm outline-none transition shadow-inner"
                value={formData.count}
                onChange={(e) => setFormData({...formData, count: Number(e.target.value)})}
              >
                <option value={1}>1 Orang</option>
                <option value={2}>2 Orang</option>
                <option value={3}>3 Orang</option>
                <option value={4}>4 Orang</option>
                <option value={5}>5 Orang</option>
              </select>
            </motion.div>
          )}

          <motion.button 
            whileHover={{ scale: 1.03, boxShadow: "0 10px 25px rgba(201,168,76,0.5)" }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-4 mt-4 bg-gradient-to-r from-gold to-[#d4af37] text-white font-bold tracking-widest uppercase rounded-xl font-poppins shadow-[0_5px_15px_rgba(201,168,76,0.3)] transition duration-300"
          >
            {t('submitRsvp')}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
