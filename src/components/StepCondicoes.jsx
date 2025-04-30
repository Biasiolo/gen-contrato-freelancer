// src/components/StepCondicoes.jsx
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import servicesCatalog from '../data/services.json';
import { setPaymentConditions } from '../store/slices/proposalSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const StepCondicoes = ({ onBack, onNext }) => {
  const dispatch = useDispatch();
  const services = useSelector(state => state.proposal.services);
  const cond = useSelector(state => state.proposal.paymentConditions);

  const grouped = useMemo(() =>
    services.reduce((acc, svc) => {
      if (!acc[svc.type]) acc[svc.type] = [];
      acc[svc.type].push(svc);
      return acc;
    }, {}),
    [services]
  );

  const totals = useMemo(() => {
    const sums = {};
    Object.entries(grouped).forEach(([typeId, list]) => {
      const totalType = list.reduce((sum, item) => {
        const term = item.isMonthly ? (item.term || 1) : 1;
        return sum + item.unitValue * item.qty * term;
      }, 0);
      sums[typeId] = totalType;
    });
    const overall = Object.values(sums).reduce((s, v) => s + v, 0);
    return { ...sums, overall };
  }, [grouped]);

  const handleChange = (typeId, field, value) => {
    dispatch(setPaymentConditions({
      [typeId]: {
        ...(cond[typeId] || {}),
        [field]: value
      }
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-stone-950 to-black pt-0 sm:pt-10 px-4">
      <div className="relative w-full max-w-4xl mx-auto p-4 sm:p-6">
        <div className="relative backdrop-blur-sm bg-neutral-200 bg-opacity-10 rounded-2xl shadow-2xl border border-white border-opacity-20 p-6 sm:p-10 overflow-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-1">
            Defina as Condições
          </h2>
          <p className="text-sm text-neutral-500 text-center mb-6">
            Escolha como cada tipo de serviço será pago, incluindo entrada, método e número de parcelas.
          </p>

          <div className="space-y-8">
            {servicesCatalog.serviceTypes.map(type => {
              const list = grouped[type.id] || [];
              if (!list.length) return null;
              return (
                <section key={type.id}>
                  <h3 className="text-xl items-center font-semibold text-white mb-2 bg-teal-600 rounded-t-3xl p-2">
                    {type.name} – Pacote: R$ {totals[type.id].toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </h3>
                  <div className="space-y-4 px-2 pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-500 mb-1">Método de Pagamento</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-white text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 border-none"
                          placeholder="Ex.: Boleto, Cartão, Transferência"
                          value={cond[type.id]?.method || ''}
                          onChange={e => handleChange(type.id, 'method', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-500 mb-1">Entrada</label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 bg-white text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 border-none"
                          placeholder="Ex.: 50% na assinatura"
                          value={cond[type.id]?.entry || ''}
                          onChange={e => handleChange(type.id, 'entry', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-500 mb-1">Parcelas</label>
                        <input
                          type="number"
                          min="1"
                          className="w-full px-3 py-2 bg-white text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 border-none"
                          value={cond[type.id]?.installments || ''}
                          onChange={e => handleChange(type.id, 'installments', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-500 mb-1">Observações</label>
                        <textarea
                          rows="1"
                          className="w-full px-3 py-2 bg-white text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 border-none"
                          placeholder="Notas adicionais..."
                          value={cond[type.id]?.notes || ''}
                          onChange={e => handleChange(type.id, 'notes', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>

          <div className="mt-6 text-right text-lg font-extrabold text-orange-400">
            Total Geral: R$ {totals.overall.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row justify-between gap-4">
            <button
              onClick={onBack}
              className="group relative flex items-center justify-center overflow-hidden cursor-pointer rounded-3xl bg-neutral-800 w-full sm:w-40 py-2 text-white shadow-lg transition-all hover:shadow-orange-500/25"
            >
              <span className="relative z-10 mr-2 font-medium">Voltar</span>
              <ChevronLeft size={18} className="relative z-10" />
              <span className="absolute inset-y-0 right-0 h-full w-0 bg-gradient-to-r from-orange-600 to-orange-500 transition-all duration-300 ease-out group-hover:w-full" />
            </button>
            <button
              onClick={onNext}
              className="group relative flex items-center justify-center overflow-hidden cursor-pointer rounded-3xl bg-gradient-to-r from-teal-600 to-teal-600 w-full sm:w-40 py-2 text-white shadow-lg transition-all hover:shadow-orange-500/25"
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

export default StepCondicoes;
