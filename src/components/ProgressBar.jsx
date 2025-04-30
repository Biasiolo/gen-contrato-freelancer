// src/components/ProgressBar.jsx
import React from 'react';

const steps = [
  { key: 1, label: 'Boas-vindas' },
  { key: 2, label: 'Seleção' },
  { key: 3, label: 'Cronograma' },
  { key: 4, label: 'Condições' },
  { key: 5, label: 'Toques Finais' },
  { key: 6, label: 'Prévia' },
  { key: 7, label: 'Sucesso!' }
];

export default function ProgressBar({ currentStep }) {
  return (
    <div className="fixed top-0 left-0 w-full backdrop-blur-sm bg-white/20 shadow z-50">
      <div className="relative max-w-4xl mx-auto px-4 md:px-6 py-3 md:py-4">
        {/* connector line */}
        <div className="absolute top-1/2 left-4 md:left-6 right-4 md:right-6 h-[2px] bg-neutral-600 transform -translate-y-1/2" />
        <div className="relative flex justify-between items-center">
          {steps.map(step => {
            const isCompleted = currentStep > step.key;
            const isActive    = currentStep === step.key;

            return (
              <div key={step.key} className="flex-1 flex flex-col items-center">
                {/* circle */}
                <div
                  className={`flex items-center justify-center rounded-full z-10
                    ${isCompleted
                      ? 'bg-teal-600 w-8 h-8 md:w-10 md:h-10'
                      : isActive
                        ? 'bg-white border-2 border-teal-600 w-8 h-8 md:w-10 md:h-10'
                        : 'bg-neutral-800 w-8 h-8 md:w-10 md:h-10'}`
                  }
                >
                  <span
                    className={`font-semibold
                      ${isCompleted
                        ? 'text-white text-sm md:text-base'
                        : isActive
                          ? 'text-gray-900 text-sm md:text-base'
                          : 'text-neutral-400 text-sm md:text-base'}`
                  }>
                    {step.key}
                  </span>
                </div>

                {/* label: hidden on mobile, shown from sm+ */}
                <div className={`mt-1 md:mt-2 text-center sm:block hidden`}>
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
      </div>
    </div>
  );
}
