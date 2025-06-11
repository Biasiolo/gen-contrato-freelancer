import { useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

/* ------- React-PDF configurado para Vite ------- */
import { Document, Page, pdfjs } from 'react-pdf';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';   // ⬅️ gera URL no bundle
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

/* ------- Geração do PDF e cálculos reutilizáveis ------- */
/* ------- Geração do PDF ------- */
import { generateProposalPDF } from '../pdf/generateProposalPDF';

/* ------- Helpers já usados em outras etapas ------- */
import {
  buildItems,
  groupByType,
  calcTypeTotals,
  calcParcelasAgrupadas,
} from '../utils/proposalCalc';

/* ------- catálogo (nomes dos pacotes) ------- */
import servicesCatalog from '../data/services.json';
import { resetProposal } from '../store/slices/proposalSlice';

export default function StepApresentacao({ onBack }) {
  const proposal = useSelector((s) => s.proposal);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [pdfUrl, setPdfUrl] = useState('');
  const [numPages, setNumPages] = useState(1);

  /* ---------- dados p/ PDF ---------- */
  const dataForPdf = useMemo(() => {
    const today = new Date().toLocaleDateString('pt-BR');
    const proposalId = crypto.randomUUID().split('-')[0];

    const items   = buildItems(proposal.services);
    const grouped = groupByType(items);
    const totals  = calcTypeTotals(grouped);
    const parcelasAgrupadas = calcParcelasAgrupadas(grouped, totals, proposal.paymentConditions);

    const packages = servicesCatalog.serviceTypes
      .map((type) => {
        const list = grouped[type.id] || [];
        if (!list.length) return null;

        const total   = totals[type.id] || 0;
        const cfg     = proposal.paymentConditions[type.id] || {};
        const entry   = parseMoney(cfg.entry);
        const parcelas = +cfg.installments || 0;
        const saldo    = total - entry;
        const parcela  = parcelas ? +(saldo / parcelas).toFixed(2) : 0;

        return {
          id: type.id,
          name: type.name,
          items: list,
          total,
          cond: { method: cfg.method || '-', entry, saldo, parcelas, parcela },
        };
      })
      .filter(Boolean);

    const entradaTotal = packages.reduce((s, p) => s + p.cond.entry, 0);
    const maxParcelas  = packages.reduce((m, p) => Math.max(m, p.cond.parcelas), 0);

    return {
      client: proposal.client,
      items,
      totals,
      parcelasAgrupadas,
      packages,
      entradaTotal,
      maxParcelas,
      proposalId,
      today,
    };
  }, [proposal]);

  /* ---------- gera PDF ---------- */
  useEffect(() => {
    let url;
    (async () => {
      const blob = await generateProposalPDF(dataForPdf);
      url = URL.createObjectURL(blob);
      setPdfUrl(url);
    })();
    return () => url && URL.revokeObjectURL(url);
  }, [dataForPdf]);

  /* ---------- handlers ---------- */
  const handleNew = () => {
    dispatch(resetProposal());
    navigate('/');
  };

  const handleDownload = () =>
    downloadPdf(pdfUrl, dataForPdf.client.company, dataForPdf.proposalId);

  /* ---------- UI ---------- */
  return (
    <section className="flex flex-col items-center px-4 py-8 min-h-screen">
      {pdfUrl && (
        <div className="w-full max-w-4xl h-[85vh] overflow-auto rounded shadow mx-auto">
          <Document file={pdfUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
            {Array.from({ length: numPages }).map((_, i) => (
              <Page
                key={i}
                pageNumber={i + 1}
                width={860}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            ))}
          </Document>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-5xl mt-4">
        <ButtonDark onClick={onBack}>◄ Voltar</ButtonDark>

        <ButtonGrad
          onClick={handleDownload}
          disabled={!pdfUrl}
          colors="from-teal-600 to-teal-600"
        >
          Baixar PDF
        </ButtonGrad>

        <ButtonGrad onClick={handleNew} colors="from-orange-500 to-orange-500">
          Nova Proposta
        </ButtonGrad>
      </div>
    </section>
  );
}

/* ---- Botões reutilizáveis ---- */
function ButtonGrad({ onClick, disabled, colors, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative flex-1 w-full sm:w-40 py-2 cursor-pointer overflow-hidden rounded-3xl bg-gradient-to-r ${colors} text-white shadow-lg transition-all hover:shadow-orange-500/25 disabled:cursor-not-allowed disabled:opacity-50`}
    >
      <span className="relative z-10 font-medium">{children}</span>
      <span className="absolute inset-0 h-full w-0 bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 ease-out group-hover:w-full" />
    </button>
  );
}

function ButtonDark({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex-1 w-full sm:w-40 py-2 cursor-pointer overflow-hidden rounded-3xl bg-neutral-800 text-white shadow-lg transition-all hover:shadow-neutral-700/25"
    >
      <span className="relative z-10 font-medium">{children}</span>
      <span className="absolute inset-y-0 right-0 w-0 h-full bg-gradient-to-l from-orange-500 to-orange-600 transition-all duration-300 ease-out group-hover:w-full" />
    </button>
  );
}

/* ---------- utils ---------- */
function parseMoney(str) {
  return parseFloat(String(str || '').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
}

function downloadPdf(url, clientName, id) {
  if (!url) return;

  const slug = clientName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  const a = document.createElement('a');
  a.href = url;
  a.download = `Proposta-${slug}-${id}.pdf`;
  a.click();
}