import { IMaskInput } from "react-imask";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { patchTermoForm } from "@/store/termo";

export default function StepPartesTermo() {
  const form = useAppSelector(s => s.termoForm);
  const dispatch = useAppDispatch();

  const input =
    "w-full min-w-0 border border-white/30 bg-white/90 focus:bg-white rounded px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/50 transition";
  const card = "rounded-2xl p-5 md:p-6";

  const phoneMasks = [{ mask: "(00) 0000-0000" }, { mask: "(00) 00000-0000" }];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* EMPRESA */}
      <fieldset className={card}>
        <legend className="text-sm font-semibold text-white/90 mb-3">Empresa</legend>
        <div className="grid md:grid-cols-2 gap-3">
          <input className={input} value={form.empresaRazao} readOnly />
          <input className={input} value={form.empresaCnpj} readOnly />
        </div>
      </fieldset>

      {/* COLABORADOR */}
      <fieldset className={card}>
        <legend className="text-sm font-semibold text-white/90 mb-3">Colaborador(a)</legend>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            className={input}
            placeholder="Nome completo"
            value={form.empNome}
            onChange={e => dispatch(patchTermoForm({ empNome: e.target.value }))}
          />
          <IMaskInput
            mask="000.000.000-00"
            className={input}
            placeholder="CPF"
            value={form.empCpf}
            onAccept={(v: string) => dispatch(patchTermoForm({ empCpf: v }))}
            inputMode="numeric"
          />
          <IMaskInput
            mask="00.000.000-#"
            definitions={{ "#": /[0-9A-Za-z]/ }}
            className={input}
            placeholder="RG (opcional)"
            value={form.empRg || ""}
            onAccept={(v: string) => dispatch(patchTermoForm({ empRg: v }))}
          />
          <input
            className={input}
            placeholder="Função / Cargo (opcional)"
            value={form.empFuncao || ""}
            onChange={e => dispatch(patchTermoForm({ empFuncao: e.target.value }))}
          />
          <input
            className={input}
            placeholder="E-mail (opcional)"
            value={form.empEmail || ""}
            onChange={e => dispatch(patchTermoForm({ empEmail: e.target.value }))}
          />
          <IMaskInput
            mask={phoneMasks as any}
            className={input}
            placeholder="Telefone (opcional)"
            value={form.empTelefone || ""}
            onAccept={(v: string) => dispatch(patchTermoForm({ empTelefone: v }))}
            inputMode="tel"
          />
        </div>

        
      </fieldset>
    </div>
  );
}
