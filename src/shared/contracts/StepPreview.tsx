import React, { useMemo, useState } from "react";
import { PDFDownloadLink, PDFViewer, pdf } from "@react-pdf/renderer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { goToStep, resetForm } from "@/store";
import templates from "@/templates";
import ContractDocument from "@/pdf/ContractDocument";
import DistratoDocument from "@/pdf/DistratoDocument";
import { buildPlaceholderMap } from "@/pdf/buildMap";

export default function StepPreview() {
  const dispatch = useAppDispatch();
  const form = useAppSelector((s) => s.form);
  const [busy, setBusy] = useState(false);

  // ✅ resolve o serviço sempre que houver uma chave selecionada
  const service = useMemo(() => {
    if (!form.servicoChave) return undefined;
    return (templates.servicos as any)[form.servicoChave];
  }, [form.servicoChave]);

  // ✅ map inclui SERVICO_TITULO corretamente (contrato e distrato)
  const map = useMemo(() => buildPlaceholderMap(form, service), [form, service]);

  const docNode = useMemo(() => {
    if (form.tipoDocumento === "distrato") {
      return <DistratoDocument form={form} templates={templates as any} map={map} />;
    }
    return <ContractDocument form={form} templates={templates as any} service={service} map={map} />;
  }, [form, service, map]);

  const filename =
    form.tipoDocumento === "distrato"
      ? `distrato-${(form.prestadorNome || "colaborador").replace(/\s+/g, "-").toLowerCase()}.pdf`
      : `contrato-${(form.prestadorNome || "colaborador").replace(/\s+/g, "-").toLowerCase()}.pdf`;

  async function handlePrint() {
    try {
      setBusy(true);
      // garantir que estamos passando um <Document />
      const blob = await pdf(docNode as any).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      setBusy(false);
    }
  }

  function handleRestart() {
    dispatch(resetForm());
    dispatch(goToStep(0));
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 justify-end">
        <PDFDownloadLink document={docNode as any} fileName={filename}>
          {({ loading }) => (
            <button
              className="px-4 py-2 rounded bg-black text-white hover:opacity-90 disabled:opacity-50"
              disabled={loading || busy}
            >
              {loading ? "Gerando PDF…" : "Baixar PDF"}
            </button>
          )}
        </PDFDownloadLink>

        <button
          onClick={handlePrint}
          disabled={busy}
          className="px-4 py-2 rounded border bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          {busy ? "Preparando…" : "Imprimir"}
        </button>

        <button
          onClick={handleRestart}
          className="px-4 py-2 rounded border bg-white hover:bg-gray-50"
        >
          Reiniciar
        </button>
      </div>

      {/* PDF Viewer */}
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
