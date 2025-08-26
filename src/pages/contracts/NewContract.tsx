// src/pages/contracts/NewContract.tsx
import StepPartes from "@/shared/contracts/StepPartes";
import StepParametros from "@/shared/contracts/StepParametros";
import StepServico from "@/shared/contracts/StepServico";
import StepPreview from "@/shared/contracts/StepPreview";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { next, prev } from "@/store";

export default function NewContract() {
  const step = useAppSelector((s) => s.ui.step);
  const dispatch = useAppDispatch();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-100">Novo Documento</h1>
        <p className="text-sm text-gray-100">Contrato / Distrato — Gerador de PDFs</p>
      </header>

      <ol className="flex items-center justify-between text-xs text-gray-200">
        {["Partes", "Parâmetros", "Serviço / Distrato", "Prévia"].map((label, i) => (
          <li key={label} className={`flex-1 text-center ${step === i ? "font-bold text-orange-500" : ""}`}>
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      <section className="border rounded-lg p-4 bg-white">
        {step === 0 && <StepPartes />}
        {step === 1 && <StepParametros />}
        {step === 2 && <StepServico />}
        {step === 3 && <StepPreview />}
      </section>

      <footer className="flex justify-between">
        <button onClick={() => dispatch(prev())} className="px-4 py-2 rounded border bg-white hover:bg-gray-50">
          Voltar
        </button>
        <button onClick={() => dispatch(next())} className="px-4 py-2 rounded bg-orange-500 text-white hover:opacity-90">
          Avançar
        </button>
      </footer>
    </div>
  );
}
