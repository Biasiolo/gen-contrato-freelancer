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
    <div className="fixed top-0 left-0 w-full backdrop-blur-sm bg-white/20 shadow z-50">
      <div className="relative max-w-8xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-center items-center">

        {/* linha de conexão */}
        <div className="absolute top-1/2 left-4 md:left-6 right-4 md:right-6 h-[2px] bg-neutral-600 transform -translate-y-1/2" />

        {/* botões de etapas */}
        <div className="relative flex justify-between items-center w-full max-w-4xl px-2">
          {steps.map(step => {
            const isCompleted = currentStep > step.key;
            const isActive = currentStep === step.key;

            return (
              <div key={step.key} className="flex-1 flex flex-col items-center">
                <button
                  onClick={() => onStepClick(step.key)}
                  className={`flex items-center justify-center rounded-full z-10 transition cursor-pointer
                    ${isCompleted
                      ? 'bg-teal-600 w-8 h-8 md:w-10 md:h-10 hover:scale-110'
                      : isActive
                        ? 'bg-white border-2 border-teal-600 w-8 h-8 md:w-10 md:h-10 hover:scale-110'
                        : 'bg-neutral-800 w-8 h-8 md:w-10 md:h-10 hover:scale-110'}`}
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
          className="absolute cursor-pointer right-4 top-3 md:top-4 bg-orange-500 text-white text-xs md:text-sm px-4 py-1 rounded-full shadow hover:bg-orange-600"
        >
          Nova Proposta
        </button>
      </div>
    </div>
  );
}
