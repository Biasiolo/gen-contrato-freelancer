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
    "w-full min-w-0 border border-white/30 bg-white/90 focus:bg-white rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/50 transition";
  const textArea =
    "w-full min-w-0 border border-white/30 bg-white/90 focus:bg-white rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/50 transition min-h-[120px]";

  // serviço selecionado
  const selected: any = form.servicoChave
    ? (templates.servicos as any)[form.servicoChave]
    : null;

  const hasSections = Array.isArray(selected?.escopoSecoes) && selected.escopoSecoes.length > 0;
  const hasSimpleScope = Array.isArray(selected?.escopo) && selected.escopo.length > 0;

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
              className={input}
              value={form.servicoChave || ""}
              onChange={(e) => dispatch(patchForm({ servicoChave: e.target.value as any }))}
            >
              <option value="" disabled>Selecione um serviço</option>
              {SERVICE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </fieldset>

          {/* ===== Escopo (com seções numeradas se existir) ===== */}
          {form.servicoChave && form.servicoChave !== "custom" && (hasSections || hasSimpleScope) && (
            <fieldset className={card}>
              <legend className="text-sm font-semibold text-white/90 mb-3">
                Escopo (padrão do serviço)
              </legend>

              {hasSections ? (
                <div className="space-y-4 rounded border border-white/30 bg-white/60 p-4 break-words leading-relaxed">
                  {selected.escopoSecoes.map(
                    (sec: { titulo: string; itens: string[] }, idx: number) => (
                      <div key={idx}>
                        <div className="font-semibold mb-1">
                          {idx + 1} {sec.titulo}
                        </div>
                        <ul className="list-disc pl-5 text-sm">
                          {sec.itens?.map((it: string, i: number) => (
                            <li key={i} className="break-words">{it}</li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </div>
              ) : (
                // Fallback: lista simples
                <div className="rounded border border-white/30 bg-white/60 p-4 break-words leading-relaxed">
                  <ul className="list-disc pl-5 text-sm">
                    {selected.escopo.map((i: string, idx: number) => (
                      <li key={idx} className="break-words">{i}</li>
                    ))}
                  </ul>
                </div>
              )}
            </fieldset>
          )}

          {/* ===== Serviço Custom ===== */}
          {form.servicoChave === "custom" && (
            <fieldset className={card}>
              <legend className="text-sm font-semibold text-white/90 mb-3">
                Serviço Custom (em branco)
              </legend>

              <input
                className={`${input} mb-3`}
                placeholder="Título do serviço"
                value={form.servicoCustomTitulo || ""}
                onChange={(e) => dispatch(patchForm({ servicoCustomTitulo: e.target.value }))}
              />

              <textarea
                className={`${textArea} mb-3`}
                placeholder="Escopo (markdown ou texto livre)"
                value={form.servicoCustomEscopo || ""}
                onChange={(e) => dispatch(patchForm({ servicoCustomEscopo: e.target.value }))}
              />

              <textarea
                className={textArea}
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
              className={input}
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
                  className={input}
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
          <fieldset className={card}>
            <legend className="text-sm font-semibold text-white/90 mb-3">Distrato</legend>

            <div className="grid md:grid-cols-2 gap-3">
              {/* Data do contrato original (DATA_DISTRATO) */}
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-white/90">Data do contrato original</span>
                <input
                  type="date"
                  className={input}
                  value={form.dataDistrato || ""}
                  onChange={(e) => dispatch(patchForm({ dataDistrato: e.target.value }))}
                />
              </label>

              {/* Valor do acerto (R$) */}
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-white/90">Valor do acerto (R$)</span>
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
                  inputMode="decimal"
                />
              </label>

              {/* Data de pagamento (DATA_ACERTO) */}
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-white/90">Data de pagamento</span>
                <input
                  type="date"
                  className={input}
                  value={form.dataAcerto || ""}
                  onChange={(e) => dispatch(patchForm({ dataAcerto: e.target.value }))}
                />
              </label>

              {/* Prazo de devolução */}
              <label className="md:col-span-2 flex flex-col gap-1">
                <span className="text-xs font-medium text-white/90">Prazo de devolução de materiais/acessos</span>
                <input
                  className={input}
                  value={form.prazoDevolucao || ""}
                  onChange={(e) => dispatch(patchForm({ prazoDevolucao: e.target.value }))}
                  placeholder="Ex.: até 5 dias úteis"
                />
              </label>
            </div>
          </fieldset>
        </>
      )}
    </div>
  );
}
