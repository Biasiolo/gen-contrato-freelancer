// src/components/PrintView.jsx
import React, { useRef, useMemo } from 'react';
import html2pdf from 'html2pdf.js';
import { useSelector } from 'react-redux';
import servicesCatalog from '../data/services.json';
import proposalInfo from '../data/proposalInfo.json';

const PrintView = ({ onBack }) => {
  const printRef = useRef();
  const client = useSelector(state => state.proposal.client);
  const services = useSelector(state => state.proposal.services);
  const payment = useSelector(state => state.proposal.paymentConditions);
  const details = useSelector(state => state.proposal.details);

  // Short ID and date
  const proposalId = useMemo(() => crypto.randomUUID().split('-')[0], []);
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

  // Totals per type and overall
  const typeTotals = useMemo(() => {
    const totals = {};
    Object.entries(grouped).forEach(([typeId, list]) => {
      totals[typeId] = list.reduce((sum, itm) => sum + itm.subtotal, 0);
    });
    totals.overall = Object.values(totals).reduce((sum, val) => sum + val, 0);
    return totals;
  }, [grouped]);

  // Download PDF
  const handleDownloadPDF = () => {
    const element = printRef.current;
    const opt = {
      margin: 1,
      filename: `${client.name}-${proposalId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handlePrint = () => window.print();
  const handleShareFile = async () => {
    try {
      const blob = await html2pdf().from(printRef.current).output('blob');
      const file = new File([blob], `${client.name}-${proposalId}.pdf`, { type: 'application/pdf' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Proposta Comercial', text: 'Segue em anexo a proposta em PDF.' });
        return;
      }
    } catch (error) {
      console.error('Erro ao compartilhar arquivo:', error);
    }
    handleDownloadPDF();
  };

  // Styles
  const container = { backgroundColor: '#f5f5f5', padding: '20px', minHeight: '100vh' };
  const controls = { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' };
  const btn = { padding: '10px 20px', border: 'none', cursor: 'pointer' };
  const docStyle = { backgroundColor: '#fff', padding: '40px', margin: '0 auto', width: '19cm', minHeight: '27.7cm', boxSizing: 'border-box' };
  const headerStyle = { textAlign: 'center', marginBottom: '20px' };
  const h1 = { fontSize: '24px', margin: '0 0 10px 0' };
  const table = { width: '100%', borderCollapse: 'collapse', marginBottom: '20px' };
  const cell = { border: '1px solid #000', padding: '8px', fontSize: '12px' };
  const paymentBox = { backgroundColor: '#007672', padding: '10px', borderRadius: '6px', marginBottom: '20px' };
  const footer = { borderTop: '1px solid #000', paddingTop: '10px', fontSize: '12px', marginTop: '20px' };

  return (
    <>
      <style>{`@media print { .no-print { display: none !important; } }`}</style>
      <div style={container}>
        <div style={controls} className="no-print">
          <button onClick={onBack} style={{ ...btn, backgroundColor: '#ccc' }}>Voltar</button>
          <button onClick={handlePrint} style={{ ...btn, backgroundColor: '#f90', color: '#000' }}>Imprimir</button>
          <button onClick={handleDownloadPDF} style={{ ...btn, backgroundColor: '#0a7', color: '#fff' }}>Baixar PDF</button>
          <button onClick={handleShareFile} style={{ ...btn, backgroundColor: '#06c', color: '#fff' }}>Compartilhar</button>
        </div>
        <div ref={printRef} style={docStyle}>
          {/* Header */}
          <div style={headerStyle}>
            <h1 style={h1}>{proposalInfo.proposalHeader.title}</h1>
            <p><strong>ID:</strong> {proposalId}</p>
            <p><strong>Cliente:</strong> {client.name}</p>
            <p><strong>Projeto:</strong> {proposalInfo.proposalHeader.project}</p>
            <p><strong>Validade:</strong> {proposalInfo.proposalHeader.validity}</p>
            <p><strong>Data:</strong> {today}</p>
          </div>

          {/* Introduction */}
          <p style={{ textAlign: 'justify', fontSize: '12px', marginBottom: '20px' }}>{proposalInfo.introduction}</p>

          {/* For each type */}
          {servicesCatalog.serviceTypes.map(type => {
            const list = grouped[type.id] || [];
            if (!list.length) return null;
            return (
              <div key={type.id} style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>
                  {type.name} - Pacote: R$ {typeTotals[type.id].toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h2>
                <table style={table}>
                  <thead>
                    <tr>
                      <th style={cell}>Serviço</th>
                      <th style={{ ...cell, textAlign: 'center' }}>Qtd</th>
                      <th style={{ ...cell, textAlign: 'center' }}>Prazo</th>
                      <th style={{ ...cell, textAlign: 'right' }}>Valor Unit.</th>
                      <th style={{ ...cell, textAlign: 'right' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map(item => (
                      <React.Fragment key={item.id}>
                        <tr>
                          <td style={cell}>{item.title}</td>
                          <td style={{ ...cell, textAlign: 'center' }}>{item.qty}</td>
                          <td style={{ ...cell, textAlign: 'center' }}>{item.isMonthly ? `${item.term} meses` : 'Único'}</td>
                          <td style={{ ...cell, textAlign: 'right' }}>R$ {item.unitValue.toLocaleString('pt-BR',{minimumFractionDigits:2})}</td>
                          <td style={{ ...cell, textAlign: 'right' }}>R$ {item.subtotal.toLocaleString('pt-BR',{minimumFractionDigits:2})}</td>
                        </tr>
                        {item.description && (
                          <tr>
                            <td colSpan="5" style={{ ...cell, fontSize: '11px', color: '#555' }}>
                              {item.description}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                {/* Payment Conditions */}
                <div style={paymentBox}>
                  <h3 style={{ margin: '0 0 6px' }}>Condições de Pagamento</h3>
                  <div style={{ fontSize: '12px' }}>
                    <p><strong>Método:</strong> {payment[type.id]?.method || '-'}</p>
                    <p><strong>Entrada:</strong> {payment[type.id]?.entry || '-'}</p>
                    <p><strong>Parcelas:</strong> {payment[type.id]?.installments || '-'}</p>
                    {payment[type.id]?.notes && <p><strong>Observações:</strong> {payment[type.id].notes}</p>}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Overall Total */}
          <div style={{ textAlign: 'right', fontSize: '16px', fontWeight: 'bold', marginBottom: '20px' }}>
            Total Geral: R$ {typeTotals.overall.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>

          {/* Additional Details */}
          <div style={{ fontSize: '12px', marginBottom: '20px' }}>
            <strong>Detalhes Adicionais:</strong><br />{details}
          </div>

          {/* Important Info */}
          <div style={{ fontSize: '12px' }}>
            <strong>Informações Importantes:</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
              {proposalInfo.importantInfo.map((info, i) => <li key={i}>{info}</li>)}
            </ul>
          </div>

          {/* Footer */}
          <div style={footer}>
            <div><strong>{proposalInfo.company.name}</strong> - CNPJ {proposalInfo.company.cnpj}</div>
            <div>Email: {proposalInfo.company.email} | Tel: {proposalInfo.company.phone}</div>
            <div>{proposalInfo.company.address.street}, {proposalInfo.company.address.number} - {proposalInfo.company.address.neighborhood}, {proposalInfo.company.address.city} - {proposalInfo.company.address.state}, CEP {proposalInfo.company.address.cep}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintView;
