// src/pdf/buildMap.ts
import { ContractFormData, ServiceTemplate } from "@/types/contracts";

export type PlaceholderMap = Record<string, unknown>;

/** Parse "YYYY-MM-DD" em UTC para evitar problemas de fuso/horário de verão. */
function parseISODateUTC(iso?: string) {
  if (!iso) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!y || !mo || !d) return null;
  const ms = Date.UTC(y, mo - 1, d);
  return new Date(ms);
}

/** Diferença em dias (inclusiva). Se inválido, retorna 1. */
function diffDaysInclusive(startISO?: string, endISO?: string): number {
  const a = parseISODateUTC(startISO);
  const b = parseISODateUTC(endISO);
  if (!a || !b) return 1;
  const ms = b.getTime() - a.getTime();
  const days = Math.floor(ms / 86_400_000) + 1;
  return days > 0 ? days : 1;
}

/** Formata valor (número/string) em pt-BR sem "R$". */
function toBRLNoSymbol(v: unknown): string {
  if (v === undefined || v === null) return "";
  if (typeof v === "string") {
    // se já veio formatado (ex.: "20.000,00"), só devolve
    if (/[.,]\d{2}$/.test(v) || v.includes(".")) return v;
    const n = Number(v.replace(",", "."));
    if (Number.isFinite(n)) {
      return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).replace("R$", "").trim();
    }
    return v;
  }
  if (typeof v === "number" && Number.isFinite(v)) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).replace("R$", "").trim();
  }
  return String(v);
}

export function buildPlaceholderMap(form: ContractFormData, service?: ServiceTemplate): PlaceholderMap {
  const servicoTitulo =
    form.servicoChave === "custom"
      ? (form.servicoCustomTitulo || "Serviço Customizado")
      : (service as any)?.titulo || "";

  // Defaults dos parâmetros "comuns" (podem ser sobrescritos por form.params)
  const defaults = {
    VIGENCIA_DIAS: diffDaysInclusive(form.dataInicio, form.dataFim), // 1 se datas inválidas
    PRAZO_PAGAMENTO_DIAS: 10,
    FORCA_MAIOR_DIAS: 60,
    NAO_CONCORRENCIA_MESES: 6,
    NAO_CONCORRENCIA_MULTA_VALOR: toBRLNoSymbol("20000"), // "20.000,00"
    AVISO_PREVIO_DIAS: 1,
    MULTA_PERCENTUAL: 10
  };

  // Se vierem overrides em params, já convertemos NAO_CONCORRENCIA_MULTA_VALOR para BRL sem símbolo
  const params = { ...(form.params || {}) };
  if (params.NAO_CONCORRENCIA_MULTA_VALOR !== undefined) {
    params.NAO_CONCORRENCIA_MULTA_VALOR = toBRLNoSymbol(params.NAO_CONCORRENCIA_MULTA_VALOR);
  }

  return {
    // partes
    CONTRATANTE_RAZAO: form.contratanteRazao,
    CONTRATANTE_CNPJ: form.contratanteCnpj,
    CONTRATANTE_ENDERECO: form.contratanteEndereco,

    PRESTADOR_NOME: form.prestadorNome,
    PRESTADOR_CPF: form.prestadorCpf,
    PRESTADOR_RG: form.prestadorRg,
    PRESTADOR_EMAIL: form.prestadorEmail,
    PRESTADOR_ENDERECO: form.prestadorEndereco,
    PRESTADOR_TELEFONE: form.prestadorTelefone,

    // parâmetros gerais
    SERVICO_TITULO: servicoTitulo,
    DATA_INICIO: form.dataInicio,
    DATA_FIM: form.dataFim,
    VALOR_TOTAL: form.valorTotal,
    FORMA_PAGAMENTO: form.formaPagamento,
    DIA_VENCIMENTO: form.diaVencimento,
    BANCO: form.banco,
    AGENCIA: form.agencia,
    CONTA: form.conta,
    PIX: form.pix,
    FORO_CIDADE: form.foroCidade,
    FORO_UF: form.foroUf,

    // comuns (com defaults) — podem ser sobrescritos em params
    ...defaults,

    // distrato
    DATA_DISTRATO: form.dataDistrato,
    VALOR_ACERTO: form.valorAcerto,
    PRAZO_DEVOLUCAO: form.prazoDevolucao,
    DATA_ACERTO: form.dataAcerto,

    // parâmetros específicos / overrides finais
    ...params
  };
}
