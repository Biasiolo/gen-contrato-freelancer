import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetProposal } from '../store/slices/proposalSlice';

const steps = [
  { key: 1, label: 'Boas-vindas' },
  { key: 2, label: 'Seleção' },
  { key: 3, label: 'Cronograma' },
  { key: 4, label: 'Condições' },
  { key: 5, label: 'Toques Finais' },
  { key: 6, label: 'Prévia' },
  { key: 7, label: 'Sucesso!' }
];

export default function ProgressBar({ currentStep, onStepClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNew = () => {
    dispatch(resetProposal());
    navigate('/');
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 backdrop-blur-[10px] bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_2px_6px_rgba(0,128,128,0.3)] ring-1 ring-white/10 border-b-1 border-teal-300/20 transition-all">
      <div className="relative max-w-8xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-center items-center">

        {/* linha de conexão */}
        <div
          className="
    absolute top-1/2 h-[2px] bg-teal-600/40 transform -translate-y-1/2
    left-12 right-32
    md:left-80 md:right-80 md:top-1/3
  "
        />

        {/* botões de etapas */}
        <div className="relative flex justify-between items-center w-full max-w-4xl px-2">
          {steps.map(step => {
            const isCompleted = currentStep > step.key;
            const isActive = currentStep === step.key;

            return (
              <div key={step.key} className="flex-1 flex flex-col items-center">
                <button
                  onClick={() => onStepClick(step.key)}
                  className={`flex cursor-pointer items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full transition-all z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] ring-1 ring-white/10 backdrop-blur-[4px] border border-teal-300/30 hover:scale-110
  ${isCompleted
    ? 'bg-teal-600 text-orange-100'
    : isActive
      ? 'bg-white text-teal-800 border-teal-600'
      : 'bg-stone-950 text-orange-100'}`}
                  title={`Ir para ${step.label}`}
                >
                  <span
                    className={`font-semibold
                      ${isCompleted
                        ? 'text-white text-sm md:text-base'
                        : isActive
                          ? 'text-gray-900 text-sm md:text-base'
                          : 'text-neutral-400 text-sm md:text-base'}`}
                  >
                    {step.key}
                  </span>
                </button>

                <div className="mt-1 md:mt-2 text-center sm:block hidden">
                  <span
                    className={`text-xs md:text-sm font-medium 
                      ${isCompleted
                        ? 'text-orange-400'
                        : isActive
                          ? 'text-white'
                          : 'text-neutral-500'}`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* botão Nova Proposta */}
        <button
          onClick={handleNew}
          className="hidden md:block absolute cursor-pointer right-4 top-3 md:top-4 bg-orange-500 text-white text-xs md:text-sm px-4 py-1 rounded-full shadow hover:bg-orange-600"
        >
          Nova Proposta
        </button>

        {/* botão Nova Proposta (mobile - abaixo da barra) */}
        <div className="block md:hidden mt-2 text-center">
          <button
            onClick={handleNew}
            className="bg-orange-500 text-white text-sm px-4 py-1 rounded-full shadow hover:bg-orange-600"
          >
            Nova Proposta
          </button>
        </div>
      </div>
    </div>
  );
}
