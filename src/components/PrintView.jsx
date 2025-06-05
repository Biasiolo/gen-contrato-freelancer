import React, { useRef, useMemo } from 'react';
import html2pdf from 'html2pdf.js';
import { useSelector, useDispatch } from 'react-redux';
import servicesCatalog from '../data/services.json';
import proposalInfo from '../data/proposalInfo.json';
import { resetProposal } from '../store/slices/proposalSlice';
import { useNavigate } from 'react-router-dom';


export default function PrintView({ onBack }) {
  const dispatch = useDispatch();
  const printRef = useRef();
  const client = useSelector(s => s.proposal.client);
  const services = useSelector(s => s.proposal.services);
  const payment = useSelector(s => s.proposal.paymentConditions);
  const details = useSelector(s => s.proposal.details);

  const proposalId = useMemo(() => crypto.randomUUID().split('-')[0], []);
  const today = useMemo(() => new Date().toLocaleDateString('pt-BR'), []);

  const navigate = useNavigate();

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
      if (Math.abs(valorParcela - valorAtual) > 0.01 || numeroAtual !== numerosParcelas[i - 1] + 1) {
        grupos.push({
          de: inicio,
          ate: numerosParcelas[i - 1],
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



  // Configurações PDF comuns para reuso
  const getPdfOptions = () => ({
    margin: 0,
    filename: `${client.company || 'proposta'}-${proposalId}.pdf`,
    image: { type: 'jpeg', quality: 1 },
    html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        windowWidth: 1122,
    },
    jsPDF: {
        unit: 'px',
        format: [1122, 1587], // A4 retrato em px (96dpi → 29.7 x 21 cm)
        orientation: 'portrait',
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  });

  const handleDownloadPDF = () =>
    html2pdf()
      .set(getPdfOptions())
      .from(printRef.current)
      .save()
      .then(cleanup)
      .catch(console.error);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    try {
      // Tente primeiro o método de Web Share API com arquivo
      const blob = await html2pdf()
        .set(getPdfOptions())
        .from(printRef.current)
        .output('blob');

      const file = new File([blob], `${client.company || 'proposta'}-${proposalId}.pdf`, {
        type: 'application/pdf'
      });

      // Verifica se o navegador suporta compartilhamento de arquivos
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Proposta Comercial',
          text: `Proposta para ${client.company || client.name}`
        });
        return;
      }

      // Fallback 2: Em dispositivos móveis, tente criar URL temporária para compartilhar
      const fileURL = URL.createObjectURL(blob);

      // Tente compartilhar apenas a URL (funciona em mais navegadores)
      if (navigator.share) {
        await navigator.share({
          title: 'Proposta Comercial',
          text: `Proposta para ${client.company || client.name}`,
          url: fileURL
        });

        // Limpar URL após compartilhamento
        setTimeout(() => URL.revokeObjectURL(fileURL), 60000);
        return;
      }
    } catch (e) {
      console.error('Erro ao compartilhar:', e);
    }

    // Fallback final: baixar o PDF normalmente
    handleDownloadPDF();
  };

  const handleNew = () => {
  dispatch(resetProposal());
  navigate('/'); // Redireciona para a Landing
};
  



  const thTdStyle = {
    border: '1px solid #a1a1a1',
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
      {/* Estilos aprimorados para impressão */}
      <style>{`
        

  
        @media print {
  @page {
    size: 1122px 1587px; /* A4 em px */
    margin: 120px;
  }

  body {
    print-color-adjust: exact;
  }

  .no-print {
    display: none;
  }

  .print-page {
    page-break-after: always;
  }
    #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
            background: white !important;
            box-shadow: none !important;
          }
}


      `}</style>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #000, #18181b, #000)',
        padding: '3rem 0.5rem',
        minHeight: '100vh'
      }}>
        <div style={{ width: '100%', maxWidth: '60rem' }}>
          <div className="no-print print-controls" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap'
          }}>
            {[{
              label: 'Voltar',
              onClick: onBack,
              bg: '#27272A'
            }, {
              label: 'Imprimir',
              onClick: handlePrint,
              bg: '#0e7468'
            }, {
              label: 'Baixar PDF',
              onClick: handleDownloadPDF,
              bg: '#0e7468'
            }, {
              label: 'Compartilhar',
              onClick: handleShare,
              bg: '#0e7468'
            }, {
              label: 'Nova Proposta',
              onClick: handleNew,
              bg: '#f97316'
            }].map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                className="no-print"
                style={{
                  backgroundColor: btn.bg,
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  borderRadius: '1.5rem',
                  minWidth: '10rem',
                  cursor: 'pointer'
                }}>
                {btn.label}
              </button>
            ))}
          </div>

          <div ref={printRef} id="print-area" style={{
            background: '#fff',
            padding: '2rem'
          }}>
            <header
              className="page-break-avoid"
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

            <p style={{ textAlign: 'justify', color: '#374151', marginBottom: '1.5rem' }}>
              {proposalInfo.introduction}
            </p>
            <hr style={{ marginBottom: '1.5rem' }}></hr>

            {[...servicesCatalog.serviceTypes]
  .sort((a, b) => (typeTotals[b.id] || 0) - (typeTotals[a.id] || 0))
  .map(type => {
    const list = grouped[type.id] || [];
    if (!list.length) return null;

              const total = typeTotals[type.id] || 0;
              const entrada = parseFloat((payment[type.id]?.entry || '').toString().replace(/[^\d,]/g, '').replace(',', '.')) || 0;
              const parcelas = parseInt(payment[type.id]?.installments) || 0;
              const saldo = total - entrada;
              const valorParcela = parcelas > 0 ? saldo / parcelas : 0;

              return (
                <section key={type.id} className="page-break-avoid" style={{ marginBottom: '2rem' }}>
                  <h2 style={{
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: '1.25rem',
                    background: '#0e7468',
                    color: '#fff',
                    padding: '0.5rem',
                    borderRadius: '1rem 1rem 0 0'
                  }}>
                    {type.name} – Pacote: R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </h2>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
  <thead>
    <tr style={{ backgroundColor: '#F3F4F6' }}>
      {['Serviço', 'Qtd', 'Prazo', 'Valor Unit.', 'Subtotal'].map((th, i) => (
        <th
          key={i}
          style={{
            border: '1px solid #858585',
            padding: '0.75rem 1rem',
          }}
        >
          {th}
        </th>
      ))}
    </tr>
  </thead>
  <tbody>
    {list.map(item => (
      <React.Fragment key={item.id}>
        <tr>
          <td style={{ ...thTdStyle, padding: '0.75rem 1rem' }}>
            <strong>{item.title}</strong>
          </td>
          <td style={{ ...thTdStyle, textAlign: 'center', padding: '0.75rem 1rem' }}>{item.qty}</td>
          <td style={{ ...thTdStyle, textAlign: 'center', padding: '0.75rem 1rem' }}>{item.isMonthly ? `${item.term} mês(es)` : 'Único'}</td>
          <td style={{ ...thTdStyle, textAlign: 'right', padding: '0.75rem 1rem' }}>R$ {item.unitValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
          <td style={{ ...thTdStyle, textAlign: 'right', padding: '0.75rem 1rem' }}>R$ {item.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
        </tr>

        {item.description && (
          <tr>
            <td
              colSpan="5"
              style={{
                ...thTdStyle,
                fontSize: '0.875rem',
                color: '#4B5563',
                padding: '0.75rem 1rem',
                borderTop: 'none', // REMOVE a divisão com o item acima
              }}
            >
              {item.description}
            </td>
          </tr>
        )}
      </React.Fragment>
    ))}
  </tbody>
</table>
                  </div>
                  <div style={{
                    backgroundColor: '#e4e4e4',
                    borderRadius: '0 0 1rem 1rem',
                    padding: '0.5rem',
                    paddingBottom: '1rem'
                  }}>
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: 500,
                      color: '#1F2937',
                      textAlign: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      Condições de Pagamento
                    </h3>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '1.5rem',
                      color: '#374151',
                      flexWrap: 'wrap'
                    }}>
                      <span><strong>Método:</strong> {payment[type.id]?.method || '-'}</span>
                      <span><strong>Entrada:</strong> R$ {entrada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      <span>
                        <strong>Saldo:</strong> R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        {parcelas > 0 && (
                          <> em {parcelas}x de R$ {valorParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</>
                        )}
                      </span>
                    </div>
                    {payment[type.id]?.notes && (
                      <p style={{ fontSize: '0.875rem', color: '#374151', marginTop: '0.5rem' }}>
                        <strong>Observações:</strong> {payment[type.id].notes}
                      </p>
                    )}
                  </div>
                </section>
              );
            })}


            <div className="page-break-avoid" style={{
              textAlign: 'right',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: '#111827',
              marginBottom: '1.5rem'
            }}>
              Total Geral: R$ {typeTotals.overall.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>

            {parcelasAgrupadas.length > 0 && (
  <section className="page-break-avoid" style={{ marginBottom: '2rem' }}>
    <h2
      style={{
        fontSize: '1.25rem',
        fontWeight: 600,
        color: '#ffffff',
        backgroundColor: '#0e7468',
        padding: '0.5rem',
        textAlign: 'center',
        borderRadius: '1rem 1rem 0 0',
        marginBottom: '0',
      }}
    >
      Condições Gerais de Pagamento
    </h2>
    <div
      style={{
        backgroundColor: '#e4e4e4',

        borderTop: 'none',
        borderRadius: '0 0 1rem 1rem',
        padding: '1rem',
        fontSize: '0.9rem',
        color: '#374151',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      {parcelasAgrupadas.map((p, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.5rem 0.75rem',
            marginBottom: '0.5rem',
            borderRadius: '0.375rem',
            backgroundColor: '#F9FAFB',
            border: '1px solid #858585',
          }}
        >
          <span style={{ fontWeight: 500 }}>
            {p.de === p.ate
              ? `Parcela ${p.de}`
              : `Da ${p.de}ª à ${p.ate}ª parcela`}
          </span>
          <span style={{ fontWeight: 600, color: '#374151' }}>
            R$ {p.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      ))}
    </div>
  </section>
)}

            <section className="page-break-avoid" style={{ marginBottom: '1.5rem' }}>
              <h2 style={detailsTitle}>Detalhes Adicionais</h2>
              <p style={{ color: '#374151' }}>{details}</p>
            </section>

            <section className="page-break-avoid" style={{ marginBottom: '1.5rem' }}>
              <h2 style={detailsTitle}>Informações Importantes</h2>
              <ul style={listStyle}>
                {proposalInfo.importantInfo.map((info, i) => <li key={i}>{info}</li>)}
              </ul>
            </section>

            <footer className="page-break-avoid" style={{
              borderTop: '1px solid #000',
              paddingTop: '1rem',
              fontSize: '0.75rem',
              textAlign: 'center'
            }}>
              <div><strong>{proposalInfo.company.name}</strong> – CNPJ {proposalInfo.company.cnpj}</div>
              <div>Email: {proposalInfo.company.email} | Tel: {proposalInfo.company.phone}</div>
              <div>
                {proposalInfo.company.address.street}, {proposalInfo.company.address.number} –
                {proposalInfo.company.address.neighborhood}, {proposalInfo.company.address.city} –
                {proposalInfo.company.address.state}, CEP {proposalInfo.company.address.cep}
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}