import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const [showButton, setShowButton] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1;
    }
  }, []);

  const handleNavigate = () => {
    navigate('/inicio');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-r from-neutral-900 via-zinc-950 to-stone-900">
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
        
        {/* Logo centralizado acima do título */}
        <img
          src="/logo5.png"
          alt="Logo Voia"
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mb-20 object-contain"
        />


        {/* Botão com efeito */}
        <button
  onClick={handleNavigate}
  className={`
    group relative flex items-center justify-center overflow-hidden
    cursor-pointer rounded-3xl px-8 py-5
    shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_8px_20px_rgba(0,128,128,0.1)]
    border border-white/20 ring-2 ring-white/10
    backdrop-blur-[20px] bg-black/5
    transition-all duration-800 ease-in-out
    hover:shadow-orange-500/30 hover:scale-105
    ${showButton ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
  `}
>
  <span
  className="
    relative z-10 text-3xl sm:text-4xl font-light text-neutral-100/80
    tracking-wide 

    [text-shadow:0_2px_2px_rgba(255,255,255,0.3),0_2px_3px_rgba(0,0,0,0.2)]
  "
>
  Gerar Proposta
</span>

  <span
    className="absolute inset-0 h-full w-0 bg-gradient-to-r from-orange-500 to-orange-600
      transition-all duration-800 ease-out group-hover:w-full z-0"
  />
</button>
      </div>
    </div>
  );
};

export default Landing;
