// src/store/termo.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TermoFormData } from "@/types/termos";

type UIState = { step: number };
const clamp = (n: number) => Math.max(0, Math.min(2, n)); // 3 etapas

const initialUI: UIState = { step: 0 };

export const termoUISlice = createSlice({
  name: "termoUI",
  initialState: initialUI,
  reducers: {
    goToTermoStep(s, a: PayloadAction<number>) { s.step = clamp(a.payload); },
    nextTermo(s) { s.step = clamp(s.step + 1); },
    prevTermo(s) { s.step = clamp(s.step - 1); }
  }
});

const initialForm: TermoFormData = {
  // empresa
  empresaRazao: "D HOUSE AGÊNCIA DE PUBLICIDADE LTDA",
  empresaCnpj: "18.319.139/0001-68",

  // colaborador
  empNome: "",
  empCpf: "",
  empRg: "",
  empFuncao: "",
  empEmail: "",
  empTelefone: "",

  // endereço
  empEndLog: "",
  empEndNum: "",
  empEndBairro: "",
  empEndCidade: "",
  empEndUf: "",
  empEndCep: "",

  // termo (legado – mantém compatibilidade)
  tipoTermo: "recebimento",
  equipTipo: "notebook",
  itemMarca: "",
  itemModelo: "",
  itemCor: "",
  itemSerieId: "",
  itemAcessorios: "",
  condicoes: "Em perfeito estado.",

  // 🔽 NOVO: multi-itens (obrigatório no tipo)
  items: [],

  // gerais
  local: "São José dos Campos/SP",
  dataIso: "",
  observacoes: ""
};

export const termoFormSlice = createSlice({
  name: "termoForm",
  initialState: initialForm,
  reducers: {
    // atualização genérica
    patchTermoForm: (s, a: PayloadAction<Partial<TermoFormData>>) => ({ ...s, ...a.payload }),
    resetTermoForm: () => initialForm,

    // (opcional) utilitários para manipular items
    setTermoItems(s, a: PayloadAction<TermoFormData["items"]>) {
      s.items = a.payload ?? [];
    },
    addTermoItem(s, a: PayloadAction<NonNullable<TermoFormData["items"]>[number]>) {
      s.items = [...(s.items ?? []), a.payload];
    },
    updateTermoItem(
      s,
      a: PayloadAction<{ index: number; patch: Partial<NonNullable<TermoFormData["items"]>[number]> }>
    ) {
      const { index, patch } = a.payload;
      if (!s.items || !s.items[index]) return;
      s.items[index] = { ...s.items[index], ...patch };
    },
    removeTermoItem(s, a: PayloadAction<number>) {
      if (!s.items) return;
      s.items = s.items.filter((_, i) => i !== a.payload);
    }
  }
});

export const { goToTermoStep, nextTermo, prevTermo } = termoUISlice.actions;
export const {
  patchTermoForm,
  resetTermoForm,
  setTermoItems,
  addTermoItem,
  updateTermoItem,
  removeTermoItem
} = termoFormSlice.actions;
