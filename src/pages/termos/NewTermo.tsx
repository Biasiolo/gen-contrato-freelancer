import StepPartesTermo from "@/shared/termos/StepPartesTermo";
import StepParametrosTermo from "@/shared/termos/StepParametrosTermo";
import StepPreviewTermo from "@/shared/termos/StepPreviewTermo";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { nextTermo, prevTermo, goToTermoStep } from "@/store/termo";

export default function NewTermo() {
  const step = useAppSelector(s => s.termoUI.step);
  const dispatch = useAppDispatch();

  const labels = ["Partes", "Parâmetros", "Prévia"];
  const isFirst = step === 0;
  const isLast = step === labels.length - 1;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-gray-100">Novo Termo</h1>
        <p className="text-sm text-gray-100">Recebimento / Devolução</p>
      </header>

      <ol className="relative z-10 grid grid-cols-3 gap-2">
        {labels.map((label, i) => {
          const isCompleted = i < step;
          const isActive = i === step;
          return (
            <li key={label} className="flex flex-col items-center gap-2">
              <button onClick={() => dispatch(goToTermoStep(i))} className="group flex flex-col items-center gap-2">
                <span className={[
                  "h-10 w-10 flex items-center justify-center rounded-full border text-sm font-semibold transition-all",
                  isActive ? "bg-orange-500 border-orange-500 text-white scale-105" :
                  isCompleted ? "bg-teal-600 border-teal-500 text-white" :
                  "bg-white border-gray-200 text-gray-600"
                ].join(" ")}>{isCompleted ? "✓" : i + 1}</span>
                <span className={[
                  "text-[11px] tracking-wide",
                  isActive ? "text-orange-400" : isCompleted ? "text-teal-600" : "text-gray-200"
                ].join(" ")}>{label}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <section className="relative rounded-2xl p-6 md:p-8 bg-white/10 backdrop-blur-xl backdrop-saturate-150 border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-white/10 to-transparent opacity-70" />
        <div className="pointer-events-none absolute -inset-px rounded-2xl ring-1 ring-white/10" />

        <div className="relative z-10">
          {step === 0 && <StepPartesTermo />}
          {step === 1 && <StepParametrosTermo />}
          {step === 2 && <StepPreviewTermo />}
        </div>
      </section>

      <footer className="flex justify-between">
        <button onClick={() => dispatch(prevTermo())} disabled={isFirst} className="px-4 py-2 rounded border bg-white hover:bg-gray-50 disabled:opacity-50">
          Voltar
        </button>
        {!isLast && (
          <button onClick={() => dispatch(nextTermo())} className="px-4 py-2 rounded bg-orange-500 text-white hover:opacity-90">
            Avançar
          </button>
        )}
      </footer>
    </div>
  );
}
