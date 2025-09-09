import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { patchTermoForm } from "@/store/termo";

export default function StepParametrosTermo() {
  const f = useAppSelector(s => s.termoForm);
  const d = useAppDispatch();

  const input =
    "w-full min-w-0 border border-white/30 bg-white/90 focus:bg-white rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/50 transition";
  const card = "rounded-2xl p-5 md:p-6";

  return (
    <div className="space-y-6">
      <fieldset className={card}>
        <legend className="text-sm font-semibold text-white/90 mb-3">Tipo de Termo</legend>
        <div className="flex flex-wrap gap-3">
          <label className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/20 cursor-pointer ${f.tipoTermo === "recebimento" ? "bg-white/70" : "bg-white/10 hover:bg-white/20"}`}>
            <input type="radio" className="accent-orange-500" checked={f.tipoTermo === "recebimento"} onChange={() => d(patchTermoForm({ tipoTermo: "recebimento" }))}/>
            Recebimento
          </label>
          <label className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/20 cursor-pointer ${f.tipoTermo === "devolucao" ? "bg-white/70" : "bg-white/10 hover:bg-white/20"}`}>
            <input type="radio" className="accent-orange-500" checked={f.tipoTermo === "devolucao"} onChange={() => d(patchTermoForm({ tipoTermo: "devolucao" }))}/>
            Devolução
          </label>
        </div>
      </fieldset>

      <fieldset className={card}>
        <legend className="text-sm font-semibold text-white/90 mb-3">Equipamento</legend>
        <div className="grid md:grid-cols-3 gap-3">
          <select
            className={input}
            value={f.equipTipo}
            onChange={e => d(patchTermoForm({ equipTipo: e.target.value as any }))}
          >
            <option value="notebook">Notebook</option>
            <option value="celular">Celular/Smartphone</option>
            <option value="fone">Fone de ouvido</option>
            <option value="mouse">Mouse</option>
            <option value="uniforme">Uniforme</option>
            <option value="tag">Tag/Cartão</option>
            <option value="outro">Outro</option>
          </select>

          <input className={input} placeholder="Marca" value={f.itemMarca || ""} onChange={e => d(patchTermoForm({ itemMarca: e.target.value }))}/>
          <input className={input} placeholder="Modelo" value={f.itemModelo || ""} onChange={e => d(patchTermoForm({ itemModelo: e.target.value }))}/>
          <input className={input} placeholder="Cor" value={f.itemCor || ""} onChange={e => d(patchTermoForm({ itemCor: e.target.value }))}/>
          <input className={input} placeholder="Nº de Série / ID" value={f.itemSerieId || ""} onChange={e => d(patchTermoForm({ itemSerieId: e.target.value }))}/>
          <input className={input} placeholder="Acessórios (lista livre)" value={f.itemAcessorios || ""} onChange={e => d(patchTermoForm({ itemAcessorios: e.target.value }))}/>
          <input className={`${input} md:col-span-3`} placeholder="Condições (ex.: em perfeito estado)" value={f.condicoes || ""} onChange={e => d(patchTermoForm({ condicoes: e.target.value }))}/>
        </div>
      </fieldset>

      <fieldset className={card}>
        <legend className="text-sm font-semibold text-white/90 mb-3">Local, Data e Observações</legend>
        <div className="grid md:grid-cols-3 gap-3">
          <input className={input} placeholder="Local (Cidade/UF)" value={f.local} onChange={e => d(patchTermoForm({ local: e.target.value }))}/>
          <input type="date" className={input} value={f.dataIso || ""} onChange={e => d(patchTermoForm({ dataIso: e.target.value }))}/>
          <input className={`${input} md:col-span-3`} placeholder="Observações (opcional)" value={f.observacoes || ""} onChange={e => d(patchTermoForm({ observacoes: e.target.value }))}/>
        </div>
      </fieldset>
    </div>
  );
}
 