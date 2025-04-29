// src/components/StepPrazo.jsx
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import servicesCatalog from '../data/services.json';
import { updateService } from '../store/slices/proposalSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const StepPrazo = ({ onBack, onNext }) => {
  const dispatch = useDispatch();
  const services = useSelector(state => state.proposal.services);

  // Agrupa serviços selecionados por tipo
  const grouped = useMemo(() =>
    services.reduce((acc, svc) => {
      if (!acc[svc.type]) acc[svc.type] = [];
      acc[svc.type].push(svc);
      return acc;
    }, {}),
    [services]
  );

  const handleTermChange = (id, term) => {
    dispatch(updateService({ id, changes: { term } }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-stone-950 to-black pt-20">
      <div className="relative max-w-4xl w-full mx-auto p-6">
        <div className="relative backdrop-blur-sm bg-neutral-200 bg-opacity-10 rounded-2xl shadow-2xl border border-white border-opacity-20 p-10 overflow-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
            Defina o Prazo por Tipo de Serviço
          </h2>
          <div className="space-y-8">
            {servicesCatalog.serviceTypes.map(type => {
              const list = grouped[type.id] || [];
              if (list.length === 0) return null;
              return (
                <section key={type.id}>
                  <h3 className="text-xl items-center font-semibold text-white mb-2 bg-teal-600 rounded-t-3xl p-2">
                    {type.name}
                  </h3>
                  <div className="space-y-4 px-2 pb-2">
                    {list.map(svc => (
                      <div
                        key={svc.id}
                        className="group flex items-center justify-between bg-white bg-opacity-30 rounded-lg p-4 transition hover:bg-opacity-40"
                      >
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">
                            {svc.title}
                          </h4>
                          {!svc.isMonthly && (
                            <p className="text-neutral-400 text-sm">Serviço único</p>
                          )}
                        </div>
                        {svc.isMonthly && (
                          <div className="flex items-center space-x-2">
                            <label className="text-gray-400 font-medium">Prazo (meses):</label>
                            <select
                              value={svc.term || 1}
                              onChange={e => handleTermChange(svc.id, Number(e.target.value))}
                              className="px-3 py-2 bg-orange-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 border-none"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(t => (
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

export default StepPrazo;
