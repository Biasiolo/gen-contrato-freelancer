// src/shared/termos/StepParametrosTermo.tsx
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { patchTermoForm } from "@/store/termo";
import type { EquipItem, EquipKind } from "@/types/termos";

const EQUIP_OPTIONS: { value: EquipKind; label: string }[] = [
  { value: "notebook", label: "Notebook" },
  { value: "celular",  label: "Celular/Smartphone" },
  { value: "fone",     label: "Fone de ouvido" },
  { value: "mouse",    label: "Mouse" },
  { value: "uniforme", label: "Uniforme" },
  { value: "tag",      label: "Tag/Cartão" },
  { value: "outro",    label: "Outro (especifique)" },
];

export default function StepParametrosTermo() {
  const f = useAppSelector((s) => s.termoForm);
  const d = useAppDispatch();

  const input =
    "w-full min-w-0 border border-white/30 bg-white/90 focus:bg-white rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/50 transition";
  const card = "rounded-2xl p-5 md:p-6";

  // Migração automática (campos antigos -> items[]) apenas uma vez
  useEffect(() => {
    if (!f.items || f.items.length === 0) {
      const legacyHasData =
        f.equipTipo || f.itemMarca || f.itemModelo || f.itemCor || f.itemSerieId || f.itemAcessorios || f.condicoes;
      const first: EquipItem = {
        tipo: (f.equipTipo as EquipKind) || "notebook",
        marca: f.itemMarca,
        modelo: f.itemModelo,
        cor: f.itemCor,
        serieId: f.itemSerieId,
        acessorios: f.itemAcessorios,
        condicoes: f.condicoes,
      };
      d(patchTermoForm({ items: legacyHasData ? [first] : [{ tipo: "notebook" }] }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const items: EquipItem[] = f.items || [];

  const updateItem = (idx: number, patch: Partial<EquipItem>) => {
    const next = items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
    d(patchTermoForm({ items: next }));
  };

  const addItem = () => {
    d(patchTermoForm({ items: [...items, { tipo: "notebook" }] }));
  };

  const removeItem = (idx: number) => {
    const next = items.filter((_, i) => i !== idx);
    d(patchTermoForm({ items: next.length ? next : [{ tipo: "notebook" }] }));
  };

  return (
    <div className="space-y-6">
      {/* Tipo de termo */}
      <fieldset className={card}>
        <legend className="text-sm font-semibold text-white/90 mb-3">Tipo de Termo</legend>
        <div className="flex flex-wrap gap-3">
          {(["recebimento","devolucao"] as const).map((kind) => (
            <label
              key={kind}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/20 cursor-pointer ${
                f.tipoTermo === kind ? "bg-white/70" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <input
                type="radio"
                className="accent-orange-500"
                checked={f.tipoTermo === kind}
                onChange={() => d(patchTermoForm({ tipoTermo: kind }))}
              />
              {kind === "recebimento" ? "Recebimento" : "Devolução"}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Equipamentos (lista) */}
      <fieldset className={card}>
        <legend className="text-sm font-semibold text-white/90 mb-3">Equipamentos</legend>

        <div className="space-y-5">
          {items.map((it, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-white/25 bg-white/70 p-4 grid grid-cols-1 md:grid-cols-3 gap-3 relative"
            >
              {/* Remover */}
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="absolute -top-2 -right-2 rounded-full bg-red-600 text-white text-xs px-2 py-1 shadow hover:bg-red-700"
                aria-label={`Remover equipamento ${idx + 1}`}
              >
                ×
              </button>

              {/* Tipo */}
              <div className="md:col-span-1">
                <select
                  className={input}
                  value={it.tipo}
                  onChange={(e) => updateItem(idx, { tipo: e.target.value as EquipKind, outroRotulo: undefined })}
                >
                  {EQUIP_OPTIONS.map((op) => (
                    <option key={op.value} value={op.value}>
                      {op.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* “Outro (especifique)” */}
              {it.tipo === "outro" && (
                <input
                  className={input}
                  placeholder="Descreva o item (ex.: Ring Light)"
                  value={it.outroRotulo || ""}
                  onChange={(e) => updateItem(idx, { outroRotulo: e.target.value })}
                />
              )}

              {/* Marca / Modelo */}
              <input
                className={input}
                placeholder="Marca"
                value={it.marca || ""}
                onChange={(e) => updateItem(idx, { marca: e.target.value })}
              />
              <input
                className={input}
                placeholder="Modelo"
                value={it.modelo || ""}
                onChange={(e) => updateItem(idx, { modelo: e.target.value })}
              />

              {/* Cor / Série */}
              <input
                className={input}
                placeholder="Cor"
                value={it.cor || ""}
                onChange={(e) => updateItem(idx, { cor: e.target.value })}
              />
              <input
                className={input}
                placeholder="Nº de Série / ID"
                value={it.serieId || ""}
                onChange={(e) => updateItem(idx, { serieId: e.target.value })}
              />

              {/* Acessórios */}
              <input
                className="md:col-span-3 w-full min-w-0 border border-white/30 bg-white/90 focus:bg-white rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/50 transition"
                placeholder="Acessórios (ex.: carregador, case, cabo USB)"
                value={it.acessorios || ""}
                onChange={(e) => updateItem(idx, { acessorios: e.target.value })}
              />

              {/* Condições */}
              <input
                className="md:col-span-3 w-full min-w-0 border border-white/30 bg-white/90 focus:bg-white rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/50 transition"
                placeholder="Condições (ex.: em perfeito estado)"
                value={it.condicoes || ""}
                onChange={(e) => updateItem(idx, { condicoes: e.target.value })}
              />
            </div>
          ))}

          <div>
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 rounded bg-orange-500 text-white hover:opacity-90"
            >
              + Adicionar equipamento
            </button>
          </div>
        </div>
      </fieldset>

      {/* Local, Data e Observações */}
      <fieldset className={card}>
        <legend className="text-sm font-semibold text-white/90 mb-3">Local, Data e Observações</legend>
        <div className="grid md:grid-cols-3 gap-3">
          <input
            className={input}
            placeholder="Local (Cidade/UF)"
            value={f.local}
            onChange={(e) => d(patchTermoForm({ local: e.target.value }))}
          />
          <input
            type="date"
            className={input}
            value={f.dataIso || ""}
            onChange={(e) => d(patchTermoForm({ dataIso: e.target.value }))}
          />
          <input
            className={`md:col-span-3 ${input}`}
            placeholder="Observações (opcional)"
            value={f.observacoes || ""}
            onChange={(e) => d(patchTermoForm({ observacoes: e.target.value }))}
          />
        </div>
      </fieldset>
    </div>
  );
}
