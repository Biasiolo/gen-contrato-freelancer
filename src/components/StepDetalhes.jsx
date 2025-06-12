import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDetails } from '../store/slices/proposalSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const StepDetalhes = ({ onBack, onNext }) => {
  const dispatch = useDispatch();
  const details = useSelector(state => state.proposal.details);

  const handleChange = (e) => dispatch(setDetails(e.target.value));

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-stone-950 to-black pt-0 sm:pt-10">
      <div className="relative max-w-4xl w-full mx-auto ">
        <div className="relative backdrop-blur-sm bg-white bg-opacity-10 shadow-2xl border border-white border-opacity-20 p-6 sm:p-10 overflow-auto">

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-2 bg-black rounded-t-3xl p-2">
            Toques Finais
          </h2>

          <p className="text-sm text-neutral-500 text-center mb-6">
            Insira observações ou instruções adicionais relevantes para esta proposta.
          </p>

          <textarea
            rows="6"
            className="w-full px-4 py-3 bg-neutral-100 text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 border-none resize-none"
            placeholder="Ex: Incluir cronograma detalhado, observações sobre reuniões, etc."
            value={details}
            onChange={handleChange}
          />

          <div className="mt-10 flex flex-col sm:flex-row justify-between gap-4 sm:gap-0">
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
