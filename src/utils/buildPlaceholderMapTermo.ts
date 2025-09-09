import { TermoFormData } from "@/types/termos";

export type TermoPlaceholderMap = Record<string, unknown>;

function joinCompact(parts: Array<string | undefined>, sep: string) {
  return parts.map(p => (p ?? "").toString().trim()).filter(Boolean).join(sep);
}

function formatEndColab(f: TermoFormData) {
  const has =
    f.empEndLog || f.empEndNum || f.empEndBairro || f.empEndCidade || f.empEndUf || f.empEndCep;
  if (!has) return "";
  const l1 = joinCompact([f.empEndLog, f.empEndNum], ", ");
  const cidadeUf = joinCompact(
    [f.empEndCidade, f.empEndUf ? f.empEndUf.toUpperCase() : undefined],
    "/"
  );
  const base = joinCompact([l1, f.empEndBairro, cidadeUf], " - ");
  return f.empEndCep ? `${base} - CEP ${f.empEndCep}` : base;
}

function formatDateBr(iso?: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
}

const EQUIP_LABEL: Record<string, string> = {
  fone: "Fone de ouvido",
  celular: "Celular/Smartphone",
  notebook: "Notebook",
  mouse: "Mouse",
  uniforme: "Uniforme",
  tag: "Tag/Cartão de acesso",
  outro: "Outro",
};

export function buildPlaceholderMapTermo(form: TermoFormData): TermoPlaceholderMap {
  const equipLabel = EQUIP_LABEL[form.equipTipo] || form.equipTipo;

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

    // equipamento
    EQUIP_TIPO_LABEL: equipLabel,
    ITEM_MARCA_OPT: form.itemMarca || "—",
    ITEM_MODELO_OPT: form.itemModelo || "—",
    ITEM_COR_OPT: form.itemCor || "—",
    ITEM_SERIE_ID_OPT: form.itemSerieId || "—",
    ITEM_ACESSORIOS_OPT: form.itemAcessorios || "—",
    CONDICOES_OPT: form.condicoes || "Em perfeito estado.",

    // gerais
    LOCAL: form.local || "",
    DATA_BR: formatDateBr(form.dataIso),
    OBSERVACOES_OPT: form.observacoes ? `Observações: ${form.observacoes}` : "",
  };
}
