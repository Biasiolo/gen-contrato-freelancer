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
      <div className="relative max-w-4xl mx-auto px-6 py-4">
        {/* Linha de conexão */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-neutral-600 transform -translate-y-1/2" />
        <div className="relative flex justify-between items-center">
          {steps.map(step => {
            const isCompleted = currentStep > step.key;
            const isActive = currentStep === step.key;
            return (
              <div key={step.key} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full z-10 \
                    ${isCompleted ? 'bg-teal-600' : isActive ? 'bg-white border-2 border-teal-600' : 'bg-neutral-800'}`
                  }
                >
                  <span className={`font-semibold \
                    ${isCompleted ? 'text-white' : isActive ? 'text-teal-600' : 'text-neutral-400'}`
                  }>
                    {step.key}
                  </span>
                </div>
                <div
                  className={`mt-2 text-xs font-medium text-center \
                    ${isCompleted ? 'text-orange-400' : isActive ? 'text-white' : 'text-neutral-500'}`
                  }>
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}