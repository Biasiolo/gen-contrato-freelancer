import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDetails } from '../store/slices/proposalSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const StepDetalhes = ({ onBack, onNext }) => {
  const dispatch = useDispatch();
  const details = useSelector(state => state.proposal.details);

  const handleChange = (e) => dispatch(setDetails(e.target.value));

  return (
  <div className="flex items-center justify-center pt-0 sm:pt-24 bg-transparent">
    <div className="relative max-w-4xl w-full mx-auto">
      <div className="relative backdrop-blur-sm bg-white/5 border border-teal-700/40 rounded-lg p-10 overflow-auto">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-700 to-transparent opacity-60" />

        <h2 className="text-4xl text-center font-semibold text-orange-100 mb-2 rounded-t-3xl p-2">
          Toques Finais
        </h2>

        <p className="text-orange-100 text-center mb-6">
          Insira observações ou instruções adicionais relevantes para esta proposta.
        </p>

        <textarea
          rows="6"
          className="w-full px-4 py-3 bg-stone-200 bg-opacity-20 text-gray-900 placeholder-gray-600 placeholder-opacity-60 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 border-none resize-none"
          placeholder="Ex: Incluir cronograma detalhado, observações sobre reuniões, etc."
          value={details}
          onChange={handleChange}
        />

        <div className="mt-10 flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={onBack}
            className="group relative flex items-center justify-center overflow-hidden cursor-pointer rounded-3xl bg-neutral-800 w-full sm:w-40 py-2 text-white shadow-lg transition-all hover:shadow-orange-700/25"
          >
            <span className="relative z-10 font-medium">◄ Voltar</span>
            <span className="absolute inset-y-0 right-0 h-full w-0 bg-gradient-to-r from-orange-600 to-orange-500 transition-all duration-300 ease-out group-hover:w-full" />
          </button>

          <button
            onClick={onNext}
            className="group relative flex items-center justify-center overflow-hidden cursor-pointer rounded-3xl bg-gradient-to-r from-teal-600 to-teal-600 w-full sm:w-40 py-2 text-white shadow-lg transition-all hover:shadow-orange-500/25"
          >
            <span className="relative z-10 font-medium">Continuar ►</span>
            <span className="absolute inset-0 h-full w-0 bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 ease-out group-hover:w-full" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

};

export default StepDetalhes;
