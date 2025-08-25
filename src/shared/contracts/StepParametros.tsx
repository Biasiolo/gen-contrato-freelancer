// src/shared/contracts/StepParametros.tsx
import { patchForm } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function StepParametros() {
  const form = useAppSelector((s) => s.form);
  const dispatch = useAppDispatch();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <fieldset className="border p-3 rounded">
        <legend className="text-sm font-medium">Vigência</legend>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            type="date"
            className="border p-2 rounded"
            value={form.dataInicio}
            onChange={(e) => dispatch(patchForm({ dataInicio: e.target.value }))}
          />
          <input
            type="date"
            className="border p-2 rounded"
            value={form.dataFim || ""}
            onChange={(e) => dispatch(patchForm({ dataFim: e.target.value }))}
          />
        </div>
      </fieldset>

      <fieldset className="border p-3 rounded">
        <legend className="text-sm font-medium">Pagamento</legend>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            className="border p-2 rounded"
            placeholder="Valor total (R$)"
            value={form.valorTotal as string}
            onChange={(e) => dispatch(patchForm({ valorTotal: e.target.value }))}
          />
          <select
            className="border p-2 rounded"
            value={form.formaPagamento}
            onChange={(e) => dispatch(patchForm({ formaPagamento: e.target.value as any }))}
          >
            <option>PIX</option>
            <option>Transferência</option>
            <option>Boleto</option>
            <option>Outro</option>
          </select>
          <input
            className="border p-2 rounded"
            placeholder="Dia do vencimento"
            value={form.diaVencimento || ""}
            onChange={(e) => dispatch(patchForm({ diaVencimento: e.target.value }))}
          />
          <input
            className="border p-2 rounded"
            placeholder="Banco"
            value={form.banco || ""}
            onChange={(e) => dispatch(patchForm({ banco: e.target.value }))}
          />
          <input
            className="border p-2 rounded"
            placeholder="Agência"
            value={form.agencia || ""}
            onChange={(e) => dispatch(patchForm({ agencia: e.target.value }))}
          />
          <input
            className="border p-2 rounded"
            placeholder="Conta"
            value={form.conta || ""}
            onChange={(e) => dispatch(patchForm({ conta: e.target.value }))}
          />
          <input
            className="border p-2 rounded md:col-span-2"
            placeholder="Chave PIX"
            value={form.pix || ""}
            onChange={(e) => dispatch(patchForm({ pix: e.target.value }))}
          />
        </div>
      </fieldset>

      <fieldset className="border p-3 rounded md:col-span-2">
        <legend className="text-sm font-medium">Foro</legend>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            className="border p-2 rounded"
            placeholder="Cidade"
            value={form.foroCidade}
            onChange={(e) => dispatch(patchForm({ foroCidade: e.target.value }))}
          />
          <input
            className="border p-2 rounded"
            placeholder="UF"
            value={form.foroUf}
            onChange={(e) => dispatch(patchForm({ foroUf: e.target.value }))}
          />
        </div>
      </fieldset>
    </div>
  );
}
