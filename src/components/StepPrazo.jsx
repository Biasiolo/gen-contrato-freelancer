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
    <div className="flex items-center justify-center pt-0 sm:pt-16 bg-transparent">
      <div className="relative max-w-4xl w-full mx-auto">
        <div className="relative backdrop-blur-[10px] bg-neutral-300/10 rounded-3xl p-12 overflow-hidden border border-gray-300/20 shadow-[inset_0_2px_2px_rgba(255,255,255,0.3),0_4px_20px_rgba(0,128,128,0.3)] ring-1 ring-white/10 transition-all">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-700 to-transparent opacity-60" />

          <h2 className="text-4xl sm:text-5xl text-center font-semibold text-orange-100 mb-2 rounded-t-3xl p-2">
            Defina os Prazos
          </h2>
          <p className="text-orange-100 text-lg text-center mb-6">
            Escolha a duração ideal para os serviços mensais com precisão.
          </p>

          <div className="space-y-8">
            {servicesCatalog.serviceTypes.map(type => {
              const list = grouped[type.id] || [];
              if (list.length === 0) return null;

              return (
                <section key={type.id}>
                  <h3 className="text-2xl font-semibold text-orange-100 mb-2 bg-black rounded-t-3xl p-2 text-center">
                    {type.name}
                  </h3>

                  <div className="space-y-4">
                    {list.map(svc => (
                      <div
                        key={svc.id}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/10 border border-white/20 rounded-xl p-4 transition hover:bg-opacity-20"
                      >
                        <div className="mb-2 sm:mb-0">
                          <h4 className="text-lg font-semibold text-white">{svc.title}</h4>
                          {!svc.isMonthly && (
                            <p className="text-orange-100 text-sm">Serviço único</p>
                          )}
                        </div>

                        {svc.isMonthly && (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <label className="text-sm text-orange-100 font-medium whitespace-nowrap">
                              Prazo mês(es):
                            </label>
                            <select
                              value={svc.term || 1}
                              onChange={e => handleTermChange(svc.id, Number(e.target.value))}
                              className="px-3 py-2 bg-stone-200 bg-opacity-20 text-gray-900 rounded-xl focus:ring-2 focus:ring-teal-600 border-none"
                            >
                              {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1}
                                </option>
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

          <div className="mt-10 flex flex-col md:flex-row justify-between gap-4">
            <button
              onClick={onBack}
              className="group relative flex items-center justify-center overflow-hidden cursor-pointer rounded-3xl bg-neutral-800/20 w-full md:w-40 py-2 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_20px_rgba(0,128,128,0.1)] ring-2 ring-white/10 transition-all hover:shadow-neutral-700/25"
            >
              <span className="relative z-10 font-medium">◄ Voltar</span>
              <span className="absolute inset-y-0 right-0 h-full w-0 bg-gradient-to-r from-orange-600 to-orange-500 transition-all duration-300 ease-out group-hover:w-full" />
            </button>

            <button
              onClick={onNext}
              className="group relative flex items-center justify-center overflow-hidden cursor-pointer rounded-3xl bg-teal-600/20 w-full md:w-40 py-2 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_20px_rgba(0,128,128,0.2)] ring-2 ring-white/10 transition-all hover:shadow-orange-400/25"
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
