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
     

      {/* Botão de entrada com efeito de zoom suave e "encher" ao hover */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center">
      <h1 className="text-4xl text-teal-600 text-center mb-8 font-bold">Propostas Voia</h1>
        <button
          onClick={handleNavigate}
          className={`
            group relative flex items-center justify-center overflow-hidden cursor-pointer
            rounded-2xl px-32 py-4 text-white text-2xl font-bold 
            bg-black shadow-lg
            transform transition-all ease-out duration-[1500ms]
            ${showButton ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}
          `}
        >
          <span className="relative z-10">Entrar</span>
          <span
            className="absolute inset-0 w-0 h-full bg-gradient-to-r from-orange-500 to-orange-600 
              transition-all duration-500 ease-out group-hover:w-full z-0"
          />
        </button>
      </div>
    </div>
  );
};

export default Landing;
