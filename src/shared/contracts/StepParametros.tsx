// src/shared/contracts/StepParametros.tsx
import { patchForm } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { IMaskInput } from "react-imask";

export default function StepParametros() {
  const form = useAppSelector((s) => s.form);
  const dispatch = useAppDispatch();

  // estilos alinhados ao StepPartes (sem camadas extras)
  const card = "rounded-2xl p-5 md:p-6";
  const input =
    "border border-white/30 bg-white/90 focus:bg-white rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/50 transition";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* === VIGÊNCIA === */}
      <fieldset className={card}>
        <legend className="text-sm font-semibold text-white/90 mb-3">Vigência</legend>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            type="date"
            className={input}
            value={form.dataInicio}
            onChange={(e) => dispatch(patchForm({ dataInicio: e.target.value }))}
          />
          <input
            type="date"
            className={input}
            value={form.dataFim || ""}
            onChange={(e) => dispatch(patchForm({ dataFim: e.target.value }))}
          />
        </div>
      </fieldset>

      {/* === PAGAMENTO === */}
      <fieldset className={card}>
        <legend className="text-sm font-semibold text-white/90 mb-3">Pagamento</legend>
        <div className="grid md:grid-cols-2 gap-3">
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
            value={(form.valorTotal ?? "").toString()}   // ✅ força string
            onAccept={(val) => {
              const str = typeof val === "number" ? String(val).replace(".", ",") : (val ?? "");
              dispatch(patchForm({ valorTotal: str }));  // ✅ salva string “limpa” (sem R$)
            }}
            className={input}
            placeholder="Valor total (R$)"
            inputMode="decimal"
          />

          <select
            className={input}
            value={form.formaPagamento}
            onChange={(e) => dispatch(patchForm({ formaPagamento: e.target.value as any }))}
          >
            <option>PIX</option>
            <option>Transferência</option>
            <option>Boleto</option>
            <option>Outro</option>
          </select>

          <input
            type="date"
            className={input}
            value={form.diaVencimento || ""}
            onChange={(e) => dispatch(patchForm({ diaVencimento: e.target.value }))}
          />
          <input
            className={input}
            placeholder="Banco"
            value={form.banco || ""}
            onChange={(e) => dispatch(patchForm({ banco: e.target.value }))}
          />
          <input
            className={input}
            placeholder="Agência"
            value={form.agencia || ""}
            onChange={(e) => dispatch(patchForm({ agencia: e.target.value }))}
          />
          <input
            className={input}
            placeholder="Conta"
            value={form.conta || ""}
            onChange={(e) => dispatch(patchForm({ conta: e.target.value }))}
          />
          <input
            className={`${input} md:col-span-2`}
            placeholder="Chave PIX"
            value={form.pix || ""}
            onChange={(e) => dispatch(patchForm({ pix: e.target.value }))}
          />
        </div>
      </fieldset>

      {/* === FORO === */}
      <fieldset className={`${card} md:col-span-2`}>
        <legend className="text-sm font-semibold text-white/90 mb-3">Foro</legend>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            className={input}
            placeholder="Cidade"
            value={form.foroCidade}
            onChange={(e) => dispatch(patchForm({ foroCidade: e.target.value }))}
          />
          <input
            className={input}
            placeholder="UF"
            maxLength={2}
            value={form.foroUf}
            onChange={(e) => dispatch(patchForm({ foroUf: e.target.value.toUpperCase() }))}
          />
        </div>
      </fieldset>
    </div>
  );
}
