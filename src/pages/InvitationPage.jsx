import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { FaHeart, FaMapMarkerAlt, FaCalendarCheck, FaCopy, FaYoutube, FaCalendarPlus } from 'react-icons/fa';
import CountdownTimer from '../components/CountdownTimer';
import RSVPForm from '../components/RSVPForm';
import GuestBook from '../components/GuestBook';
import MusicToggle from '../components/MusicToggle';
import { fetchConfig, generateTitle } from '../data/configStore';
import { useLanguage } from '../utils/LanguageContext';



// Variants for animation
const fadeUpVariant = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: [0.6, 0.05, -0.01, 0.9] }
  }
};

const zoomInVariant = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 1.2, ease: [0.6, 0.05, -0.01, 0.9] }
  }
};

const slideInLeftVariant = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 1.2, ease: [0.6, 0.05, -0.01, 0.9] }
  }
};

const slideInRightVariant = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 1.2, ease: [0.6, 0.05, -0.01, 0.9] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
};

// Reusable Section wrapper with elegant fade-in up
const Section = ({ children, className = "", id = "", useStagger = false }) => {
  if (useStagger) {
    return (
      <motion.section
        id={id}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className={`py-24 px-4 sm:px-6 relative overflow-hidden ${className}`}
      >
        {children}
      </motion.section>
    );
  }

  return (
    <motion.section
      id={id}
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={`py-24 px-4 sm:px-6 relative overflow-hidden ${className}`}
    >
      {children}
    </motion.section>
  );
};

// Islamic Decorative Components
const IslamicStar = ({ className = "w-12 h-12" }) => (
  <svg className={`${className} drop-shadow-[0_0_8px_rgba(201,168,76,0.3)]`} viewBox="0 0 100 100" fill="currentColor">
    <g transform="translate(50 50) scale(0.8) translate(-50 -50)">
      <rect x="15" y="15" width="70" height="70" fill="none" stroke="currentColor" strokeWidth="3" />
      <rect x="15" y="15" width="70" height="70" fill="none" stroke="currentColor" strokeWidth="3" transform="rotate(45 50 50)" />
      <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="50" cy="50" r="8" fill="currentColor" />
    </g>
  </svg>
);

const CornerMotif = ({ position = "top-left", className = "text-gold" }) => {
  const positioning = {
    "top-left": "top-0 left-0 -translate-x-1/3 -translate-y-1/3",
    "top-right": "top-0 right-0 translate-x-1/3 -translate-y-1/3",
    "bottom-left": "bottom-0 left-0 -translate-x-1/3 translate-y-1/3",
    "bottom-right": "bottom-0 right-0 translate-x-1/3 translate-y-1/3"
  }[position];

  return (
    <motion.div 
      animate={{ rotate: 360 }} 
      transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
      className={`absolute ${positioning} w-48 h-48 opacity-[0.08] pointer-events-none z-0 ${className}`}
    >
      <IslamicStar className="w-full h-full" />
    </motion.div>
  );
};

const IslamicDivider = ({ className = "" }) => (
  <div className={`flex items-center justify-center space-x-4 w-full max-w-xs mx-auto my-6 ${className}`}>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold opacity-50"></div>
    <motion.div animate={{ rotate: 180 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }}>
      <IslamicStar className="w-8 h-8 text-gold" />
    </motion.div>
    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold opacity-50"></div>
  </div>
);

export default function InvitationPage() {
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get('to') || '';
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState(null);
  const [galleries, setGalleries] = useState([]);
  const [stories, setStories] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const { t, lang, toggleLanguage } = useLanguage();

  const { scrollYProgress } = useScroll();

  const calendarLink = config ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Pernikahan ${config.groomFull} & ${config.brideFull}`)}&details=${encodeURIComponent(`Acara Pernikahan ${config.groomFull} & ${config.brideFull}.\n\nLokasi: ${config.akadLocation}\nAlamat: ${config.akadAddress}`)}&location=${encodeURIComponent(config.akadAddress)}&dates=${new Date(config.weddingDate).toISOString().replace(/-|:|\.\d\d\d/g, "")}/${new Date(new Date(config.weddingDate).getTime() + 4 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "")}` : '#';
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    const loadAllData = async () => {
      try {
        const [conf, galRes, stRes, gfRes] = await Promise.all([
          fetchConfig(),
          fetch('/api/galleries'),
          fetch('/api/love_stories'),
          fetch('/api/digital_gifts')
        ]);
        setConfig(conf);
        setGalleries(galRes.ok ? await galRes.json() : []);
        setStories(stRes.ok ? await stRes.json() : []);
        setGifts(gfRes.ok ? await gfRes.json() : []);
        
        // Track Visit
        fetch('/api/visit', { method: 'POST' }).catch(console.error);
      } catch (e) {
        console.error("Failed to load invitation data", e);
      }
    };
    loadAllData();
  }, []);

  // Update Document Title dynamically
  useEffect(() => {
    if (config) {
      const dynamicTitle = generateTitle(config);
      document.title = guestName ? `${dynamicTitle} - Kepada Yth. ${decodeURIComponent(guestName)}` : dynamicTitle;
    }
  }, [config, guestName]);

  const openInvitation = () => {
    setIsOpen(true);
    document.body.style.overflow = 'auto'; // allow scroll after open
  };

  if (!config) return null;

  if (!isOpen) {
    // Cover Page (Locked Scroll)
    const coverBg = config.coverImage || "https://www.transparenttextures.com/patterns/arabesque.png";
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-green text-cream min-h-screen touch-none bg-cover bg-center" style={{ backgroundImage: `url('${coverBg}')` }}>
        <div className="absolute inset-0 bg-dark-green/70 mix-blend-multiply"></div>
        <div className="text-center p-8 max-w-lg mx-auto bg-dark-green/80 backdrop-blur-md shadow-2xl rounded-[3rem] border border-gold/30 z-10 relative overflow-hidden">
          <CornerMotif position="top-left" className="text-gold/60 pointer-events-none w-32 h-32" />
          <CornerMotif position="bottom-right" className="text-gold/60 pointer-events-none w-32 h-32" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <h4 className="text-gold tracking-widest text-sm uppercase mb-4 font-poppins">{t('theWeddingOf')}</h4>
            <h1 className="text-5xl md:text-6xl font-playfair font-bold mb-2 italic">{config.groomShort} <span className="text-rose text-4xl">&</span> {config.brideShort}</h1>
            <IslamicDivider />
            <p className="mb-10 mt-6 text-cream opacity-80 font-poppins text-sm md:text-base">
              {t('dear')} Bapak/Ibu/Saudara/i,
              <br />
              <strong className="block text-2xl mt-4 mb-2 text-gold truncate max-w-xs mx-auto border-b border-gold/40 pb-2">
                {guestName ? decodeURIComponent(guestName) : "Tamu Undangan"}
              </strong>
            </p>
            <motion.button
              onClick={openInvitation}
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(201,168,76,0.8)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="px-8 py-3 bg-gold text-white font-poppins font-medium rounded-full shadow-[0_0_15px_rgba(201,168,76,0.4)] transition"
            >
              {t('openInvitation')}
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream text-gray-800 min-h-screen flex flex-col items-center overflow-x-hidden pt-16">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold via-[#e6cf8b] to-gold z-[100] transform origin-left shadow-[0_2px_10px_rgba(201,168,76,0.3)]"
        style={{ scaleX }}
      />
      <MusicToggle src={config.musicUrl} />
      
      {/* Language Toggle */}
      <div className="fixed top-20 right-4 z-50 flex items-center bg-white/80 backdrop-blur-md rounded-full shadow-lg border-2 border-gold p-1">
        <button 
          onClick={() => lang === 'en' && toggleLanguage()}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${lang === 'id' ? 'bg-gold text-white' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          ID
        </button>
        <button 
          onClick={() => lang === 'id' && toggleLanguage()}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${lang === 'en' ? 'bg-gold text-white' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          EN
        </button>
      </div>

      {/* Hero Section */}
      <Section className="min-h-[80vh] flex flex-col justify-center text-center max-w-4xl mx-auto w-full" useStagger={true}>
        <CornerMotif position="top-right" className="text-dark-green" />
        <CornerMotif position="bottom-left" className="text-dark-green" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }}></div>
        <motion.p variants={fadeUpVariant} className="text-sm font-poppins tracking-widest text-gold uppercase mb-6">{t('weddingOf')}</motion.p>
        <motion.div variants={fadeUpVariant} className="arabic-text mb-6 mt-4 opacity-80">
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
        </motion.div>
        <motion.h1 variants={zoomInVariant} className="text-6xl md:text-8xl font-playfair text-dark-green mt-2 mb-4 leading-tight">
          {config.groomShort} <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-rose text-5xl md:text-7xl block my-2 inline-block">&</motion.span> {config.brideShort}
        </motion.h1>
        <motion.div variants={fadeUpVariant}>
          <IslamicDivider className="max-w-md my-6" />
        </motion.div>
        <motion.p variants={fadeUpVariant} className="font-poppins text-lg md:text-xl text-dark-green/70 mb-12 mt-2">
          {config.dateString}
        </motion.p>
        <motion.div variants={fadeUpVariant}>
          <CountdownTimer targetDate={config.weddingDate} />
        </motion.div>
        <motion.div variants={fadeUpVariant} className="mt-8 flex justify-center">
          <a href={calendarLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-2 px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-gold text-dark-green rounded-full shadow-lg hover:bg-gold hover:text-white transition duration-300 font-poppins font-semibold text-sm">
            <FaCalendarPlus size={18} />
            <span>{t('addToCalendar')}</span>
          </a>
        </motion.div>
      </Section>

      {/* Quote Section */}
      <Section className="bg-dark-green text-cream w-full text-center py-24 shadow-inner" useStagger={true}>
        <CornerMotif position="top-left" className="text-gold" />
        <CornerMotif position="bottom-right" className="text-gold" />
        <div className="max-w-3xl mx-auto flex flex-col items-center relative z-10">
          <motion.div variants={fadeUpVariant}>
            <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}>
              <FaHeart className="text-rose text-4xl mb-8 opacity-80 drop-shadow-lg" />
            </motion.div>
          </motion.div>
          <motion.p variants={fadeUpVariant} className="font-amiri text-2xl md:text-3xl leading-relaxed mb-4 opacity-90 pb-2">
            {config.heroQuranVerse || "وَمِنْ ءَايَٰتِهِۦٓ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَٰجًا لِّتَسْكُنُوٓا۟ إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِى ذَٰلِكَ لَءَايَٰتٍ لِّقَوْمٍ يَتَفَكَّرُونَ"}
          </motion.p>
          <motion.div variants={fadeUpVariant} className="w-full">
            <IslamicDivider className="mb-8 opacity-70" />
          </motion.div>
          <motion.p variants={fadeUpVariant} className="font-poppins text-sm md:text-base italic leading-relaxed text-cream opacity-80 px-4">
            "{config.heroQuote || "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir."}"
          </motion.p>
          {!config.heroQuote && <motion.p variants={fadeUpVariant} className="font-poppins font-bold text-gold mt-6 tracking-wider">(QS. Ar-Rum: 21)</motion.p>}
        </div>
      </Section>

      {/* Profile Section */}
      <Section className="w-full max-w-5xl text-center py-24" useStagger={true}>
        <motion.div variants={fadeUpVariant} className="mb-16">
          <h2 className="text-4xl font-playfair text-dark-green mb-4 relative inline-block">Mempelai Berbahagia</h2>
          <IslamicDivider className="w-64 opacity-70 pointer-events-none" />
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20">
          {/* Groom */}
          <motion.div variants={slideInLeftVariant} className="flex flex-col items-center max-w-xs">
            <motion.div whileHover={{ scale: 1.05, rotate: -2 }} transition={{ duration: 0.4 }} className="w-48 h-48 rounded-full border-4 border-gold shadow-[0_0_20px_rgba(201,168,76,0.5)] overflow-hidden mb-6 relative">
              <img src={config.groomPhoto || "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200"} alt="Groom" className="w-full h-full object-cover filter brightness-90 transition duration-500 hover:scale-110" />
              <div className="absolute inset-0 bg-gold/10 mix-blend-overlay"></div>
            </motion.div>
            <h3 className="text-3xl font-playfair font-bold text-dark-green mb-2">{config.groomFull}</h3>
            <p className="font-poppins text-sm text-gray-600">{t('groomSonOf')} {config.parentGroom}</p>
            {config.igGroom && <a href={`https://instagram.com/${config.igGroom.replace('@', '')}`} className="mt-4 text-gold hover:text-rose transition text-sm font-poppins" target="_blank" rel="noreferrer">{config.igGroom}</a>}
          </motion.div>

          <motion.div variants={zoomInVariant} className="text-5xl font-playfair text-rose opacity-60 md:mt-0">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>&amp;</motion.div>
          </motion.div>

          {/* Bride */}
          <motion.div variants={slideInRightVariant} className="flex flex-col items-center max-w-xs">
            <motion.div whileHover={{ scale: 1.05, rotate: 2 }} transition={{ duration: 0.4 }} className="w-48 h-48 rounded-full border-4 border-gold shadow-[0_0_20px_rgba(201,168,76,0.5)] overflow-hidden mb-6 relative">
              <img src={config.bridePhoto || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200"} alt="Bride" className="w-full h-full object-cover filter brightness-90 transition duration-500 hover:scale-110" />
              <div className="absolute inset-0 bg-gold/10 mix-blend-overlay"></div>
            </motion.div>
            <h3 className="text-3xl font-playfair font-bold text-dark-green mb-2">{config.brideFull}</h3>
            <p className="font-poppins text-sm text-gray-600">{t('brideDaughterOf')} {config.parentBride}</p>
            {config.igBride && <a href={`https://instagram.com/${config.igBride.replace('@', '')}`} className="mt-4 text-gold hover:text-rose transition text-sm font-poppins" target="_blank" rel="noreferrer">{config.igBride}</a>}
          </motion.div>
        </div>
      </Section>

      {/* Event Details Section */}
      <Section className="w-full bg-white relative py-24" useStagger={true}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50"></div>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2 variants={fadeUpVariant} className="text-4xl font-playfair text-dark-green mb-6 text-center">{t('eventDetails')}</motion.h2>
          <motion.p variants={fadeUpVariant} className="text-gray-500 font-poppins text-sm mb-16 max-w-xl mx-auto text-center">
            {t('weddingIntro')}
          </motion.p>

          <div className="grid md:grid-cols-1 max-w-4xl mx-auto gap-8">
            {config.eventMode === 'akad_only' ? (
              <motion.div variants={fadeUpVariant} className="bg-cream rounded-3xl p-8 border border-gold/20 shadow-xl hover:-translate-y-2 transition-transform duration-500 hover:shadow-2xl flex flex-col max-w-2xl mx-auto w-full relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-64 h-64 opacity-[0.04] pointer-events-none">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 60, ease: "linear" }} className="w-full h-full">
                    <IslamicStar className="w-full h-full text-dark-green" />
                  </motion.div>
                </div>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(201,168,76,0.3)] border border-gold/30 relative z-10">
                  <FaCalendarCheck className="text-gold text-2xl" />
                </div>
                <h3 className="text-3xl font-playfair text-dark-green mb-4">{t('akadNikah')}</h3>
                <p className="font-poppins text-gray-600 mb-2 font-semibold">{config.dateString}</p>
                <p className="font-poppins text-gray-500 mb-6">
                  {config.akadTimeStart ? `${config.akadTimeStart} - ${config.akadTimeEnd || 'Selesai'} ${config.timeZone || 'WIB'}` : `${config.akadTime} ${config.timeZone || 'WIB'}`}
                </p>
                <p className="font-poppins text-sm text-gray-700 leading-relaxed font-semibold">{config.akadLocation}</p>
                <p className="font-poppins text-sm text-gray-500 italic mt-1 flex-grow">{config.akadAddress}</p>
              </motion.div>
            ) : (
              <motion.div variants={fadeUpVariant} className="bg-cream rounded-3xl p-8 md:p-12 border border-gold/20 shadow-xl hover:-translate-y-2 transition-transform duration-500 hover:shadow-2xl flex flex-col relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-64 h-64 opacity-[0.04] pointer-events-none">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 60, ease: "linear" }} className="w-full h-full">
                    <IslamicStar className="w-full h-full text-dark-green" />
                  </motion.div>
                </div>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(201,168,76,0.3)] border border-gold/30 relative z-10">
                  <FaCalendarCheck className="text-gold text-2xl" />
                </div>
                <h3 className="text-4xl font-playfair text-dark-green mb-2 relative z-10 text-center">Akad & Resepsi</h3>
                <p className="font-poppins text-gray-600 mb-10 font-semibold relative z-10 text-center">{config.dateString}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10">
                  <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gold/30 translate-x-[-0.5px]"></div>

                  {/* Akad Nikah */}
                  <div className="flex flex-col items-center text-center">
                    <h4 className="text-2xl font-playfair text-dark-green mb-4 border-b border-gold/30 pb-2 inline-block">{t('akadNikah')}</h4>
                    <p className="font-poppins text-gray-500 mb-4 px-4 bg-white/50 py-2 rounded-full border border-gold/10">
                      {config.akadTimeStart ? `${config.akadTimeStart} - ${config.akadTimeEnd || 'Selesai'} ${config.timeZone || 'WIB'}` : `${config.akadTime} ${config.timeZone || 'WIB'}`}
                    </p>
                    <p className="font-poppins text-sm text-gray-700 leading-relaxed font-semibold">{config.akadLocation}</p>
                    <p className="font-poppins text-sm text-gray-500 italic mt-1 flex-grow">{config.akadAddress}</p>
                  </div>

                  {/* Resepsi */}
                  <div className="flex flex-col items-center text-center pt-8 border-t border-gold/20 md:border-0 md:pt-0">
                    <h4 className="text-2xl font-playfair text-dark-green mb-4 border-b border-light-green/30 pb-2 inline-block">{t('resepsi')}</h4>
                    <p className="font-poppins text-gray-500 mb-4 px-4 bg-white/50 py-2 rounded-full border border-gold/10">
                      {config.resepsiTimeStart ? `${config.resepsiTimeStart} - ${config.resepsiTimeEnd || 'Selesai'} ${config.timeZone || 'WIB'}` : `${config.resepsiTime} ${config.timeZone || 'WIB'}`}
                    </p>
                    <p className="font-poppins text-sm text-gray-700 leading-relaxed font-semibold">{config.resepsiLocation}</p>
                    <p className="font-poppins text-sm text-gray-500 italic mt-1 flex-grow">{config.resepsiAddress}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>


          {/* Custom Events */}
          {config.customEvents && config.customEvents.length > 0 && (
            <Section className="w-full bg-white relative py-24" useStagger={true}>
              <div className="max-w-4xl mx-auto px-4 text-center">
                <motion.h2 variants={fadeUpVariant} className="text-4xl font-playfair text-dark-green mb-6 text-center">Acara Lainnya</motion.h2>
                <motion.p variants={fadeUpVariant} className="text-gray-500 font-poppins text-sm mb-16 max-w-xl mx-auto text-center">Acara selain Akad & Resepsi yang telah dijadwalkan.</motion.p>

                {config.customEvents.map((event, index) => (
                  <motion.div key={index} variants={fadeUpVariant} className="bg-cream rounded-3xl p-8 border border-gold/20 shadow-xl hover:-translate-y-2 transition-transform duration-500 hover:shadow-2xl mb-8 max-w-2xl mx-auto w-full relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 w-64 h-64 opacity-[0.04] pointer-events-none">
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 60, ease: "linear" }} className="w-full h-full">
                        <IslamicStar className="w-full h-full text-dark-green" />
                      </motion.div>
                    </div>
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(201,168,76,0.3)] border border-gold/30 relative z-10">
                      <FaCalendarCheck className="text-gold text-2xl" />
                    </div>
                    <h3 className="text-2xl font-playfair text-dark-green mb-4 text-center">{event.mode}</h3>
                    <p className="font-poppins text-gray-500 mb-2 font-semibold text-center">{event.date}</p>
                    <p className="font-poppins text-gray-500 mb-4 text-center">{event.time}</p>
                    <p className="font-poppins text-sm text-gray-700 leading-relaxed font-semibold text-center">{event.location}</p>
                    {event.description && <p className="font-poppins text-sm text-gray-500 italic mt-1 text-center flex-grow">{event.description}</p>}
                  </motion.div>
                ))}
              </div>
            </Section>
          )}

          {/* Maps */}
          <motion.div variants={fadeUpVariant} className="mt-16 w-full h-[400px] rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.1)] border-4 border-white">
            <iframe
              src={config.mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Pernikahan"
              className="grayscale hover:grayscale-0 transition duration-1000"
            ></iframe>
          </motion.div>
          <motion.a variants={fadeUpVariant} href={config.mapUrl.match(/src="([^"]+)"/)?.[1] || config.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-8 px-8 py-3 bg-dark-green text-cream font-medium rounded-full shadow-[0_5px_15px_rgba(26,58,42,0.4)] hover:shadow-[0_8px_25px_rgba(26,58,42,0.6)] hover:-translate-y-1 transition font-poppins duration-300">
            {t('mapButton')}
          </motion.a>

          {config.liveStreamUrl && (
            <motion.a variants={fadeUpVariant} href={config.liveStreamUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 md:mt-8 md:ml-4 px-8 py-3 bg-red-600 text-white font-medium rounded-full shadow-[0_5px_15px_rgba(220,38,38,0.4)] hover:shadow-[0_8px_25px_rgba(220,38,38,0.6)] hover:-translate-y-1 transition font-poppins duration-300 items-center justify-center space-x-2">
              <FaYoutube className="inline-block -mt-1 mr-2" size={20} />
              <span>{t('liveStream')}</span>
            </motion.a>
          )}
        </div>
      </Section>

      {/* Love Story Section */}
      {stories.length > 0 && (
        <Section className="w-full bg-white py-24 relative" useStagger={true}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -z-10"></div>
          <div className="max-w-4xl mx-auto px-4">
            <motion.h2 variants={fadeUpVariant} className="text-4xl font-playfair text-dark-green mb-16 text-center">{t('loveStory')}</motion.h2>
            <div className="relative border-l-2 border-gold/30 ml-4 md:ml-1/2 left-0 md:left-1/2 transform md:-translate-x-1/2 space-y-12">
              {stories.map((story, idx) => (
                <motion.div key={story.id} variants={idx % 2 === 0 ? slideInLeftVariant : slideInRightVariant} className={`relative flex items-center justify-between md:justify-normal w-full ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="hidden md:block w-5/12"></div>
                  <motion.div whileHover={{ scale: 1.5 }} className="z-20 absolute left-[-9px] md:left-1/2 md:-ml-[9px] w-4 h-4 rounded-full bg-gold shadow-[0_0_10px_#C9A84C] cursor-pointer"></motion.div>
                  <div className="pl-8 md:pl-0 w-full md:w-5/12">
                    <motion.div whileHover={{ scale: 1.02 }} className="bg-gray-50 p-6 rounded-2xl shadow-lg border border-gold/10 hover:shadow-xl transition relative group overflow-hidden">
                      <h3 className="font-playfair font-bold text-xl text-dark-green">{story.title}</h3>
                      <p className="text-gold text-sm font-poppins mb-3 font-semibold tracking-wider">{story.date}</p>
                      <p className="text-gray-600 font-poppins text-sm leading-relaxed">{story.description}</p>
                      {story.imageUrl && (
                        <div className="mt-4 rounded-xl overflow-hidden max-h-48 group-hover:max-h-64 transition-all duration-500">
                          <img src={story.imageUrl} alt={story.title} className="w-full object-cover transform group-hover:scale-105 transition duration-700" />
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Gallery Section */}
      <Section className="w-full bg-cream py-24" useStagger={true}>
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2 variants={fadeUpVariant} className="text-4xl font-playfair text-dark-green mb-16 text-center">{t('gallery')}</motion.h2>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {galleries.length > 0 ? galleries.map((item, idx) => (
              <motion.div 
                key={item.id} 
                variants={fadeUpVariant} 
                className="relative overflow-hidden rounded-xl shadow-lg border border-gold/20 group hover:shadow-[0_10px_25px_rgba(201,168,76,0.4)] transition duration-500 cursor-pointer"
                onClick={() => setSelectedImage(item.imageUrl)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.caption || `Gallery ${idx + 1}`}
                  className="w-full h-auto transform transition duration-700 group-hover:scale-110 object-cover"
                />
                <div className="absolute inset-0 bg-dark-green/0 group-hover:bg-dark-green/20 transition duration-500 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition duration-500 font-poppins text-xs tracking-widest uppercase bg-dark-green/70 px-4 py-2 rounded-full backdrop-blur-sm">{t('viewPhoto')}</span>
                </div>
              </motion.div>
            )) : (
              <p className="text-gray-500 italic col-span-full">Belum ada foto galeri.</p>
            )}
          </div>
        </div>
      </Section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 cursor-pointer backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-5xl max-h-[90vh] rounded-xl overflow-hidden shadow-[0_0_40px_rgba(201,168,76,0.2)] border border-gold/30"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedImage} alt="Gallery" className="w-full h-full object-contain max-h-[85vh]" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-gold rounded-full text-white flex items-center justify-center transition backdrop-blur-md shadow-lg text-lg"
              >
                &#10005;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Digital Gift Section */}
      {gifts.length > 0 && (
        <Section className="w-full bg-cream py-16" useStagger={true}>
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.h2 variants={fadeUpVariant} className="text-4xl font-playfair text-dark-green mb-6">{t('digitalGift')}</motion.h2>
            <motion.p variants={fadeUpVariant} className="font-poppins text-gray-600 mb-12 max-w-xl mx-auto">{t('giftIntro')}</motion.p>

            <div className="grid sm:grid-cols-2 gap-8 justify-center">
              {gifts.map((gift) => (
                <motion.div key={gift.id} variants={fadeUpVariant} className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gold/20 hover:border-gold transition flex flex-col items-center">
                  {gift.qrCodeUrl && <img src={gift.qrCodeUrl} alt={`QR Code ${gift.bankName}`} className="w-40 h-40 object-contain mb-6 mx-auto rounded-lg border border-gray-100 p-2 shadow-sm" />}
                  <h3 className="text-2xl font-bold text-dark-green tracking-wider mb-2">{gift.bankName}</h3>
                  <p className="text-3xl font-mono text-gray-800 tracking-widest my-2 select-all bg-gray-50 px-4 py-2 rounded-lg">{gift.accountNumber}</p>
                  <p className="uppercase text-sm text-gray-500 font-semibold tracking-widest mt-2">{gift.accountHolder}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(gift.accountNumber);
                      alert(`Nomor Rekening ${gift.bankName} berhasil disalin!`);
                    }}
                    className="mt-6 flex items-center justify-center space-x-2 bg-gold/10 hover:bg-gold hover:text-white text-gold font-poppins px-6 py-2 rounded-full transition w-full"
                  >
                    <FaCopy /> <span>{t('copyAccount')}</span>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* RSVP Section */}
      <Section className="w-full bg-dark-green py-24 relative" id="rsvp" useStagger={true}>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }}></div>
        <motion.div variants={fadeUpVariant} className="relative z-10 px-4">
          <RSVPForm guestName={guestName} />
        </motion.div>
      </Section>

      {/* Guestbook Section */}
      <Section className="w-full bg-cream py-24" useStagger={true}>
        <motion.div variants={fadeUpVariant} className="px-4">
          <GuestBook guestName={guestName} />
        </motion.div>
      </Section>

      {/* Footer */}
      <footer className="w-full py-16 bg-dark-green text-center border-t-4 border-gold relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/arabesque.png')" }}></div>
        <div className="max-w-lg mx-auto relative z-10 px-4 flex flex-col items-center">
          <CornerMotif position="top-left" className="text-gold opacity-20" />
          <CornerMotif position="top-right" className="text-gold opacity-20" />
          
          <h2 className="text-5xl font-playfair text-gold italic mb-4 animate-pulse drop-shadow-md">{config.groomShort} & {config.brideShort}</h2>
          <IslamicDivider className="max-w-[200px] mb-8 opacity-60 mix-blend-screen" />
          <p className="text-cream opacity-80 font-poppins text-sm leading-relaxed mb-8">
            Terima kasih atas doa dan restu yang telah diberikan. Semoga Allah Subhanahu Wa Ta'ala senantiasa memberikan rahmat dan hidayah-Nya kepada kita semua.
          </p>
          <div className="w-12 h-px bg-gold opacity-50 mx-auto mb-6"></div>
          <p className="text-gold opacity-60 font-poppins text-xs tracking-widest uppercase">&copy; {new Date().getFullYear()} Build with Love. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
