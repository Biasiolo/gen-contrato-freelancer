import { ContractFormData, ServiceTemplate } from "@/types/contracts";
import { brlPorExtenso } from "@/utils/moneyToWordsBRL";

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
    form.prestadorEnderecoCep
  );

  if (!hasGranular) return form.prestadorEndereco;

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

  const base = joinCompact([linha1, form.prestadorEnderecoBairro, cidadeUf], " - ");
  return form.prestadorEnderecoCep ? `${base} - CEP ${form.prestadorEnderecoCep}` : base;
}

function formatDateBr(iso?: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
}

function diffDaysInclusive(isoStart?: string, isoEnd?: string): string {
  if (!isoStart || !isoEnd) return "";
  const [ys, ms, ds] = isoStart.split("-").map(Number);
  const [ye, me, de] = isoEnd.split("-").map(Number);

  const start = new Date(ys, (ms || 1) - 1, ds || 1);
  const end = new Date(ye, (me || 1) - 1, de || 1);

  const msPerDay = 24 * 60 * 60 * 1000;
  const diff = Math.round((end.getTime() - start.getTime()) / msPerDay) + 1;

  return Number.isFinite(diff) && diff > 0 ? String(diff) : "";
}

export function buildPlaceholderMap(
  form: ContractFormData,
  service?: ServiceTemplate
): PlaceholderMap {
  const servicoTitulo =
    form.servicoChave === "custom"
      ? form.servicoCustomTitulo || "Serviço Customizado"
      : (service as any)?.titulo || "";

  const vigenciaTipo = form.vigenciaTipo ?? "dias";

  let vigenciaValor = "";
  let vigenciaTexto = "";

  if (vigenciaTipo === "meses") {
    const meses = String(form.vigenciaValor || "").trim();

    if (meses) {
      vigenciaValor = meses;
      vigenciaTexto = `${meses} ${meses === "1" ? "mês" : "meses"}`;
    }
  } else {
    const diasInformados = String(form.vigenciaValor || "").trim();
    const diasCalculados = diffDaysInclusive(form.dataInicio, form.dataFim);
    const dias = diasInformados || diasCalculados;

    if (dias) {
      vigenciaValor = dias;
      vigenciaTexto = `${dias} ${dias === "1" ? "dia" : "dias"}`;
    }
  }

  if (!vigenciaTexto) {
    vigenciaTexto = "não definido";
  }

  return {
    CONTRATANTE_RAZAO: form.contratanteRazao,
    CONTRATANTE_CNPJ: form.contratanteCnpj,
    CONTRATANTE_ENDERECO: form.contratanteEndereco,
    CONTRATANTE_REPRESENTANTE_NOME: form.contratanteRepresentanteNome,
    CONTRATANTE_REPRESENTANTE_CPF: form.contratanteRepresentanteCpf,

    PRESTADOR_NOME: form.prestadorNome,
    PRESTADOR_CPF: form.prestadorCpf,
    PRESTADOR_RG: form.prestadorRg,
    PRESTADOR_EMAIL: form.prestadorEmail,
    PRESTADOR_ENDERECO: formatPrestadorEndereco(form),
    PRESTADOR_TELEFONE: form.prestadorTelefone,

    SERVICO_TITULO: servicoTitulo,
    DATA_INICIO: form.dataInicio,
    DATA_FIM: form.dataFim,

    VIGENCIA_DIAS: vigenciaValor,
    VIGENCIA_TEXTO: vigenciaTexto,
    VIGENCIA_TIPO: vigenciaTipo,

    VALOR_TOTAL: form.valorTotal,
    VALOR_TOTAL_EXTENSO: brlPorExtenso(form.valorTotal),

    FORMA_PAGAMENTO: form.formaPagamento,
    DATA_VENCIMENTO: formatDateBr(form.diaVencimento),

    BANCO: form.banco,
    AGENCIA: form.agencia,
    CONTA: form.conta,
    PIX: form.pix,

    FORO_CIDADE: form.foroCidade,
    FORO_UF: form.foroUf,

    ...(form.params || {}),

    NAO_CONCORRENCIA_MESES: 6,

    DATA_DISTRATO: form.dataDistrato,
    VALOR_ACERTO: form.valorAcerto,
    VALOR_ACERTO_EXTENSO: brlPorExtenso(form.valorAcerto),
    PRAZO_DEVOLUCAO: form.prazoDevolucao,
    DATA_ACERTO: form.dataAcerto,
  };
}