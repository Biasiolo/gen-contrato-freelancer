// src/components/StepPreview.jsx
import React, { useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import servicesCatalog from '../data/services.json';
import proposalInfo from '../data/proposalInfo.json';

const StepPreview = ({ onBack, onNext }) => {
  const previewRef = useRef();
  const client = useSelector(s => s.proposal.client);
  const services = useSelector(s => s.proposal.services);
  const payment = useSelector(s => s.proposal.paymentConditions);
  const details = useSelector(s => s.proposal.details);

  // Short 8-digit proposal ID
  const proposalId = useMemo(() => crypto.randomUUID().split('-')[0], []);
  // Current date in Brazilian format
  const today = useMemo(() => new Date().toLocaleDateString('pt-BR'), []);

  // Compute items with subtotal
  const items = useMemo(
    () => services.map(svc => {
      const term = svc.isMonthly ? svc.term || 1 : 1;
      const subtotal = svc.isMonthly
        ? svc.unitValue * svc.qty * term
        : svc.unitValue * svc.qty;
      return { ...svc, term, subtotal };
    }),
    [services]
  );

  // Group items by type
  const grouped = useMemo(() => {
    return items.reduce((acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item);
      return acc;
    }, {});
  }, [items]);

  // Calculate totals per type and overall
  const typeTotals = useMemo(() => {
    const totals = {};
    Object.entries(grouped).forEach(([typeId, list]) => {
      totals[typeId] = list.reduce((sum, itm) => sum + itm.subtotal, 0);
    });
    totals.overall = Object.values(totals).reduce((sum, val) => sum + val, 0);
    return totals;
  }, [grouped]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <div ref={previewRef} className="space-y-6">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-3xl font-bold">{proposalInfo.proposalHeader.title}</h1>
          <p><strong>ID:</strong> {proposalId}</p>
          <p><strong>Cliente:</strong> {client.name}</p>
          <p><strong>Projeto:</strong> {proposalInfo.proposalHeader.project}</p>
          <p><strong>Validade:</strong> {proposalInfo.proposalHeader.validity}</p>
          <p><strong>Data:</strong> {today}</p>
        </header>

        {/* Introduction */}
        <section>
          <p className="text-justify text-gray-700">{proposalInfo.introduction}</p>
        </section>

        {/* Services & Conditions by Type */}
        {servicesCatalog.serviceTypes.map(type => {
          const list = grouped[type.id] || [];
          if (list.length === 0) return null;
          return (
            <section key={type.id} className="space-y-4">
              <h2 className="text-2xl font-semibold mb-2">
                {type.name} - Pacote: R$ {typeTotals[type.id].toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h2>
              <table className="w-full table-auto border-collapse mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1">Serviço</th>
                    <th className="border px-2 py-1">Qtd</th>
                    <th className="border px-2 py-1">Prazo</th>
                    <th className="border px-2 py-1">Valor Unit.</th>
                    <th className="border px-2 py-1">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(item => (
                    <React.Fragment key={item.id}>
                      <tr>
                        <td className="border px-2 py-1">{item.title}</td>
                        <td className="border px-2 py-1 text-center">{item.qty}</td>
                        <td className="border px-2 py-1 text-center">
                          {item.isMonthly ? `${item.term} meses` : 'Único'}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          R$ {item.unitValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          R$ {item.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                      {item.description && (
                        <tr>
                          <td colSpan="5" className="border px-4 py-2 text-gray-600 text-sm">
                            {item.description}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              {/* Payment Conditions for this type */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Condições de Pagamento</h3>
                <p><strong>Método:</strong> {payment[type.id]?.method || '-'}</p>
                <p><strong>Entrada:</strong> {payment[type.id]?.entry || '-'}</p>
                <p><strong>Parcelas:</strong> {payment[type.id]?.installments || '-'}</p>
                {payment[type.id]?.notes && <p><strong>Observações:</strong> {payment[type.id].notes}</p>}
              </div>
            </section>
          );
        })}

        {/* Overall Total */}
        <div className="font-bold text-right text-xl mb-4">
          Total Geral: R$ {typeTotals.overall.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>

        {/* Additional Details */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Detalhes Adicionais</h2>
          <p>{details}</p>
        </section>

        {/* Important Info */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Informações Importantes</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
            {proposalInfo.importantInfo.map((info, idx) => (
              <li key={idx}>{info}</li>
            ))}
          </ul>
        </section>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex items-center justify-between">
        <button onClick={onBack} className="px-6 py-2 bg-gray-300 rounded-full hover:bg-gray-400">
          &larr; Voltar
        </button>
        <button onClick={onNext} className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800">
          Avançar para PDF &rarr;
        </button>
      </div>
    </div>
  );
};

export default StepPreview;
