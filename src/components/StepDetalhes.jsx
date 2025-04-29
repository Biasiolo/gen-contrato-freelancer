// src/components/StepDetalhes.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDetails } from '../store/slices/proposalSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const StepDetalhes = ({ onBack, onNext }) => {
  const dispatch = useDispatch();
  const details = useSelector(state => state.proposal.details);

  const handleChange = (e) => dispatch(setDetails(e.target.value));

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-stone-950 to-black pt-20">
      <div className="relative max-w-4xl w-full mx-auto p-6">
        <div className="relative backdrop-blur-sm bg-neutral-200 bg-opacity-10 rounded-2xl shadow-2xl border border-white border-opacity-20 p-10">

          <h2 className="text-3xl items-center font-semibold text-white bg-teal-600 rounded-t-3xl p-2 text-center mb-6">
            Toques Finais
          </h2>

          <p className="text-neutral-500 text-center mb-4">
            Insira observações ou instruções adicionais para a proposta abaixo.
          </p>

          <textarea
            rows="6"
            className="w-full px-4 py-3 bg-white text-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 border-none resize-none"
            placeholder="Escreva seus detalhes..."
            value={details}
            onChange={handleChange}
          />

          <div className="mt-10 flex justify-between">
            <button
              onClick={onBack}
              className="group relative flex items-center justify-center overflow-hidden cursor-pointer rounded-3xl bg-neutral-800 w-40 py-2 text-white shadow-lg transition-all hover:shadow-neutral-700/25"
            >
              <span className="relative z-10 mr-2 font-medium">Voltar</span>
              <ChevronLeft size={18} className="relative z-10" />
              <span className="absolute inset-0 h-full w-0 bg-gradient-to-r from-teal-600 to-teal-600 transition-all duration-300 ease-out group-hover:w-full" />
            </button>
            <button
              onClick={onNext}
              className="group relative flex items-center justify-center overflow-hidden cursor-pointer rounded-3xl bg-gradient-to-r from-teal-600 to-teal-600 w-40 py-2 text-white shadow-lg transition-all hover:shadow-orange-500/25"
            >
              <span className="relative z-10 mr-2 font-medium">Continuar</span>
              <ChevronRight size={18} className="relative z-10" />
              <span className="absolute inset-0 h-full w-0 bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 ease-out group-hover:w-full" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StepDetalhes;
