import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const [showButton, setShowButton] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 2000);
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
    <div className="relative w-full h-screen overflow-hidden bg-black">
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
            group relative flex items-center justify-center overflow-hidden cursor-pointer
            rounded-none p-4 text-2xl font-bold border-white border 
            bg-transparent shadow-lg
            transform transition-all ease-out duration-[750ms]
            ${showButton ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
          `}
        >
          <span className="relative z-10 text-5xl font-light text-neutral-50">Gerar Proposta</span>
          <span
            className="absolute inset-0 w-0 h-full bg-orange-500 
              transition-all duration-1000 ease-out group-hover:w-full z-0"
          />
        </button>
      </div>
    </div>
  );
};

export default Landing;
