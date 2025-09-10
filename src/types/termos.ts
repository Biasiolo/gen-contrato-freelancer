// src/types/termos.ts
export type TermoKind = "recebimento" | "devolucao";
export type EquipKind = "fone" | "celular" | "notebook" | "mouse" | "uniforme" | "tag" | "outro";

export type TermoTemplates = {
  version: string;
  base: {
    recebimento: string;
    devolucao: string;
  };
};

export type EquipItem = {
  tipo: EquipKind;       // inclui "outro"
  outroRotulo?: string;  // usado quando tipo === "outro"
  marca?: string;
  modelo?: string;
  cor?: string;
  serieId?: string;
  acessorios?: string;   // livre (ex.: "carregador, case")
  condicoes?: string;    // livre (ex.: "em perfeito estado")
};

export type TermoFormData = {
  // empresa (fixo)
  empresaRazao: string;
  empresaCnpj: string;

  // colaborador
  empNome: string;
  empCpf: string;
  empRg?: string;
  empFuncao?: string;
  empEmail?: string;
  empTelefone?: string;

  // endereço colaborador
  empEndLog?: string;
  empEndNum?: string;
  empEndBairro?: string;
  empEndCidade?: string;
  empEndUf?: string;
  empEndCep?: string;

  // termo
  tipoTermo: TermoKind;

  // NOVO: lista de equipamentos
  items: EquipItem[];

  // legado (opcional durante transição) — pode remover depois
  equipTipo?: EquipKind;
  itemMarca?: string;
  itemModelo?: string;
  itemCor?: string;
  itemSerieId?: string;
  itemAcessorios?: string;
  condicoes?: string;

  // meta
  local: string;
  dataIso?: string;
  observacoes?: string;
};
