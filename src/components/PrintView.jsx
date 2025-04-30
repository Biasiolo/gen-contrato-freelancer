// src/components/PrintView.jsx
import React, { useRef, useMemo } from 'react';
import html2pdf from 'html2pdf.js';
import { useSelector, useDispatch } from 'react-redux';
import servicesCatalog from '../data/services.json';
import proposalInfo from '../data/proposalInfo.json';
import { resetProposal } from '../store/slices/proposalSlice';
import { ChevronLeft } from 'lucide-react';

export default function PrintView({ onBack }) {
  const dispatch = useDispatch();
  const printRef = useRef();
  const client = useSelector(s => s.proposal.client);
  const services = useSelector(s => s.proposal.services);
  const payment = useSelector(s => s.proposal.paymentConditions);
  const details = useSelector(s => s.proposal.details);

  // IDs & dates
  const proposalId = useMemo(() => crypto.randomUUID().split('-')[0], []);
  const today = useMemo(() => new Date().toLocaleDateString('pt-BR'), []);

  // subtotal & grouping
  const items = useMemo(
    () =>
      services.map(svc => {
        const term = svc.isMonthly ? svc.term || 1 : 1;
        const subtotal = svc.unitValue * svc.qty * term;
        return { ...svc, term, subtotal };
      }),
    [services]
  );
  const grouped = useMemo(
    () =>
      items.reduce((acc, it) => {
        acc[it.type] = acc[it.type] || [];
        acc[it.type].push(it);
        return acc;
      }, {}),
    [items]
  );
  const typeTotals = useMemo(() => {
    const tot = {};
    Object.entries(grouped).forEach(([k, list]) => {
      tot[k] = list.reduce((sum, i) => sum + i.subtotal, 0);
    });
    tot.overall = Object.values(tot).reduce((sum, v) => sum + v, 0);
    return tot;
  }, [grouped]);

  // cleanup artifacts
  const cleanup = () => {
    document
      .querySelectorAll('.html2pdf__page-container')
      .forEach(el => el.remove());
  };

  // PDF / print / share
  const handleDownloadPDF = () =>
    html2pdf()
      .set({
        margin: 1,
        filename: `${client.company || 'proposta'}-${proposalId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
      })
      .from(printRef.current)
      .save()
      .then(cleanup)
      .catch(console.error);

  const handlePrint = () => window.print();

  const handleShare = async () => {
    try {
      const blob = await html2pdf()
        .set({
          margin: 1,
          filename: `${client.company}-${proposalId}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
        })
        .from(printRef.current)
        .output('blob');
      const file = new File([blob], `${client.company}-${proposalId}.pdf`, { type: 'application/pdf' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Proposta Comercial' });
        return;
      }
    } catch (e) {
      console.error(e);
    }
    handleDownloadPDF();
  };

  const handleNew = () => {
    dispatch(resetProposal());
    window.location.reload();
  };

  // inline style objects
  const rootStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #000, #18181b, #000)',
    paddingTop: '6rem'
  };
  const wrapperStyle = {
    position: 'relative',
    maxWidth: '60rem',
    width: '100%',
    margin: '0 auto',
    padding: '1.5rem'
  };
  const printBoxStyle = {
    position: 'relative',
    backdropFilter: 'blur(4px)',
    backgroundColor: 'rgba(250, 250, 250, 1)',
    borderRadius: '1rem',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
    border: '1px solid rgba(255,255,255,0.2)',
    padding: '2.5rem',
    overflow: 'auto'
  };
  const controlsStyle = { display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' };
  const btnCommon = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    cursor: 'pointer',
    width: '10rem',
    padding: '0.5rem 0',
    color: '#fff',
    borderRadius: '1.5rem',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)'
  };

  const headerStyle = { width: '100%', textAlign: 'center', marginBottom: '2rem' };
  const titleStyle = { fontSize: '1.875rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' };
  const infoBarStyle = {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#374151',
    backgroundColor: '#F9FAFB',
    border: '1px solid #D1D5DB',
    borderRadius: '0.5rem',
    padding: '0.5rem 1rem',
    columnGap: '1rem',
    marginBottom: '0.5rem'
  };
  const infoBar2Style = {
    ...infoBarStyle,
    justifyContent: 'center',
    marginBottom: 0,

  };
  const sectionStyle = { marginBottom: '1.5rem' };
  const textJustify = { textAlign: 'justify', color: '#374151' };
  const h2Style = {
    fontSize: '1.5rem',
    textAlign: 'center',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '0.5rem',
    backgroundColor: '#14B8A6',
    borderTopLeftRadius: '1.5rem',
    borderTopRightRadius: '1.5rem',
    padding: '0.5rem'
  };
  const tableStyle = { width: '100%', borderCollapse: 'collapse', marginBottom: '0.5rem' };
  const thTdStyle = { border: '1px solid #D1D5DB', padding: '0.25rem 0.5rem' };
  const paymentBox = {
    backgroundColor: '#F3F4F6',
    padding: '0.5rem',
    paddingTop: 0,
    borderBottomLeftRadius: '1.5rem',
    borderBottomRightRadius: '1.5rem'
  };
  const payTitle = {
    fontSize: '1.125rem',
    fontWeight: 500,
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: '0.5rem'
  };
  const payRow = {
    display: 'flex',
    columnGap: '1.5rem',
    color: '#374151',
    marginBottom: '0.5rem',
    justifyContent: 'center'
  };
  const overallStyle = {
    textAlign: 'right',
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '1.5rem'
  };
  const detailsTitle = {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#1F2937',
    marginBottom: '0.5rem'
  };
  const listStyle = {
    listStyleType: 'disc',
    paddingInlineStart: '1rem',
    rowGap: '0.25rem',
    display: 'flex',
    flexDirection: 'column',
    color: '#374151',
    fontSize: '0.875rem'
  };

  return (
    <>
      <style>{`@media print { .no-print { display: none !important; } }`}</style>
      <div style={rootStyle}>
        <div style={wrapperStyle}>
          <div style={controlsStyle} className="no-print">

            <button
              onClick={onBack}
              style={{ ...btnCommon, backgroundColor: '#27272A' }}

            >
              Voltar
              <ChevronLeft size={18} style={{ marginLeft: '0.5rem', zIndex: 1 }} />
              <span className="overlay" />
            </button>
            <button
              onClick={handlePrint}
              style={{ ...btnCommon, backgroundColor: '#14B8A6' }}

            >
              Imprimir
              <span className="overlay" />
            </button>
            <button
              onClick={handleDownloadPDF}
              style={{ ...btnCommon, backgroundColor: '#14B8A6' }}

            >
              Baixar PDF
              <span className="overlay" />
            </button>
            <button
              onClick={handleShare}
              style={{ ...btnCommon, backgroundColor: '#14B8A6' }}

            >
              Compartilhar
              <span className="overlay" />
            </button>
            <button
              onClick={handleNew}
              style={{ ...btnCommon, backgroundColor: '#f97316' }}

            >
              Nova Proposta
              <span className="overlay" />
            </button>
          </div>

          <div ref={printRef} style={printBoxStyle}>
            {/* Header */}
            <div style={headerStyle}>
              <h1 style={titleStyle}>{proposalInfo.proposalHeader.title}</h1>
              <div style={infoBarStyle}>
              <span><strong>Cliente:</strong> {client.name}</span>
                <span><strong>Empresa:</strong> {client.company}</span>
                <span><strong>Email:</strong> {client.email}</span>
              </div>
              <div style={infoBar2Style}>
                <span style={{ borderRight: '1px solid #000', paddingRight: '8px' }}>
                  <strong>ID:</strong> {proposalId}
                </span>
                <span style={{ paddingInline: '8px', marginInline: '8px' }}><strong>Validade:</strong> {proposalInfo.proposalHeader.validity}</span>
                <span style={{ borderLeft: '1px solid #000', paddingLeft: '8px' }}><strong>Data:</strong> {today}</span>
              </div>
            </div>

            {/* Intro */}
            <div style={sectionStyle}>
              <p style={textJustify}>{proposalInfo.introduction}</p>
            </div>

            {/* Services */}
            {servicesCatalog.serviceTypes.map(type => {
              const list = grouped[type.id] || [];
              if (!list.length) return null;
              return (
                <div key={type.id} style={{ marginBottom: '2rem' }}>
                  <h2 style={h2Style}>
                    {type.name} – Pacote: R${' '}
                    {typeTotals[type.id].toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </h2>
                  <table style={tableStyle}>
                    <thead>
                      <tr style={{ backgroundColor: '#F3F4F6' }}>
                        {['Serviço', 'Qtd', 'Prazo', 'Valor Unit.', 'Subtotal'].map((th, i) => (
                          <th key={i} style={thTdStyle}>{th}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {list.map(item => (
                        <React.Fragment key={item.id}>
                          <tr>
                            <td style={thTdStyle}>{item.title}</td>
                            <td style={{ ...thTdStyle, textAlign: 'center' }}>{item.qty}</td>
                            <td style={{ ...thTdStyle, textAlign: 'center' }}>
                              {item.isMonthly ? `${item.term} meses` : 'Único'}
                            </td>
                            <td style={{ ...thTdStyle, textAlign: 'right' }}>
                              R${' '}{item.unitValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td style={{ ...thTdStyle, textAlign: 'right' }}>
                              R${' '}{item.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                          {item.description && (
                            <tr>
                              <td colSpan="5" style={{ ...thTdStyle, fontSize: '0.875rem', color: '#4B5563' }}>
                                {item.description}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                  <div style={paymentBox}>
                    <h3 style={payTitle}>Condições de Pagamento</h3>
                    <div style={payRow}>
                      <span><strong>Método:</strong> {payment[type.id]?.method || '-'}</span>
                      <span><strong>Entrada:</strong> {payment[type.id]?.entry || '-'}</span>
                      <span><strong>Parcelas:</strong> {payment[type.id]?.installments || '-'}</span>
                    </div>
                    {payment[type.id]?.notes && (
                      <p style={{ padding: 0, fontSize: '0.875rem', color: '#374151' }}>
                        <strong>Observações:</strong> {payment[type.id].notes}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Overall */}
            <div style={overallStyle}>
              Total Geral: R$ {typeTotals.overall.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>

            {/* Details */}
            <div style={sectionStyle}>
              <h2 style={detailsTitle}>Detalhes Adicionais</h2>
              <p style={{ color: '#374151' }}>{details}</p>
            </div>

            {/* Important */}
            <div style={sectionStyle}>
              <h2 style={detailsTitle}>Informações Importantes</h2>
              <ul style={listStyle}>
                {proposalInfo.importantInfo.map((info, i) => <li key={i}>{info}</li>)}
              </ul>
            </div>

            {/* Footer */}
            <div style={{
              borderTop: '1px solid #000',
              paddingTop: '1rem',
              fontSize: '0.75rem',
              marginTop: '2rem',
              textAlign: 'center'
            }}>
              <div><strong>{proposalInfo.company.name}</strong> – CNPJ {proposalInfo.company.cnpj}</div>
              <div>Email: {proposalInfo.company.email} | Tel: {proposalInfo.company.phone}</div>
              <div>
                {proposalInfo.company.address.street}, {proposalInfo.company.address.number} –{' '}
                {proposalInfo.company.address.neighborhood}, {proposalInfo.company.address.city} –{' '}
                {proposalInfo.company.address.state}, CEP {proposalInfo.company.address.cep}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
