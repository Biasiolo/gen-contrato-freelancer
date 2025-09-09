// src/pages/Home.tsx
import { Link } from "react-router-dom";
import voiaLogo from "@/assets/logo-header.png";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      {/* topo */}
      <header className="flex items-center justify-between">
        <img src={voiaLogo} alt="Voia" className="h-10 w-auto" />
        <span className="text-xs text-white/70 tracking-wide">
          Documentos: Contratos • Distratos • Termos
        </span>
      </header>

      {/* título */}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold text-white">O que você quer gerar?</h1>
        <p className="text-white/80">Escolha um fluxo abaixo.</p>
      </div>

      {/* cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contratos */}
        <Link
          to="/contratos"
          className="group relative rounded-2xl p-6 md:p-8 bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:bg-white/20 transition"
        >
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-white/10 to-transparent opacity-60" />
          <h2 className="relative z-10 text-xl font-semibold text-white mb-2">
            Contrato / Distrato
          </h2>
          <p className="relative z-10 text-white/80 text-sm">
            Gerar contratos de prestação de serviços, distratos e PDFs assináveis.
          </p>
          <div className="relative z-10 mt-4 inline-flex items-center gap-2 text-orange-300 text-sm">
            Ir para o fluxo
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M10.293 3.293a1 1 0 011.414 0l5 5a.997.997 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 10 10.293 6.707a1 1 0 010-1.414z" />
            </svg>
          </div>
        </Link>

        {/* Termos */}
        <Link
          to="/termos"
          className="group relative rounded-2xl p-6 md:p-8 bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:bg-white/20 transition"
        >
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 via-white/10 to-transparent opacity-60" />
          <h2 className="relative z-10 text-xl font-semibold text-white mb-2">
            Termos (Recebimento / Devolução)
          </h2>
          <p className="relative z-10 text-white/80 text-sm">
            Gerar termos de responsabilidade e de devolução de equipamentos e acessórios.
          </p>
          <div className="relative z-10 mt-4 inline-flex items-center gap-2 text-orange-300 text-sm">
            Ir para o fluxo
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M10.293 3.293a1 1 0 011.414 0l5 5a.997.997 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 10 10.293 6.707a1 1 0 010-1.414z" />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
}
