import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import servicesCatalog from '../data/services.json';
import { updateService } from '../store/slices/proposalSlice';

const StepPrazo = ({ onBack, onNext }) => {
  const dispatch = useDispatch();
  const services = useSelector(state => state.proposal.services);

  const grouped = useMemo(() =>
    services.reduce((acc, svc) => {
      if (!acc[svc.type]) acc[svc.type] = [];
      acc[svc.type].push(svc);
      return acc;
    }, {}), [services]);

  const handleTermChange = (id, term) => {
    dispatch(updateService({ id, changes: { term } }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-stone-950 to-black pt-0 md:pt-10 sm:pt-10">
      <div className="relative max-w-4xl w-full mx-auto ">
        <div className="relative backdrop-blur-sm bg-neutral-200 bg-opacity-10 rounded-2xl shadow-2xl border border-white border-opacity-20 p-6 sm:p-10 overflow-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800 text-center mb-1">
            Defina os Prazos
          </h2>
          <p className="text-sm text-neutral-500 text-center mb-6">
            Escolha a duração ideal para os serviço mensais com precisão.
          </p>

          <div className="space-y-8">
            {servicesCatalog.serviceTypes.map(type => {
              const list = grouped[type.id] || [];
              if (list.length === 0) return null;

              return (
                <section key={type.id}>
                  <h3 className="text-xl font-semibold text-white mb-2 bg-teal-600 rounded-t-3xl p-2 text-center">
                    {type.name}
                  </h3>

                  <div className="space-y-4">
                    {list.map(svc => (
                      <div key={svc.id} className="group flex flex-col sm:flex-row sm:items-center justify-between bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg p-4 hover:bg-opacity-20 transition">
                        <div className="mb-2 sm:mb-0">
                          <h4 className="text-lg font-semibold text-gray-600">{svc.title}</h4>
                          {!svc.isMonthly && (
                            <p className="text-neutral-400 text-sm">Serviço único</p>
                          )}
                        </div>

                        {svc.isMonthly && (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <label className="text-sm text-gray-400 font-medium whitespace-nowrap">Prazo (meses):</label>
                            <select
                              value={svc.term || 1}
                              onChange={e => handleTermChange(svc.id, Number(e.target.value))}
                              className="px-3 py-2 bg-neutral-900 text-white rounded-lg focus:ring-2 focus:ring-teal-600 border-none"
                            >
                              {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
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

          {/* Botões responsivos */}
          <div className="mt-10 flex flex-col md:flex-row justify-between gap-4">
            <button
              onClick={onBack}
              className="group relative cursor-pointer flex items-center justify-center w-full md:w-40 overflow-hidden rounded-3xl bg-neutral-800 py-2 text-white shadow-lg transition-all hover:shadow-orange-700/25"
            >
              <span className="relative z-10 font-medium">◄ Voltar</span>
              <span className="absolute inset-y-0 right-0 h-full w-0 bg-gradient-to-r from-orange-600 to-orange-500 transition-all duration-300 ease-out group-hover:w-full" />
            </button>

            <button
              onClick={onNext}
              className="group relative cursor-pointer flex items-center justify-center w-full md:w-40 overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 to-teal-600 py-2 text-white shadow-lg transition-all hover:shadow-orange-500/25"
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

export default StepPrazo;
