// src/types/termos.ts
export type TermoKind = "recebimento" | "devolucao";
export type EquipKind = "fone" | "celular" | "notebook" | "mouse" | "uniforme" | "tag" | "outro";

export type TermoTemplates = {
  version: string;
  base: {
    recebimento: string; // texto com {{PLACEHOLDERS}}
    devolucao: string;   // texto com {{PLACEHOLDERS}}
  };
};

export type TermoFormData = {
  // empresa (fixo como nos contratos)
  empresaRazao: string;
  empresaCnpj: string;

  // colaborador
  empNome: string;
  empCpf: string;
  empRg?: string;
  empFuncao?: string;
  empEmail?: string;
  empTelefone?: string;

  // endereço colaborador (granular como fizemos)
  empEndLog?: string;
  empEndNum?: string;
  empEndBairro?: string;
  empEndCidade?: string;
  empEndUf?: string;
  empEndCep?: string;

  // termo
  tipoTermo: TermoKind;
  equipTipo: EquipKind;
  itemMarca?: string;
  itemModelo?: string;
  itemCor?: string;
  itemSerieId?: string;
  itemAcessorios?: string; // livre ou lista join
  condicoes?: string;      // livre (ex.: “em perfeito estado”)

  local: string;           // ex.: “São José dos Campos/SP”
  dataIso?: string;        // YYYY-MM-DD

  observacoes?: string;
};
