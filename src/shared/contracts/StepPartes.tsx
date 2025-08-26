// src/shared/contracts/StepPartes.tsx
import { IMaskInput } from "react-imask";
import { patchForm } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function StepPartes() {
  const form = useAppSelector((s) => s.form);
  const dispatch = useAppDispatch();

  // Máscaras de telefone: (00) 0000-0000 ou (00) 00000-0000
  const phoneMasks = [{ mask: "(00) 0000-0000" }, { mask: "(00) 00000-0000" }];

  // estilos (sem camadas extras)
  const card =
    "md:col-span-2 rounded-2xl p-5 md:p-6 ";
  const input =
    "border border-white/30 bg-white/70 focus:bg-white/90 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-white/40 transition";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* === CONTRATANTE (fixo) === */}
      <fieldset className={card}>
        <legend className="text-sm font-semibold text-white/90 mb-3">
          Contratante (fixo)
        </legend>

        {/* Razão, CNPJ, Endereço */}
        <div className="grid md:grid-cols-3 gap-3">
          <input className={input} value={form.contratanteRazao} readOnly />
          <input className={input} value={form.contratanteCnpj} readOnly />
          <input className={input} value={form.contratanteEndereco} readOnly />
        </div>

        {/* Representante legal */}
        <div className="grid md:grid-cols-3 gap-3 mt-3">
          <input
            className={input}
            value={form.contratanteRepresentanteNome || "Daniele Reily da Silva Souza"}
            readOnly
            title="Representante legal"
          />
          <input
            className={input}
            value={form.contratanteRepresentanteCpf || "218.047.008-86"}
            readOnly
            title="CPF do representante legal"
          />
          <div />
        </div>
      </fieldset>

      {/* === PRESTADOR (Contratada) === */}
      <fieldset className={card}>
        <legend className="text-sm font-semibold text-white/90 mb-3">
          Prestador (Contratada)
        </legend>

        <div className="grid md:grid-cols-2 gap-3">
          <input
            className={input}
            placeholder="Nome completo"
            value={form.prestadorNome}
            onChange={(e) => dispatch(patchForm({ prestadorNome: e.target.value }))}
          />

          {/* CPF */}
          <IMaskInput
            mask="000.000.000-00"
            value={form.prestadorCpf || ""}
            onAccept={(val: string) => dispatch(patchForm({ prestadorCpf: val }))}
            className={input}
            placeholder="CPF"
            inputMode="numeric"
          />

          {/* RG — aceita dígito/letra */}
          <IMaskInput
            mask="00.000.000-#"
            definitions={{ "#": /[0-9A-Za-z]/ }}
            value={form.prestadorRg || ""}
            onAccept={(val: string) => dispatch(patchForm({ prestadorRg: val }))}
            className={input}
            placeholder="RG (opcional)"
          />

          <input
            className={input}
            placeholder="E-mail"
            value={form.prestadorEmail}
            onChange={(e) => dispatch(patchForm({ prestadorEmail: e.target.value }))}
          />

          {/* Telefone (dinâmico) */}
          <IMaskInput
            mask={phoneMasks as any}
            dispatch={(appended, masked) => {
              const raw = (masked.unmaskedValue + appended).replace(/\D/g, "");
              return masked.compiledMasks[raw.length > 10 ? 1 : 0];
            }}
            value={form.prestadorTelefone || ""}
            onAccept={(val: string) => dispatch(patchForm({ prestadorTelefone: val }))}
            className={input}
            placeholder="Telefone (opcional)"
            inputMode="tel"
          />
        </div>

        {/* Endereço (granular) */}
        <div className="grid md:grid-cols-5 gap-3 mt-3">
          <input
            className={`${input} md:col-span-2`}
            placeholder="Endereço (logradouro: rua, av., etc.)"
            value={form.prestadorEnderecoLogradouro || ""}
            onChange={(e) =>
              dispatch(patchForm({ prestadorEnderecoLogradouro: e.target.value }))
            }
          />
          <input
            className={input}
            placeholder="Número"
            value={form.prestadorEnderecoNumero || ""}
            onChange={(e) =>
              dispatch(patchForm({ prestadorEnderecoNumero: e.target.value }))
            }
          />
          <input
            className={input}
            placeholder="Bairro"
            value={form.prestadorEnderecoBairro || ""}
            onChange={(e) =>
              dispatch(patchForm({ prestadorEnderecoBairro: e.target.value }))
            }
          />
          <input
            className={input}
            placeholder="Cidade"
            value={form.prestadorEnderecoCidade || ""}
            onChange={(e) =>
              dispatch(patchForm({ prestadorEnderecoCidade: e.target.value }))
            }
          />
          <input
            className={input}
            placeholder="UF"
            maxLength={2}
            value={form.prestadorEnderecoUf || ""}
            onChange={(e) =>
              dispatch(patchForm({ prestadorEnderecoUf: e.target.value.toUpperCase() }))
            }
          />
        </div>
      </fieldset>
    </div>
  );
}
