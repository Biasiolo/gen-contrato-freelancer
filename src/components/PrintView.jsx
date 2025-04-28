// src/components/PrintView.jsx
import React, { useRef, useMemo } from 'react';
import html2pdf from 'html2pdf.js';
import { useSelector } from 'react-redux';
import proposalInfo from '../data/proposalInfo.json';

const PrintView = ({ onBack }) => {
  const printRef = useRef();
  const client = useSelector(state => state.proposal.client);
  const services = useSelector(state => state.proposal.services);
  const payment = useSelector(state => state.proposal.paymentConditions);
  const details = useSelector(state => state.proposal.details);

  // Short 8-digit ID and Brazilian date
  const proposalId = useMemo(() => crypto.randomUUID().split('-')[0], []);
  const today = useMemo(() => new Date().toLocaleDateString('pt-BR'), []);

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

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.subtotal, 0),
    [items]
  );

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

  // Inline styles
  const containerStyle = { backgroundColor: '#f5f5f5', padding: '20px', minHeight: '100vh' };
  const controlsStyle = { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' };
  const buttonStyle = { padding: '10px 20px', border: 'none', cursor: 'pointer' };
  const docStyle = { backgroundColor: '#fff', padding: '40px', margin: '0 auto', width: '19cm', minHeight: '27.7cm', boxSizing: 'border-box' };
  const headerStyle = { textAlign: 'center', marginBottom: '20px' };
  const h1Style = { fontSize: '24px', margin: '0 0 10px 0' };
  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginBottom: '20px' };
  const thTdStyle = { border: '1px solid #000', padding: '8px', fontSize: '12px' };
  const footerStyle = { borderTop: '1px solid #000', paddingTop: '10px', fontSize: '12px', marginTop: '20px' };

  return (
    <>
      <style>{`@media print { .no-print { display: none !important; } }`}</style>
      <div style={containerStyle}>
        <div style={controlsStyle} className="no-print">
          <button onClick={onBack} style={{ ...buttonStyle, backgroundColor: '#ccc' }}>Voltar</button>
          <button onClick={handlePrint} style={{ ...buttonStyle, backgroundColor: '#f90', color: '#000' }}>Imprimir</button>
          <button onClick={handleDownloadPDF} style={{ ...buttonStyle, backgroundColor: '#0a7', color: '#fff' }}>Baixar PDF</button>
          <button onClick={handleShareFile} style={{ ...buttonStyle, backgroundColor: '#06c', color: '#fff' }}>Compartilhar arquivo</button>
        </div>
        <div ref={printRef} style={docStyle}>
          <div style={headerStyle}>
            <h1 style={h1Style}>{proposalInfo.proposalHeader.title}</h1>
            <p><strong>ID:</strong> {proposalId}</p>
            <p><strong>Cliente:</strong> {client.name}</p>
            <p><strong>Projeto:</strong> {proposalInfo.proposalHeader.project}</p>
            <p><strong>Validade:</strong> {proposalInfo.proposalHeader.validity}</p>
            <p><strong>Data:</strong> {today}</p>
          </div>
          <p style={{ textAlign: 'justify', fontSize: '12px', marginBottom: '20px' }}>{proposalInfo.introduction}</p>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>Serviço</th>
                <th style={{ ...thTdStyle, textAlign: 'center' }}>Qtd</th>
                <th style={{ ...thTdStyle, textAlign: 'center' }}>Prazo</th>
                <th style={{ ...thTdStyle, textAlign: 'right' }}>Valor Unit.</th>
                <th style={{ ...thTdStyle, textAlign: 'right' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <React.Fragment key={item.id}>
                  <tr>
                    <td style={thTdStyle}>{item.title}</td>
                    <td style={{ ...thTdStyle, textAlign: 'center' }}>{item.qty}</td>
                    <td style={{ ...thTdStyle, textAlign: 'center' }}>{item.isMonthly ? `${item.term} meses` : 'Único'}</td>
                    <td style={{ ...thTdStyle, textAlign: 'right' }}>R$ {item.unitValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td style={{ ...thTdStyle, textAlign: 'right' }}>R$ {item.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                  {item.description && (
                    <tr>
                      <td colSpan="5" style={{ border: '1px solid #000', padding: '8px', fontSize: '12px', color: '#444' }}>
                        {item.description}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              <tr>
                <td colSpan="4" style={{ ...thTdStyle, textAlign: 'right', fontWeight: 'bold' }}>Total</td>
                <td style={{ ...thTdStyle, textAlign: 'right', fontWeight: 'bold' }}>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
          <div style={{ fontSize: '12px', marginBottom: '20px' }}>
            <strong>Condições de Pagamento:</strong><br />
            Método: {payment.method}<br />
            Entrada: {payment.entry}<br />
            Parcelas: {payment.installments}<br />
            {payment.notes && <>Observações: {payment.notes}</>}
          </div>
          <div style={{ fontSize: '12px', marginBottom: '20px' }}>
            <strong>Detalhes Adicionais:</strong><br />{details}
          </div>
          <div style={{ fontSize: '12px', marginBottom: '20px' }}>
            <strong>Informações Importantes:</strong>
            <ul style={{ paddingLeft: '20px' }}>
              {proposalInfo.importantInfo.map((info, i) => <li key={i}>{info}</li>)}
            </ul>
          </div>
          <footer style={footerStyle}>
            <div><strong>{proposalInfo.company.name}</strong> - CNPJ {proposalInfo.company.cnpj}</div>
            <div>Email: {proposalInfo.company.email} | Tel: {proposalInfo.company.phone}</div>
            <div>{proposalInfo.company.address.street}, {proposalInfo.company.address.number} - {proposalInfo.company.address.neighborhood}, {proposalInfo.company.address.city} - {proposalInfo.company.address.state}, CEP {proposalInfo.company.address.cep}</div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default PrintView;
