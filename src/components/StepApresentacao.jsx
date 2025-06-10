import { useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

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

/* ------- Catálogo de serviços (p/ nomes dos pacotes) ------- */
import servicesCatalog from '../data/services.json';

export default function StepApresentacao({ onBack, onNext }) {
  const proposal = useSelector((s) => s.proposal);

  const [pdfUrl, setPdfUrl]   = useState('');
  const [numPages, setNumPages] = useState(1);

  /* ---------- Dados consolidados p/ o PDF ---------- */
  const dataForPdf = useMemo(() => {
    const today      = new Date().toLocaleDateString('pt-BR');
    const proposalId = crypto.randomUUID().split('-')[0];

    /* 1. cálculos de itens / totais iguais ao StepPreview */
    const items   = buildItems(proposal.services);
    const grouped = groupByType(items);
    const totals  = calcTypeTotals(grouped);
    const parcelasAgrupadas = calcParcelasAgrupadas(
      grouped,
      totals,
      proposal.paymentConditions
    );

    /* 2. gera array de pacotes no mesmo formato do Preview */
    const packages = servicesCatalog.serviceTypes
  .map((type) => {
    const list   = grouped[type.id] || [];
    if (!list.length) return null;                // ← ignora pacotes vazios

    const total  = totals[type.id] || 0;
    const payCfg = proposal.paymentConditions[type.id] || {};

    const entry    = parseMoney(payCfg.entry);
    const parcelas = +payCfg.installments || 0;
    const saldo    = total - entry;
    const valParc  = parcelas ? +(saldo / parcelas).toFixed(2) : 0;

    return {
      id: type.id,
      name: type.name,
      items: list,
      total,
      cond: {
        method: payCfg.method || '-',
        entry,
        saldo,
        parcelas,
        parcela: valParc,
      },
    };
  })
  .filter(Boolean);    

    return {
      client: proposal.client,
      items,
      totals,
      parcelasAgrupadas,
      packages,          // ← novo
      proposalId,
      today,
    };
  }, [proposal]);

  /* ---------- Gera Blob e URL quando os dados mudam ---------- */
  useEffect(() => {
    let localUrl;
    (async () => {
      const blob = await generateProposalPDF(dataForPdf);
      localUrl   = URL.createObjectURL(blob);
      setPdfUrl(localUrl);
    })();
    return () => { if (localUrl) URL.revokeObjectURL(localUrl); };
  }, [dataForPdf]);

  /* ---------- UI ---------- */
  return (
    <section className="flex flex-col items-center p-4 min-h-screen">
      {pdfUrl && (
        <div className="w-full max-w-5xl h-[85vh] overflow-auto rounded shadow">
          <Document
            file={pdfUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            {Array.from({ length: numPages }).map((_, i) => (
              <Page
                key={i}
                pageNumber={i + 1}
                width={800}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            ))}
          </Document>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-5xl mt-4">
        <button onClick={onBack} className="btn-dark flex-1">
          ◄ Voltar
        </button>

        <button
          onClick={() => downloadPdf(pdfUrl, dataForPdf.proposalId)}
          disabled={!pdfUrl}
          className="btn-primary flex-1 cursor-pointer rounded-3xl bg-gradient-to-r from-teal-600 to-teal-600 py-2 text-white shadow-lg transition-all hover:shadow-orange-500/25"
        >
          Baixar PDF
        </button>

        <button onClick={onNext} className="btn-primary flex-1">
          Avançar ►
        </button>
      </div>
    </section>
  );
}

/* ---------- util local ---------- */
function parseMoney(str) {
  return parseFloat(String(str || '').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
}

function downloadPdf(url, id) {
  if (!url) return;
  const a = document.createElement('a');
  a.href = url;
  a.download = `Proposta-${id}.pdf`;
  a.click();
}