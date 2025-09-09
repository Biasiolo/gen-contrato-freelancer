import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import TermoDocument from "@/pdf/TermoDocument";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { resetTermoForm, goToTermoStep } from "@/store/termo";

export default function StepPreviewTermo() {
  const form = useAppSelector(s => s.termoForm);
  const dispatch = useAppDispatch();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <PDFDownloadLink document={<TermoDocument form={form} />} fileName="termo.pdf">
          {({ loading }) => (
            <button className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
              {loading ? "Gerando..." : "Baixar PDF"}
            </button>
          )}
        </PDFDownloadLink>

        <button
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          onClick={() => { dispatch(resetTermoForm()); dispatch(goToTermoStep(0)); }}
        >
          Reiniciar
        </button>
      </div>

      <div className="h-[70vh] border rounded overflow-hidden bg-white">
        <PDFViewer width="100%" height="100%">
          <TermoDocument form={form} />
        </PDFViewer>
      </div>
    </div>
  );
}
