// src/shared/contracts/StepServico.tsx
import { IMaskInput } from "react-imask";
import { patchForm } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import templates from "@/templates/index";

const SERVICE_OPTIONS = [
  { value: "web_designer", label: "Web Designer" },
  { value: "designer", label: "Designer Gráfico" },
  { value: "copywriter", label: "Copywriter" },
  { value: "rh", label: "Recursos Humanos" },
  { value: "assistente_adm", label: "Assistente Administrativo" },
  { value: "vendas", label: "Vendas / Comercial" },
  { value: "social_media", label: "Social Media" },
  { value: "trafego_pago", label: "Gestão de Tráfego Pago" },
  { value: "video", label: "Vídeo / Audiovisual" },
  { value: "custom", label: "Custom (em branco)" }
] as const;

export default function StepServico() {
  const form = useAppSelector((s) => s.form);
  const dispatch = useAppDispatch();

  // estilos alinhados aos outros steps (sem camadas extras)
  const card = "rounded-2xl p-5 md:p-6";
  const input =
    "border border-white/30 bg-white/90 focus:bg-white rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/50 transition";

  return (
    <div className="space-y-6">
      {/* ===== Tipo de Documento ===== */}
      <fieldset className={card}>
        <legend className="text-sm font-semibold text-white/90 mb-3">Tipo de Documento</legend>
        <div className="flex flex-wrap gap-3">
          <label
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/20 cursor-pointer ${
              form.tipoDocumento === "contrato" ? "bg-white/70" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            <input
              type="radio"
              className="accent-orange-500"
              checked={form.tipoDocumento === "contrato"}
              onChange={() => dispatch(patchForm({ tipoDocumento: "contrato" }))}
            />
            Contrato de Prestação de Serviços
          </label>

          <label
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/20 cursor-pointer ${
              form.tipoDocumento === "distrato" ? "bg-white/70" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            <input
              type="radio"
              className="accent-orange-500"
              checked={form.tipoDocumento === "distrato"}
              onChange={() =>
                dispatch(patchForm({ tipoDocumento: "distrato", servicoChave: undefined }))
              }
            />
            Termo de Distrato
          </label>
        </div>
      </fieldset>

      {form.tipoDocumento === "contrato" ? (
        <>
          {/* ===== Serviço (Contrato) ===== */}
          <fieldset className={card}>
            <legend className="text-sm font-semibold text-white/90 mb-3">Serviço</legend>
            <select
              className={`${input} w-full`}
              value={form.servicoChave || ""}
              onChange={(e) => dispatch(patchForm({ servicoChave: e.target.value as any }))}
            >
              <option value="" disabled>Selecione um serviço</option>
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </fieldset>

          {form.servicoChave && form.servicoChave !== "custom" && (
            <fieldset className={card}>
              <legend className="text-sm font-semibold text-white/90 mb-3">
                Escopo (padrão do serviço)
              </legend>
              <div className="rounded border border-white/30 bg-white/60 p-4">
                <ul className="list-disc pl-5 text-sm">
                  {(templates.servicos as any)[form.servicoChave]?.escopo?.map((i: string, idx: number) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>
              </div>
            </fieldset>
          )}

          {form.servicoChave === "custom" && (
            <fieldset className={card}>
              <legend className="text-sm font-semibold text-white/90 mb-3">
                Serviço Custom (em branco)
              </legend>

              <input
                className={`${input} w-full mb-3`}
                placeholder="Título do serviço"
                value={form.servicoCustomTitulo || ""}
                onChange={(e) => dispatch(patchForm({ servicoCustomTitulo: e.target.value }))}
              />

              <textarea
                className={`${input} w-full min-h-[120px] mb-3`}
                placeholder="Escopo (markdown ou texto livre)"
                value={form.servicoCustomEscopo || ""}
                onChange={(e) => dispatch(patchForm({ servicoCustomEscopo: e.target.value }))}
              />

              <textarea
                className={`${input} w-full min-h-[120px]`}
                placeholder="Cláusulas específicas (opcional)"
                value={form.servicoCustomClausulas || ""}
                onChange={(e) => dispatch(patchForm({ servicoCustomClausulas: e.target.value }))}
              />
            </fieldset>
          )}
        </>
      ) : (
        <>
          {/* ===== Serviço (Distrato) ===== */}
          <fieldset className={card}>
            <legend className="text-sm font-semibold text-white/90 mb-3">
              Serviço (para o Distrato)
            </legend>

            <select
              className={`${input} w-full`}
              value={form.servicoChave || ""}
              onChange={(e) => dispatch(patchForm({ servicoChave: e.target.value as any }))}
            >
              <option value="" disabled>Selecione um serviço</option>
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {form.servicoChave === "custom" && (
              <div className="mt-3">
                <input
                  className={`${input} w-full`}
                  placeholder="Título do serviço (ex.: Administrativo e Financeiro)"
                  value={form.servicoCustomTitulo || ""}
                  onChange={(e) => dispatch(patchForm({ servicoCustomTitulo: e.target.value }))}
                />
                <p className="text-xs text-white/80 mt-1">
                  Esse título preenche <code>&#123;&#123;SERVICO_TITULO&#125;&#125;</code> no texto do distrato.
                </p>
              </div>
            )}
          </fieldset>

          {/* ===== Campos do Distrato ===== */}
          <fieldset className={`${card} grid md:grid-cols-2 gap-3`}>
            <legend className="text-sm font-semibold text-white/90 mb-3">Distrato</legend>

            <input
              type="date"
              className={input}
              placeholder="Data do distrato"
              value={form.dataDistrato || ""}
              onChange={(e) => dispatch(patchForm({ dataDistrato: e.target.value }))}
            />

            {/* Valor do acerto (R$) com máscara */}
            <IMaskInput
              mask={Number}
              scale={2}
              thousandsSeparator="."
              radix=","
              mapToRadix={["."]}
              normalizeZeros
              padFractionalZeros
              prefix="R$ "
              unmask={true}
              value={(form.valorAcerto ?? "").toString()}
              onAccept={(val: string | number) => {
                const str = typeof val === "number" ? String(val).replace(".", ",") : (val ?? "");
                dispatch(patchForm({ valorAcerto: str }));
              }}
              className={input}
              placeholder="Valor do acerto (R$)"
              inputMode="decimal"
            />

            <input
              type="date"
              className={input}
              placeholder="Data do acerto final"
              value={form.dataAcerto || ""}
              onChange={(e) => dispatch(patchForm({ dataAcerto: e.target.value }))}
            />

            <input
              className={`${input} md:col-span-2`}
              placeholder="Prazo de devolução de materiais/acessos"
              value={form.prazoDevolucao || ""}
              onChange={(e) => dispatch(patchForm({ prazoDevolucao: e.target.value }))}
            />
          </fieldset>
        </>
      )}
    </div>
  );
}
