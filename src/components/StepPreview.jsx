import React, { useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import servicesCatalog from '../data/services.json';
import proposalInfo from '../data/proposalInfo.json';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const StepPreview = ({ onBack, onNext }) => {
  const previewRef = useRef();
  const client = useSelector(s => s.proposal.client);
  const services = useSelector(s => s.proposal.services);
  const payment = useSelector(s => s.proposal.paymentConditions);
  const details = useSelector(s => s.proposal.details);

  const proposalId = useMemo(() => crypto.randomUUID().split('-')[0], []);
  const today = useMemo(() => new Date().toLocaleDateString('pt-BR'), []);

  const items = useMemo(
    () => services.map(svc => {
      const term = svc.isMonthly ? svc.term || 1 : 1;
      const subtotal = svc.isMonthly ? svc.unitValue * svc.qty * term : svc.unitValue * svc.qty;
      return { ...svc, term, subtotal };
    }),
    [services]
  );

  const grouped = useMemo(() =>
    items.reduce((acc, item) => {
      acc[item.type] = acc[item.type] || [];
      acc[item.type].push(item);
      return acc;
    }, {}),
    [items]
  );

  const typeTotals = useMemo(() => {
    const totals = {};
    Object.entries(grouped).forEach(([typeId, list]) => {
      totals[typeId] = list.reduce((sum, itm) => sum + itm.subtotal, 0);
    });
    totals.overall = Object.values(totals).reduce((sum, val) => sum + val, 0);
    return totals;
  }, [grouped]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-stone-950 to-black pt-0 sm:pt-10 px-0">
      <div className="relative max-w-4xl w-full mx-auto p-4 sm:p-6">
        <div ref={previewRef} className="relative backdrop-blur-sm bg-neutral-50 bg-opacity-10 rounded-2xl shadow-2xl border border-white border-opacity-20 p-4 sm:p-10 overflow-auto">

        <header className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
  {/* Logo */}
  <div className="flex justify-center sm:justify-start">
    <img src="/logo.png" alt="Logo" className="h-32 object-contain" />
  </div>

  {/* Info */}
  <div className="flex-1">
    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center sm:text-right mb-2">
      {proposalInfo.proposalHeader.title}
    </h1>
    <div className="flex flex-wrap justify-center sm:justify-end gap-2 text-sm text-neutral-700 bg-gray-50 border border-gray-400 rounded-lg px-4 py-2 mb-2">
      <span><strong>Cliente:</strong> {client.company}</span>
      <span><strong>Email:</strong> {client.email}</span>
    </div>
    <div className="flex flex-wrap justify-center sm:justify-end gap-2 text-sm text-neutral-700 bg-gray-50 border border-gray-400 rounded-lg px-4 py-2">
      <span><strong>ID:</strong> {proposalId}</span>
      <span><strong>Validade:</strong> {proposalInfo.proposalHeader.validity}</span>
      <span><strong>Data:</strong> {today}</span>
    </div>
  </div>
</header>

          <section className="mb-6">
            <p className="text-justify text-gray-700 text-sm sm:text-base">{proposalInfo.introduction}</p>
          </section>

          {servicesCatalog.serviceTypes.map(type => {
            const list = grouped[type.id] || [];
            if (!list.length) return null;
            return (
              <section key={type.id} className="space-y-4 mb-8">
                <h2 className="text-xl sm:text-2xl text-center font-semibold text-white mb-2 bg-teal-600 rounded-t-3xl p-2">
                  {type.name} – Pacote: R$ {typeTotals[type.id].toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse mb-2 text-sm">
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
                            <td className="border px-2 py-1 text-gray-800">{item.title}</td>
                            <td className="border px-2 py-1 text-center text-gray-800">{item.qty}</td>
                            <td className="border px-2 py-1 text-center text-gray-800">{item.isMonthly ? `${item.term} meses` : 'Único'}</td>
                            <td className="border px-2 py-1 text-right text-gray-800">R$ {item.unitValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td className="border px-2 py-1 text-right text-gray-800">R$ {item.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          </tr>
                          {item.description && (
                            <tr>
                              <td colSpan="5" className="border px-4 py-2 text-gray-600 text-sm">{item.description}</td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-gray-100 p-2 pt-0 rounded-b-3xl">
                  <h3 className="text-base font-medium mb-2 text-gray-800 text-center">Condições de Pagamento</h3>
                  <div className="flex flex-col sm:flex-row sm:space-x-6 text-gray-700 mb-2 justify-center items-center gap-1">
                    <span><strong>Método:</strong> {payment[type.id]?.method || '-'}</span>
                    <span><strong>Entrada:</strong> {payment[type.id]?.entry || '-'}</span>
                    <span><strong>Parcelas:</strong> {payment[type.id]?.installments || '-'}</span>
                  </div>
                  {payment[type.id]?.notes && (
                    <p className="text-gray-700 px-2 text-sm"><strong>Observações:</strong> {payment[type.id].notes}</p>
                  )}
                </div>
              </section>
            );
          })}

          <div className="text-right text-lg sm:text-xl font-bold text-gray-900 mb-6">
            Total Geral: R$ {typeTotals.overall.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>

          <section className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Detalhes Adicionais</h2>
            <p className="text-gray-700 text-sm sm:text-base">{details}</p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Informações Importantes</h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {proposalInfo.importantInfo.map((info, idx) => (
                <li key={idx}>{info}</li>
              ))}
            </ul>
          </section>

          <div className="mt-10 flex flex-col sm:flex-row justify-between gap-4">
            <button onClick={onBack} className="group relative flex items-center justify-center overflow-hidden cursor-pointer rounded-3xl bg-neutral-800 w-full sm:w-40 py-2 text-white shadow-lg transition-all hover:shadow-neutral-700/25">
              <span className="relative z-10 font-medium">◄ Voltar</span>

              <span className="absolute inset-y-0 right-0 h-full w-0 bg-gradient-to-l from-orange-500 to-orange-600 transition-all duration-300 ease-out group-hover:w-full" />
            </button>
            <button onClick={onNext} className="group relative flex items-center justify-center overflow-hidden cursor-pointer rounded-3xl bg-gradient-to-r from-teal-600 to-teal-600 w-full sm:w-40 py-2 text-white shadow-lg transition-all hover:shadow-orange-500/25">
              <span className="relative z-10 font-medium">Avançar PDF ►</span>

              <span className="absolute inset-0 h-full w-0 bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 ease-out group-hover:w-full" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StepPreview;
