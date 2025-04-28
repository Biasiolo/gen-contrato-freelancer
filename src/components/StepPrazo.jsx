// src/components/StepPrazo.jsx
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import servicesCatalog from '../data/services.json';
import { updateService } from '../store/slices/proposalSlice';

const StepPrazo = ({ onBack, onNext }) => {
  const dispatch = useDispatch();
  const services = useSelector(state => state.proposal.services);

  // Agrupa serviços selecionados por tipo
  const grouped = useMemo(() => {
    return services.reduce((acc, svc) => {
      if (!acc[svc.type]) acc[svc.type] = [];
      acc[svc.type].push(svc);
      return acc;
    }, {});
  }, [services]);

  const handleTermChange = (id, term) => {
    dispatch(updateService({ id, changes: { term } }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Defina o Prazo por Tipo de Serviço</h2>
      <div className="space-y-8">
        {servicesCatalog.serviceTypes.map(type => {
          const list = grouped[type.id] || [];
          if (list.length === 0) return null;
          return (
            <section key={type.id}>
              <h3 className="text-xl font-semibold mb-4">{type.name}</h3>
              <div className="space-y-4">
                {list.map(svc => (
                  <div key={svc.id} className="flex items-center justify-between border p-4 rounded-lg">
                    <div>
                      <h4 className="font-semibold">{svc.title}</h4>
                      {!svc.isMonthly && <p className="text-sm text-gray-600">Serviço único</p>}
                    </div>
                    {svc.isMonthly && (
                      <div className="flex items-center space-x-2">
                        <label className="text-gray-700">Prazo (meses):</label>
                        <select
                          value={svc.term || 1}
                          onChange={e => handleTermChange(svc.id, Number(e.target.value))}
                          className="px-3 py-2 border rounded-lg"
                        >
                          {[1, 3, 6, 12].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <div className="mt-6 flex justify-between">
        <button onClick={onBack} className="px-6 py-2 bg-gray-300 rounded-full hover:bg-gray-400">
          &larr; Voltar
        </button>
        <button onClick={onNext} className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800">
          Continuar &rarr;
        </button>
      </div>
    </div>
  );
};

export default StepPrazo;
