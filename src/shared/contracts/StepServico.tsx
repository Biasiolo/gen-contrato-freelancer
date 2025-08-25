// src/shared/contracts/StepServico.tsx
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

  return (
    <div className="space-y-6">
      <fieldset className="border p-3 rounded">
        <legend className="text-sm font-medium">Tipo de Documento</legend>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={form.tipoDocumento === "contrato"}
              onChange={() => dispatch(patchForm({ tipoDocumento: "contrato" }))}
            />
            Contrato de Prestação de Serviços
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
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
          {/* ====== SERVIÇO (CONTRATO) ====== */}
          <fieldset className="border p-3 rounded">
            <legend className="text-sm font-medium">Serviço</legend>
            <select
              className="border p-2 rounded"
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
            <fieldset className="border p-3 rounded">
              <legend className="text-sm font-medium">Escopo (padrão do serviço)</legend>
              <ul className="list-disc pl-5 text-sm">
                {(templates.servicos as any)[form.servicoChave]?.escopo?.map((i: string, idx: number) => (
                  <li key={idx}>{i}</li>
                ))}
              </ul>
            </fieldset>
          )}

          {form.servicoChave === "custom" && (
            <fieldset className="border p-3 rounded space-y-3">
              <legend className="text-sm font-medium">Serviço Custom (em branco)</legend>
              <input
                className="border p-2 rounded w-full"
                placeholder="Título do serviço"
                value={form.servicoCustomTitulo || ""}
                onChange={(e) => dispatch(patchForm({ servicoCustomTitulo: e.target.value }))}
              />
              <textarea
                className="border p-2 rounded w-full min-h-[120px]"
                placeholder="Escopo (markdown ou texto livre)"
                value={form.servicoCustomEscopo || ""}
                onChange={(e) => dispatch(patchForm({ servicoCustomEscopo: e.target.value }))}
              />
              <textarea
                className="border p-2 rounded w-full min-h-[120px]"
                placeholder="Cláusulas específicas (opcional)"
                value={form.servicoCustomClausulas || ""}
                onChange={(e) => dispatch(patchForm({ servicoCustomClausulas: e.target.value }))}
              />
            </fieldset>
          )}
        </>
      ) : (
        <>
          {/* ====== SERVIÇO (DISTRATO) ====== */}
          <fieldset className="border p-3 rounded">
            <legend className="text-sm font-medium">Serviço (para o Distrato)</legend>
            <select
              className="border p-2 rounded"
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
                  className="border p-2 rounded w-full"
                  placeholder="Título do serviço (ex.: Administrativo e Financeiro)"
                  value={form.servicoCustomTitulo || ""}
                  onChange={(e) => dispatch(patchForm({ servicoCustomTitulo: e.target.value }))}
                />
                <p className="text-xs text-gray-500 mt-1">
  Esse título preenche <code>&#123;&#123;SERVICO_TITULO&#125;&#125;</code> no texto do distrato.
</p>
              </div>
            )}
          </fieldset>

          {/* ====== CAMPOS DO DISTRATO ====== */}
          <fieldset className="border p-3 rounded grid md:grid-cols-2 gap-3">
            <legend className="text-sm font-medium">Distrato</legend>

            <input
              type="date"
              className="border p-2 rounded"
              placeholder="Data do distrato"
              value={form.dataDistrato || ""}
              onChange={(e) => dispatch(patchForm({ dataDistrato: e.target.value }))}
            />

            <input
              className="border p-2 rounded"
              placeholder="Valor do acerto (R$)"
              value={(form.valorAcerto as any) || ""}
              onChange={(e) => dispatch(patchForm({ valorAcerto: e.target.value }))}
            />

            <input
              type="date"
              className="border p-2 rounded"
              placeholder="Data do acerto final"
              value={form.dataAcerto || ""}
              onChange={(e) => dispatch(patchForm({ dataAcerto: e.target.value }))}
            />

            <input
              className="border p-2 rounded md:col-span-2"
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
