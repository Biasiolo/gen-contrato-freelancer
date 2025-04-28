// src/components/StepCondicoes.jsx
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import servicesCatalog from '../data/services.json';
import { setPaymentConditions } from '../store/slices/proposalSlice';

const StepCondicoes = ({ onBack, onNext }) => {
  const dispatch = useDispatch();
  const services = useSelector(state => state.proposal.services);
  const cond = useSelector(state => state.proposal.paymentConditions);

  // Agrupa serviços selecionados por tipo
  const grouped = useMemo(() => {
    return services.reduce((acc, svc) => {
      if (!acc[svc.type]) acc[svc.type] = [];
      acc[svc.type].push(svc);
      return acc;
    }, {});
  }, [services]);

  // Calcula totais por tipo e total geral
  const totals = useMemo(() => {
    const sums = {};
    Object.entries(grouped).forEach(([typeId, list]) => {
      const totalType = list.reduce((sum, item) => {
        const term = item.isMonthly ? (item.term || 1) : 1;
        return sum + item.unitValue * item.qty * term;
      }, 0);
      sums[typeId] = totalType;
    });
    const overallTotal = Object.values(sums).reduce((sum, val) => sum + val, 0);
    sums.overall = overallTotal;
    return sums;
  }, [grouped]);

  const handleChange = (typeId, field, value) => {
    dispatch(
      setPaymentConditions({
        [typeId]: {
          ...(cond[typeId] || {}),
          [field]: value
        }
      })
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Condições de Pagamento por Tipo</h2>

      <div className="space-y-8">
        {servicesCatalog.serviceTypes.map(type => {
          const list = grouped[type.id] || [];
          if (list.length === 0) return null;
          return (
            <section key={type.id}>
              <h3 className="text-xl font-semibold mb-2">
                {type.name} - Pacote: R$ {totals[type.id].toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-gray-700">Método de Pagamento</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
                    placeholder="Ex.: Boleto, Cartão, Transferência"
                    value={cond[type.id]?.method || ''}
                    onChange={e => handleChange(type.id, 'method', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-700">Entrada</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
                    placeholder="Ex.: 50% na assinatura"
                    value={cond[type.id]?.entry || ''}
                    onChange={e => handleChange(type.id, 'entry', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-700">Número de Parcelas</label>
                  <input
                    type="number"
                    min="1"
                    className="w-24 px-3 py-2 border rounded-lg focus:outline-none focus:ring"
                    value={cond[type.id]?.installments || ''}
                    onChange={e => handleChange(type.id, 'installments', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-700">Observações</label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
                    rows="2"
                    placeholder="Notas adicionais..."
                    value={cond[type.id]?.notes || ''}
                    onChange={e => handleChange(type.id, 'notes', e.target.value)}
                  />
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-300 rounded-full hover:bg-gray-400"
        >
          &larr; Voltar
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800"
        >
          Continuar &rarr;
        </button>
      </div>

      <div className="mt-4 text-right text-lg font-semibold">
        Total Geral: R$ {totals.overall.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
};

export default StepCondicoes;
