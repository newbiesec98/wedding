import React, { useState, useEffect, useRef } from 'react';
import { FaMusic, FaPause } from 'react-icons/fa';

export default function MusicToggle({ src }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    // Attempt auto-play might fail due to browser policies
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(console.error);
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <audio ref={audioRef} src={src} loop />
      <button
        onClick={togglePlay}
        className={`fixed bottom-6 lg:bottom-12 right-6 lg:right-12 z-50 p-4 rounded-full shadow-[0_0_15px_rgba(201,168,76,0.6)] bg-gold/90 text-white transition-all transform hover:scale-110 flex items-center justify-center
          ${isPlaying ? 'animate-pulse' : ''}
        `}
        aria-label="Toggle Music"
      >
        <div className="relative flex items-center justify-center">
          {isPlaying ? (
            <>
              <FaMusic size={20} className="animate-bounce absolute opacity-40 text-white" style={{ animationDuration: '2s' }} />
              <FaPause size={20} className="relative z-10" />
            </>
          ) : (
            <FaMusic size={20} />
          )}
        </div>
      </button>
    </>
  );
}
