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

  const proposalId = useMemo(() => crypto.randomUUID().split('-')[0], []);
  const today = useMemo(() => new Date().toLocaleDateString('pt-BR'), []);

  const items = useMemo(() => {
  return services
    .map(svc => {
      const term = svc.isMonthly ? svc.term || 1 : 1;
      const subtotal = svc.isMonthly
        ? svc.unitValue * svc.qty * term
        : svc.unitValue * svc.qty;
      return { ...svc, term, subtotal };
    })
    .sort((a, b) => b.subtotal - a.subtotal); // Ordena do maior para o menor
}, [services]);

  const grouped = useMemo(() =>
    items.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
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

  const formatCurrency = (val) => val.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  });

  const parsePaymentValue = (value) => {
    if (!value) return 0;
    return parseFloat(
      value.toString()
        .replace(/[^\d,]/g, '')
        .replace(',', '.')
    ) || 0;
  };

  const parcelasAgrupadas = useMemo(() => {
    // Criar um objeto para armazenar o valor de cada parcela por número
    const parcelasPorNumero = {};

    Object.entries(grouped).forEach(([typeId]) => {
      const total = typeTotals[typeId] || 0;
      const entrada = parsePaymentValue(payment[typeId]?.entry);
      const parcelas = parseInt(payment[typeId]?.installments, 10) || 0;
      const saldo = total - entrada;
      
      if (parcelas > 0 && saldo > 0) {
        const valorParcela = +(saldo / parcelas).toFixed(2);
        
        // Adicionar o valor desta parcela a cada número de parcela
        for (let i = 1; i <= parcelas; i++) {
          if (!parcelasPorNumero[i]) {
            parcelasPorNumero[i] = 0;
          }
          parcelasPorNumero[i] += valorParcela;
        }
      }
    });

    // Converter para array e agrupar parcelas consecutivas com o mesmo valor
    const numerosParcelas = Object.keys(parcelasPorNumero)
      .map(num => parseInt(num, 10))
      .sort((a, b) => a - b);

    if (numerosParcelas.length === 0) return [];

    const grupos = [];
    let inicio = numerosParcelas[0];
    let valorAtual = parcelasPorNumero[inicio];
    
    for (let i = 1; i < numerosParcelas.length; i++) {
      const numeroAtual = numerosParcelas[i];
      const valorParcela = parcelasPorNumero[numeroAtual];
      
      // Se o valor mudou ou há uma quebra na sequência
      if (Math.abs(valorParcela - valorAtual) > 0.01 || numeroAtual !== numerosParcelas[i-1] + 1) {
        grupos.push({
          de: inicio,
          ate: numerosParcelas[i-1],
          valor: valorAtual
        });
        inicio = numeroAtual;
        valorAtual = valorParcela;
      }
    }
    
    // Adicionar o último grupo
    grupos.push({
      de: inicio,
      ate: numerosParcelas[numerosParcelas.length - 1],
      valor: valorAtual
    });

    return grupos;
  }, [grouped, payment, typeTotals]);

  const renderServiceRow = (item) => (
    <React.Fragment key={item.id}>
      <tr>
        <td className="border px-2 py-2 text-gray-800"><strong>{item.title}</strong></td>
        <td className="border px-2 py-2 text-center text-gray-800">{item.qty}</td>
        <td className="border px-2 py-2 text-center text-gray-800">
          {item.isMonthly ? `${item.term} mês(es)` : 'Único'}
        </td>
        <td className="border px-2 py-1 text-right text-gray-800">
          {formatCurrency(item.unitValue)}
        </td>
        <td className="border px-2 py-1 text-right text-gray-800">
          {formatCurrency(item.subtotal)}
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
  );

  const renderServiceSection = (type) => {
    const list = grouped[type.id] || [];
    if (list.length === 0) return null;

    const total = typeTotals[type.id] || 0;
    const entrada = parsePaymentValue(payment[type.id]?.entry);
    const parcelas = parseInt(payment[type.id]?.installments, 10) || 0;
    const saldo = total - entrada;
    const valorParcela = parcelas > 0 ? saldo / parcelas : 0;

    return (
      <section key={type.id} className="space-y-4 mb-8">
        <h2 className="text-xl sm:text-2xl text-center font-semibold text-white mb-2 bg-black rounded-t-3xl p-2">
          {type.name} – Pacote: {formatCurrency(total)}
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse mb-0 text-sm">
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
              {list.map(renderServiceRow)}
            </tbody>
          </table>
        </div>
        
        <div className="bg-gray-200 p-2 pt-2 rounded-b-3xl">
          <h3 className="text-base font-medium mb-2 text-gray-800 text-center">
            Condições
          </h3>
          
          <div className="flex flex-col sm:flex-row sm:space-x-6 text-gray-700 mb-2 justify-center items-center gap-1">
            <span>
              <strong>Método:</strong> {payment[type.id]?.method || '-'}
            </span>
            <span>
              <strong>Entrada:</strong> {formatCurrency(entrada)}
            </span>
            <span>
              <strong>Saldo à pagar:</strong> R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              {parcelas > 0 && (
                <> em {parcelas}x de R$ {valorParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</>
              )}
            </span>
          </div>
          
          {payment[type.id]?.notes && (
            <p className="text-gray-700 px-2 text-sm">
              <strong>Observações:</strong> {payment[type.id].notes}
            </p>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent pt-0 sm:pt-10 px-0">
      <div className="relative max-w-4xl w-full mx-auto">
        <h2 className="text-4xl text-center font-semibold text-orange-100 mb-2 rounded-t-3xl p-2">
          Confira as Condições Gerais
        </h2>
        <div 
          ref={previewRef} 
          className="relative backdrop-blur-sm bg-neutral-50 bg-opacity-10 rounded-2xl shadow-2xl border border-white border-opacity-20 p-4 sm:p-10 overflow-auto"
        >
          {/* Header */}
          <header className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex justify-center sm:justify-start">
              <img src="/logo.png" alt="Logo" className="h-32 object-contain" />
            </div>
            
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

          {/* Introduction */}
          <section className="mb-6">
            <p className="text-center text-gray-700 text-xl sm:text-xl">
              {proposalInfo.introduction}
            </p>
          </section>

          {/* Service Sections */}
          {[...servicesCatalog.serviceTypes]
  .sort((a, b) => (typeTotals[b.id] || 0) - (typeTotals[a.id] || 0))
  .map(renderServiceSection)}

          {/* Total Geral */}
          <div className="text-right text-lg sm:text-xl font-bold text-gray-900 mb-6">
            Total Geral: {formatCurrency(typeTotals.overall)}
          </div>

          {/* Condições Gerais de Pagamento */}
{parcelasAgrupadas.length > 0 && (
  <section className="mb-8">
    <h2 className="text-2xl sm:text-2xl font-semibold text-white mb-3 bg-black rounded-t-3xl px-4 py-2 text-center">
      Condições Gerais de Pagamento
    </h2>
    <div className="bg-gray-200 border-none rounded-b-3xl shadow-sm p-4 space-y-2 text-sm sm:text-base text-gray-700">
      {parcelasAgrupadas.map((parcela, index) => (
        <div
          key={index}
          className="flex justify-between items-center  bg-gray-50 rounded-md px-3 py-2 hover:bg-gray-100 transition"
        >
          <span className="font-medium">
            {parcela.de === parcela.ate
              ? `Parcela ${parcela.de}`
              : `Da ${parcela.de}ª à ${parcela.ate}ª parcela`}
          </span>
          <span className="text-gray-800 font-semibold">{formatCurrency(parcela.valor)}</span>
        </div>
      ))}
    </div>
  </section>
)}

          {/* Detalhes Adicionais */}
          <section className="mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Detalhes Adicionais
            </h2>
            <p className="text-gray-700 text-sm sm:text-base">{details}</p>
          </section>

          {/* Informações Importantes */}
          <section>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              Informações Importantes
            </h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {proposalInfo.importantInfo.map((info, idx) => (
                <li key={idx}>{info}</li>
              ))}
            </ul>
          </section>

          {/* Navigation Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row justify-between gap-4">
            <button 
              type="button"
              onClick={onBack} 
              className="group relative flex items-center justify-center overflow-hidden cursor-pointer rounded-3xl bg-neutral-800 w-full sm:w-40 py-2 text-white shadow-lg transition-all hover:shadow-neutral-700/25"
            >
              <span className="relative z-10 font-medium">◄ Voltar</span>
              <span className="absolute inset-y-0 right-0 h-full w-0 bg-gradient-to-l from-orange-500 to-orange-600 transition-all duration-300 ease-out group-hover:w-full" />
            </button>
            
            <button 
              type="button"
              onClick={onNext} 
              className="group relative flex items-center justify-center overflow-hidden cursor-pointer rounded-3xl bg-gradient-to-r from-teal-600 to-teal-600 w-full sm:w-40 py-2 text-white shadow-lg transition-all hover:shadow-orange-500/25"
            >
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