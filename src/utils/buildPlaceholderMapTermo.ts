// src/utils/buildPlaceholderMapTermo.ts
import { TermoFormData, EquipItem, EquipKind } from "@/types/termos";

export type TermoPlaceholderMap = Record<string, unknown>;

function joinCompact(parts: Array<string | undefined>, sep: string) {
  return parts.map((p) => (p ?? "").toString().trim()).filter(Boolean).join(sep);
}

function formatEndColab(f: TermoFormData) {
  const has =
    f.empEndLog || f.empEndNum || f.empEndBairro || f.empEndCidade || f.empEndUf || f.empEndCep;
  if (!has) return "";
  const l1 = joinCompact([f.empEndLog, f.empEndNum], ", ");
  const cidadeUf = joinCompact([f.empEndCidade, f.empEndUf ? f.empEndUf.toUpperCase() : undefined], "/");
  const base = joinCompact([l1, f.empEndBairro, cidadeUf], " - ");
  return f.empEndCep ? `${base} - CEP ${f.empEndCep}` : base;
}

// "YYYY-MM-DD" -> "DD/MM/YYYY"
function formatDateBr(iso?: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
}

// --------------------------------------
// Equipamentos (multi-itens)
// --------------------------------------
const EQUIP_LABEL: Record<EquipKind, string> = {
  fone: "Fone de ouvido",
  celular: "Celular/Smartphone",
  notebook: "Notebook",
  mouse: "Mouse",
  teclado: "Teclado",
  uniforme: "Uniforme",
  tag: "Tag/Cartão de acesso",
  outro: "Outro",
};

// Usa lista nova; se não houver, migra 1 item a partir dos campos antigos
function normalizeItems(form: TermoFormData): EquipItem[] {
  if (Array.isArray(form.items) && form.items.length > 0) return form.items;

  const legacyHas =
    form.equipTipo ||
    form.itemMarca ||
    form.itemModelo ||
    form.itemCor ||
    form.itemSerieId ||
    form.itemAcessorios ||
    form.condicoes;

  if (!legacyHas) return [];

  return [
    {
      tipo: (form.equipTipo as EquipKind) || "notebook",
      marca: form.itemMarca,
      modelo: form.itemModelo,
      cor: form.itemCor,
      serieId: form.itemSerieId,
      acessorios: form.itemAcessorios,
      condicoes: form.condicoes,
    },
  ];
}

function tipoLabel(it: EquipItem) {
  return it.tipo === "outro" ? (it.outroRotulo?.trim() || "Outro") : EQUIP_LABEL[it.tipo];
}

function formatItemLine(it: EquipItem, idx: number): string {
  const headerDesc = joinCompact([it.marca, it.modelo, it.cor], ", ");
  const header =
    headerDesc ? `${tipoLabel(it)} (${headerDesc})` : `${tipoLabel(it)}`;

  const tail = joinCompact(
    [
      it.serieId ? `Série/ID: ${it.serieId}` : undefined,
      it.acessorios ? `Acessórios: ${it.acessorios}` : undefined,
      it.condicoes ? `Condições: ${it.condicoes}` : undefined,
    ],
    " — "
  );

  return `${idx + 1}. ${header}${tail ? ` — ${tail}` : ""}`;
}

export function buildPlaceholderMapTermo(form: TermoFormData): TermoPlaceholderMap {
  const items = normalizeItems(form);
  const first = items[0];

  return {
    // empresa
    EMPRESA_RAZAO: form.empresaRazao,
    EMPRESA_CNPJ: form.empresaCnpj,

    // colaborador
    EMP_NOME: form.empNome,
    EMP_CPF: form.empCpf,
    EMP_RG_OPT: form.empRg ? `, RG ${form.empRg}` : "",
    EMP_FUNCAO_OPT: form.empFuncao || "—",
    EMP_EMAIL_OPT: form.empEmail || "—",
    EMP_TELEFONE_OPT: form.empTelefone || "—",
    EMP_ENDERECO_OPT: formatEndColab(form),

    // equipamentos — NOVO
    EQUIP_QTD: String(items.length || 0),
    EQUIP_LISTA_TXT: items.length
      ? items.map(formatItemLine).join("\n")
      : "—",

    // compatibilidade com template antigo (usa o 1º item se existir)
    EQUIP_TIPO_LABEL: first ? tipoLabel(first) : "",
    ITEM_MARCA_OPT: first?.marca || "—",
    ITEM_MODELO_OPT: first?.modelo || "—",
    ITEM_COR_OPT: first?.cor || "—",
    ITEM_SERIE_ID_OPT: first?.serieId || "—",
    ITEM_ACESSORIOS_OPT: first?.acessorios || "—",
    CONDICOES_OPT: first?.condicoes || "Em perfeito estado.",

    // gerais
    LOCAL: form.local || "",
    DATA_BR: formatDateBr(form.dataIso),
    OBSERVACOES_OPT: form.observacoes ? `Observações: ${form.observacoes}` : "",
  };
}
