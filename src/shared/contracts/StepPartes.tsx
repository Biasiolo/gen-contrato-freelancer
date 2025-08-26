import { patchForm } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function StepPartes() {
  const form = useAppSelector((s) => s.form);
  const dispatch = useAppDispatch();

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
          <input
            className="border p-2 rounded"
            placeholder="CPF"
            value={form.prestadorCpf}
            onChange={(e) => dispatch(patchForm({ prestadorCpf: e.target.value }))}
          />
          <input
            className="border p-2 rounded"
            placeholder="RG (opcional)"
            value={form.prestadorRg || ""}
            onChange={(e) => dispatch(patchForm({ prestadorRg: e.target.value }))}
          />
          <input
            className="border p-2 rounded"
            placeholder="E-mail"
            value={form.prestadorEmail}
            onChange={(e) => dispatch(patchForm({ prestadorEmail: e.target.value }))}
          />
          <input
            className="border p-2 rounded"
            placeholder="Telefone (opcional)"
            value={form.prestadorTelefone || ""}
            onChange={(e) => dispatch(patchForm({ prestadorTelefone: e.target.value }))}
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
              dispatch(
                patchForm({ prestadorEnderecoUf: e.target.value.toUpperCase() })
              )
            }
          />
        </div>

        {/* Campo livre opcional (compat) — se quiser manter visível, descomente:
        <div className="mt-3">
          <input
            className="border p-2 rounded w-full"
            placeholder="Endereço (livre) — usado como fallback se os campos acima não forem preenchidos"
            value={form.prestadorEndereco}
            onChange={(e) => dispatch(patchForm({ prestadorEndereco: e.target.value }))}
          />
        </div>
        */}
      </fieldset>
    </div>
  );
}
