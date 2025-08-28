import { ContractFormData, ServiceTemplate } from "@/types/contracts";

export type PlaceholderMap = Record<string, unknown>;

function joinCompact(parts: Array<string | undefined>, sep: string) {
  return parts
    .map((p) => (p ?? "").toString().trim())
    .filter(Boolean)
    .join(sep);
}

function formatPrestadorEndereco(form: ContractFormData) {
  const hasGranular = !!(
    form.prestadorEnderecoLogradouro ||
    form.prestadorEnderecoNumero ||
    form.prestadorEnderecoBairro ||
    form.prestadorEnderecoCidade ||
    form.prestadorEnderecoUf ||
    form.prestadorEnderecoCep // ← inclui CEP para considerar granular
  );

  if (!hasGranular) {
    // fallback: campo antigo (livre)
    return form.prestadorEndereco;
  }

  const linha1 = joinCompact(
    [form.prestadorEnderecoLogradouro, form.prestadorEnderecoNumero],
    ", "
  );

  const cidadeUf = joinCompact(
    [
      form.prestadorEnderecoCidade,
      form.prestadorEnderecoUf
        ? form.prestadorEnderecoUf.toString().toUpperCase()
        : undefined,
    ],
    "/"
  );

  // Base: "Rua X, 123 - Centro - São José dos Campos/SP"
  const base = joinCompact([linha1, form.prestadorEnderecoBairro, cidadeUf], " - ");

  // Se houver CEP, acrescenta ao final: " ... - CEP 12345-678"
  return form.prestadorEnderecoCep
    ? `${base} - CEP ${form.prestadorEnderecoCep}`
    : base;
}

export function buildPlaceholderMap(
  form: ContractFormData,
  service?: ServiceTemplate
): PlaceholderMap {
  const servicoTitulo =
    form.servicoChave === "custom"
      ? form.servicoCustomTitulo || "Serviço Customizado"
      : (service as any)?.titulo || "";

  return {
    // partes
    CONTRATANTE_RAZAO: form.contratanteRazao,
    CONTRATANTE_CNPJ: form.contratanteCnpj,
    CONTRATANTE_ENDERECO: form.contratanteEndereco,
    CONTRATANTE_REPRESENTANTE_NOME: form.contratanteRepresentanteNome,
    CONTRATANTE_REPRESENTANTE_CPF: form.contratanteRepresentanteCpf,

    PRESTADOR_NOME: form.prestadorNome,
    PRESTADOR_CPF: form.prestadorCpf,
    PRESTADOR_RG: form.prestadorRg,
    PRESTADOR_EMAIL: form.prestadorEmail,
    PRESTADOR_ENDERECO: formatPrestadorEndereco(form), // ✅ agora inclui CEP quando informado
    PRESTADOR_TELEFONE: form.prestadorTelefone,

    // parâmetros gerais
    SERVICO_TITULO: servicoTitulo,
    DATA_INICIO: form.dataInicio,
    DATA_FIM: form.dataFim,
    VALOR_TOTAL: form.valorTotal,
    FORMA_PAGAMENTO: form.formaPagamento,
    DATA_VENCIMENTO: form.diaVencimento, // (mantive como você enviou)
    BANCO: form.banco,
    AGENCIA: form.agencia,
    CONTA: form.conta,
    PIX: form.pix,
    FORO_CIDADE: form.foroCidade,
    FORO_UF: form.foroUf,

    // parâmetros específicos
    ...(form.params || {}),

    // defaults
    NAO_CONCORRENCIA_MESES: 6,

    // distrato
    DATA_DISTRATO: form.dataDistrato,
    VALOR_ACERTO: form.valorAcerto,
    PRAZO_DEVOLUCAO: form.prazoDevolucao,
    DATA_ACERTO: form.dataAcerto,
  };
}
