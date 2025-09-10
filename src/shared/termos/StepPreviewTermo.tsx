import { useMemo, useState } from "react";
import { PDFViewer, PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { resetTermoForm, goToTermoStep } from "@/store/termo";
import TermoDocument from "@/pdf/TermoDocument";

export default function StepPreviewTermo() {
  const form = useAppSelector((s) => s.termoForm);
  const dispatch = useAppDispatch();
  const [busy, setBusy] = useState(false);

  // mesmo padrão do contrato: criamos um "docNode" e um filename amigável
  const docNode = useMemo(() => <TermoDocument form={form} />, [form]);
  const filename = useMemo(() => {
    const who = (form.empNome || "colaborador").toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
    const kind = form.tipoTermo === "devolucao" ? "termo-devolucao" : "termo-recebimento";
    return `${kind}-${who || "documento"}.pdf`;
  }, [form.empNome, form.tipoTermo]);

  async function handlePrint() {
    try {
      setBusy(true);
      const blob = await pdf(docNode as any).toBlob();
      const url = URL.createObjectURL(blob);
      // abre numa nova aba para usar o diálogo padrão de impressão
      window.open(url, "_blank", "noopener,noreferrer");
      // dica: se quiser, revogue depois (ex.: num useEffect cleanup)
      // URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  function handleRestart() {
    dispatch(resetTermoForm());
    dispatch(goToTermoStep(0));
  }

  return (
    <div className="space-y-4">
      {/* Toolbar -- igual ao contrato */}
      <div className="flex flex-wrap gap-2 justify-end">
        <PDFDownloadLink document={docNode as any} fileName={filename}>
          {({ loading }) => (
            <button
              className="px-4 py-2 rounded bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-50 cursor-pointer"
              disabled={loading || busy}
            >
              {loading ? "Gerando PDF…" : "Baixar PDF"}
            </button>
          )}
        </PDFDownloadLink>

        <button
          onClick={handlePrint}
          disabled={busy}
          className="px-4 py-2 rounded border-none bg-amber-100 hover:bg-yellow-800 disabled:opacity-50 cursor-pointer"
        >
          {busy ? "Preparando…" : "Imprimir"}
        </button>

        <button
          onClick={handleRestart}
          className="px-4 py-2 rounded border-none bg-red-600 hover:bg-red-800 cursor-pointer text-white"
        >
          Reiniciar
        </button>
      </div>

      {/* PDF Viewer -- igual ao contrato (com showToolbar e altura) */}
      <div className="border rounded overflow-hidden" style={{ height: "80vh" }}>
        <PDFViewer width="100%" height="100%" showToolbar>
          {docNode as any}
        </PDFViewer>
      </div>

      <p className="text-xs text-gray-500">
        Dica: “Baixar PDF” salva o arquivo localmente. “Imprimir” abre em uma nova aba para escolher impressora/PDF.
      </p>
    </div>
  );
}
