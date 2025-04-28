import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDetails } from '../store/slices/proposalSlice';

const StepDetalhes = ({ onBack, onNext }) => {
  const dispatch = useDispatch();
  const details = useSelector(s => s.proposal.details);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Detalhes Adicionais</h2>
      <textarea
        rows="5"
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
        placeholder="Inserir observações ou instruções adicionais..."
        value={details}
        onChange={e=>dispatch(setDetails(e.target.value))}
      />
      <div className="mt-6 flex justify-between">
        <button onClick={onBack} className="px-6 py-2 bg-gray-300 rounded-full hover:bg-gray-400">&larr; Voltar</button>
        <button onClick={onNext} className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800">Continuar &rarr;</button>
      </div>
    </div>
  );
};

export default StepDetalhes;