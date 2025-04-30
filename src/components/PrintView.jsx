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

  const proposalId = useMemo(() => crypto.randomUUID().split('-')[0], []);
  const today = useMemo(() => new Date().toLocaleDateString('pt-BR'), []);

  const items = useMemo(() =>
    services.map(svc => {
      const term = svc.isMonthly ? svc.term || 1 : 1;
      const subtotal = svc.unitValue * svc.qty * term;
      return { ...svc, term, subtotal };
    }),
    [services]
  );

  const grouped = useMemo(() =>
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

  const cleanup = () => {
    document.querySelectorAll('.html2pdf__page-container').forEach(el => el.remove());
  };

  const handleDownloadPDF = () =>
    html2pdf()
      .set({
        margin: [1.5, 0],
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
          margin: [1.5, 0],
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

  const thTdStyle = {
    border: '1px solid #D1D5DB',
    padding: '0.25rem 0.5rem',
    fontSize: '0.875rem',
    color: '#374151',
  };

  const detailsTitle = {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#1F2937',
    marginBottom: '0.5rem',
    textAlign: 'center',
  };

  const listStyle = {
    listStyleType: 'disc',
    paddingInlineStart: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    color: '#374151',
    fontSize: '0.875rem',
  };

  return (
    <>
      <style>{`
        @media print { .no-print { display: none !important; } }
        @media (max-width: 640px) {
          .print-controls { flex-direction: column; gap: 0.5rem; }
          .print-btn { width: 100% !important; }
        }
      `}</style>
      <div style={{ display: 'flex', justifyContent: 'center', background: 'linear-gradient(to bottom right, #000, #18181b, #000)', padding: '3rem 0.5rem', minHeight: '100vh' }}>
        <div style={{ width: '100%', maxWidth: '60rem' }}>
          <div className="no-print print-controls" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {[{
              label: 'Voltar',
              onClick: onBack,
              bg: '#27272A'
            }, {
              label: 'Imprimir',
              onClick: handlePrint,
              bg: '#14B8A6'
            }, {
              label: 'Baixar PDF',
              onClick: handleDownloadPDF,
              bg: '#14B8A6'
            }, {
              label: 'Compartilhar',
              onClick: handleShare,
              bg: '#14B8A6'
            }, {
              label: 'Nova Proposta',
              onClick: handleNew,
              bg: '#f97316'
            }].map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                className="print-btn"
                style={{ backgroundColor: btn.bg, color: '#fff', padding: '0.5rem 1rem', borderRadius: '1.5rem', minWidth: '10rem', cursor: 'pointer' }}>
                {btn.label}
              </button>
            ))}
          </div>

          <div ref={printRef} style={{ background: '#fff', borderRadius: '1rem', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
          <header
  style={{
    marginBottom: '1.5rem',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1.5rem',
  }}
>
  {/* Logo à esquerda */}
  <div style={{ flex: '0 0 auto' }}>
    <img
      src="/logo.png"
      alt="Logo"
      style={{
        maxHeight: '128px',
        objectFit: 'contain',
        display: 'block',
      }}
    />
  </div>

  {/* Informações à direita */}
  <div style={{ flex: '1 1 0', minWidth: '250px', textAlign: 'right' }}>
    <h1
      style={{
        fontSize: '1.875rem',
        fontWeight: 700,
        color: '#111827',
        marginBottom: '0.5rem',
      }}
    >
      {proposalInfo.proposalHeader.title}
    </h1>
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        color: '#374151',
        marginBottom: '0.5rem',
        justifyContent: 'flex-end',
      }}
    >
      <span>
        <strong>Cliente:</strong> {client.name}
      </span>
      <span>
        <strong>Empresa:</strong> {client.company}
      </span>
      <span>
        <strong>Email:</strong> {client.email}
      </span>
    </div>
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        color: '#374151',
        justifyContent: 'flex-end',
      }}
    >
      <span>
        <strong>ID:</strong> {proposalId}
      </span>
      <span>
        <strong>Validade:</strong> {proposalInfo.proposalHeader.validity}
      </span>
      <span>
        <strong>Data:</strong> {today}
      </span>
    </div>
  </div>
</header>
<hr style={{ marginBottom: '1.5rem' }}></hr>


            <p style={{ textAlign: 'justify', color: '#374151', marginBottom: '1.5rem' }}>{proposalInfo.introduction}</p>

            {servicesCatalog.serviceTypes.map(type => {
              const list = grouped[type.id] || [];
              if (!list.length) return null;
              return (
                <section key={type.id} style={{ marginBottom: '2rem', pageBreakInside: 'avoid' }}>
                  <h2 style={{ textAlign: 'center', fontWeight: 600, fontSize: '1.25rem', background: '#14B8A6', color: '#fff', padding: '0.5rem', borderRadius: '1rem 1rem 0 0' }}>
                    {type.name} – Pacote: R$ {typeTotals[type.id].toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </h2>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#F3F4F6' }}>
                          {['Serviço', 'Qtd', 'Prazo', 'Valor Unit.', 'Subtotal'].map((th, i) => (
                            <th key={i} style={{ border: '1px solid #D1D5DB', padding: '0.25rem 0.5rem' }}>{th}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {list.map(item => (
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
                                <td colSpan="5" style={{ ...thTdStyle, fontSize: '0.875rem', color: '#4B5563' }}>{item.description}</td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ backgroundColor: '#F3F4F6', borderRadius: '0 0 1rem 1rem', padding: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: '#1F2937', textAlign: 'center', marginBottom: '0.5rem' }}>Condições de Pagamento</h3>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', color: '#374151' }}>
                      <span><strong>Método:</strong> {payment[type.id]?.method || '-'}</span>
                      <span><strong>Entrada:</strong> {payment[type.id]?.entry || '-'}</span>
                      <span><strong>Parcelas:</strong> {payment[type.id]?.installments || '-'}</span>
                    </div>
                    {payment[type.id]?.notes && (
                      <p style={{ fontSize: '0.875rem', color: '#374151', marginTop: '0.5rem' }}><strong>Observações:</strong> {payment[type.id].notes}</p>
                    )}
                  </div>
                </section>
              );
            })}

            <div style={{ textAlign: 'right', fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>
              Total Geral: R$ {typeTotals.overall.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>

            <section style={{ marginBottom: '1.5rem' }}>
              <h2 style={detailsTitle}>Detalhes Adicionais</h2>
              <p style={{ color: '#374151' }}>{details}</p>
            </section>

            <section style={{ marginBottom: '1.5rem' }}>
              <h2 style={detailsTitle}>Informações Importantes</h2>
              <ul style={listStyle}>
                {proposalInfo.importantInfo.map((info, i) => <li key={i}>{info}</li>)}
              </ul>
            </section>

            <footer style={{ borderTop: '1px solid #000', paddingTop: '1rem', fontSize: '0.75rem', textAlign: 'center' }}>
              <div><strong>{proposalInfo.company.name}</strong> – CNPJ {proposalInfo.company.cnpj}</div>
              <div>Email: {proposalInfo.company.email} | Tel: {proposalInfo.company.phone}</div>
              <div>{proposalInfo.company.address.street}, {proposalInfo.company.address.number} – {proposalInfo.company.address.neighborhood}, {proposalInfo.company.address.city} – {proposalInfo.company.address.state}, CEP {proposalInfo.company.address.cep}</div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
