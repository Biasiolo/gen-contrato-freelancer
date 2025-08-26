// src/shared/contracts/StepPartes.tsx
import { IMaskInput } from "react-imask";
import { patchForm } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function StepPartes() {
  const form = useAppSelector((s) => s.form);
  const dispatch = useAppDispatch();

  // Máscaras de telefone: (00) 0000-0000 ou (00) 00000-0000
  const phoneMasks = [
    { mask: "(00) 0000-0000" },
    { mask: "(00) 00000-0000" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <fieldset className="md:col-span-2 border p-3 rounded">
        <legend className="text-sm font-medium">Contratante (fixo)</legend>
        <div className="grid md:grid-cols-3 gap-3">
          <input className="border p-2 rounded" value={form.contratanteRazao} readOnly />
          <input className="border p-2 rounded" value={form.contratanteCnpj} readOnly />
          <input className="border p-2 rounded" value={form.contratanteEndereco} readOnly />
        </div>
      </fieldset>

      <fieldset className="md:col-span-2 border p-3 rounded">
        <legend className="text-sm font-medium">Prestador (Contratada)</legend>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            className="border p-2 rounded"
            placeholder="Nome completo"
            value={form.prestadorNome}
            onChange={(e) => dispatch(patchForm({ prestadorNome: e.target.value }))}
          />

          {/* CPF */}
          <IMaskInput
            mask="000.000.000-00"
            value={form.prestadorCpf || ""}
            onAccept={(val: string) => dispatch(patchForm({ prestadorCpf: val }))}
            className="border p-2 rounded"
            placeholder="CPF"
            inputMode="numeric"
          />

          {/* RG — aceita dígito/letra no final */}
          <IMaskInput
            mask="00.000.000-#"
            definitions={{ "#": /[0-9A-Za-z]/ }}
            value={form.prestadorRg || ""}
            onAccept={(val: string) => dispatch(patchForm({ prestadorRg: val }))}
            className="border p-2 rounded"
            placeholder="RG (opcional)"
          />

          <input
            className="border p-2 rounded"
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
            className="border p-2 rounded"
            placeholder="Telefone (opcional)"
            inputMode="tel"
          />
        </div>

        {/* ENDEREÇO (granular) */}
        <div className="grid md:grid-cols-5 gap-3 mt-3">
          <input
            className="border p-2 rounded md:col-span-2"
            placeholder="Endereço (logradouro: rua, av., etc.)"
            value={form.prestadorEnderecoLogradouro || ""}
            onChange={(e) => dispatch(patchForm({ prestadorEnderecoLogradouro: e.target.value }))}
          />
          <input
            className="border p-2 rounded"
            placeholder="Número"
            value={form.prestadorEnderecoNumero || ""}
            onChange={(e) => dispatch(patchForm({ prestadorEnderecoNumero: e.target.value }))}
          />
          <input
            className="border p-2 rounded"
            placeholder="Bairro"
            value={form.prestadorEnderecoBairro || ""}
            onChange={(e) => dispatch(patchForm({ prestadorEnderecoBairro: e.target.value }))}
          />
          <input
            className="border p-2 rounded"
            placeholder="Cidade"
            value={form.prestadorEnderecoCidade || ""}
            onChange={(e) => dispatch(patchForm({ prestadorEnderecoCidade: e.target.value }))}
          />
          <input
            className="border p-2 rounded"
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
