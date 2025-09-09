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
  empresaRazao: "D HOUSE AGÊNCIA DE PUBLICIDADE LTDA",
  empresaCnpj: "18.319.139/0001-68",

  empNome: "",
  empCpf: "",
  empRg: "",
  empFuncao: "",
  empEmail: "",
  empTelefone: "",

  empEndLog: "",
  empEndNum: "",
  empEndBairro: "",
  empEndCidade: "",
  empEndUf: "",
  empEndCep: "",

  tipoTermo: "recebimento",
  equipTipo: "notebook",
  itemMarca: "",
  itemModelo: "",
  itemCor: "",
  itemSerieId: "",
  itemAcessorios: "",
  condicoes: "Em perfeito estado.",

  local: "São José dos Campos/SP",
  dataIso: "",
  observacoes: ""
};

export const termoFormSlice = createSlice({
  name: "termoForm",
  initialState: initialForm,
  reducers: {
    patchTermoForm: (s, a: PayloadAction<Partial<TermoFormData>>) => ({ ...s, ...a.payload }),
    resetTermoForm: () => initialForm
  }
});

export const { goToTermoStep, nextTermo, prevTermo } = termoUISlice.actions;
export const { patchTermoForm, resetTermoForm } = termoFormSlice.actions;
