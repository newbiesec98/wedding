import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../utils/LanguageContext';

export default function CountdownTimer({ targetDate }) {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      } else {
        newTimeLeft = { isPast: true };
      }
      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isPast) {
    return (
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="my-8 inline-block bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-[0_5px_15px_rgba(201,168,76,0.3)] border border-gold/40 text-center"
      >
        <h3 className="text-2xl font-playfair text-dark-green font-bold mb-1">Alhamdulillah</h3>
        <p className="font-poppins text-gold font-semibold tracking-widest uppercase text-xs mt-2">Acara Telah Berlangsung</p>
      </motion.div>
    );
  }

  const timeUnits = [
    { label: t('day'), value: timeLeft.days },
    { label: t('hour'), value: timeLeft.hours },
    { label: t('minute'), value: timeLeft.minutes },
    { label: t('second'), value: timeLeft.seconds }
  ];

  return (
    <div className="flex justify-center flex-wrap gap-4 my-8">
      {timeUnits.map((unit, index) => (
        <motion.div 
          key={index} 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ y: -5, scale: 1.05, boxShadow: "0 10px 25px rgba(201,168,76,0.2)" }}
          className="flex flex-col items-center bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow border border-gold/30 w-20 md:w-24 transition duration-300"
        >
          <span className="text-3xl md:text-4xl font-bold font-playfair text-gold drop-shadow-sm">{unit.value}</span>
          <span className="text-xs md:text-sm text-dark-green uppercase mt-1 font-poppins tracking-wider">{unit.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
