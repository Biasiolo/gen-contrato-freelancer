// src/pages/contracts/NewContract.tsx
import StepPartes from "@/shared/contracts/StepPartes";
import StepParametros from "@/shared/contracts/StepParametros";
import StepServico from "@/shared/contracts/StepServico";
import StepPreview from "@/shared/contracts/StepPreview";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { next, prev, goToStep, resetForm } from "@/store";
import voiaLogo from "@/assets/logo-header.png";
import { Link } from "react-router-dom";

export default function NewContract() {
  const step = useAppSelector((s) => s.ui.step);
  const dispatch = useAppDispatch();

  const labels = ["Partes", "Parâmetros", "Serviço / Distrato", "Prévia"];
  const isFirst = step === 0;
  const isLast = step === labels.length - 1; // 3
  const progress = (step / (labels.length - 1)) * 100;

  function handleRestart() {
    dispatch(resetForm());
    dispatch(goToStep(0));
  }

  return (
    <>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={voiaLogo} alt="Voia" className="h-8 w-auto select-none" draggable={false} />
          </div>
          <span className="text-[11px] text-white/60">Contrato • Distrato</span>
          <Link
        to="/"
        className="text-xs px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
      >
        ← Início
      </Link>
        </div>
      </nav>

      {/* CONTEÚDO */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-100">Gerar Novo Documento</h1>
          <p className="text-sm text-gray-100">Contrato / Distrato — Gerador de PDFs</p>
        </header>

        {/* STEPPER */}
        <ol className="relative z-10 grid grid-cols-4 gap-2">
          {labels.map((label, i) => {
            const isCompleted = i < step;
            const isActive = i === step;
            return (
              <li key={label} className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => dispatch(goToStep(i))}
                  className="group flex flex-col items-center gap-2 focus:outline-none cursor-pointer"
                  aria-current={isActive ? "step" : undefined}
                >
                  <span
                    className={[
                      "h-10 w-10 flex items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300 shadow-sm",
                      isActive
                        ? "bg-orange-500 border-orange-500 text-white scale-105 shadow-lg"
                        : isCompleted
                          ? "bg-teal-600 border-teal-500 text-white"
                          : "bg-white border-gray-200 text-gray-600",
                    ].join(" ")}
                  >
                    {isCompleted ? (
                      <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden>
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-7.02 7.02a1 1 0 01-1.414 0L3.293 8.747a1 1 0 011.414-1.414l3.15 3.15 6.313-6.313a1 1 0 011.537.123z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span
                    className={[
                      "text-[11px] tracking-wide transition-colors text-center",
                      isActive ? "text-orange-400" : isCompleted ? "text-teal-600" : "text-gray-200",
                    ].join(" ")}
                  >
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {/* BARRA DE PROGRESSO + REINICIAR */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 h-2 rounded-full bg-white/20 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"
              style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
            />
          </div>

          <button
            onClick={handleRestart}
            className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 cursor-pointer text-white text-xs md:text-sm"
            title="Limpar todos os dados e voltar para o início"
          >
            Reiniciar
          </button>
        </div>

        {/* CONTEÚDO DAS ETAPAS */}
        <section className="relative rounded-2xl p-6 md:p-8 bg-white/10 backdrop-blur-xl backdrop-saturate-150 border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-white/10 to-transparent opacity-70" />
          <div className="pointer-events-none absolute -inset-px rounded-2xl ring-1 ring-white/10" />
          <div className="relative z-10">
            {step === 0 && <StepPartes />}
            {step === 1 && <StepParametros />}
            {step === 2 && <StepServico />}
            {step === 3 && <StepPreview />}
          </div>
        </section>

        {/* NAVEGAÇÃO */}
        <footer className="flex justify-between">
          <button
            onClick={() => dispatch(prev())}
            disabled={isFirst}
            className="px-4 py-2 rounded border bg-white hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
          >
            Voltar
          </button>

          {!isLast && (
            <button
              onClick={() => dispatch(next())}
              className="px-4 py-2 rounded bg-orange-500 text-white hover:opacity-90 cursor-pointer"
            >
              Avançar
            </button>
          )}
        </footer>
      </div>
    </>
  );
}
