// src/store/index.ts
import { configureStore, createSlice, PayloadAction, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { ContractFormData } from "@/types/contracts";

type UIState = {
  step: number; // 0..3
};

const clampStep = (n: number) => Math.max(0, Math.min(3, n));

const initialForm: ContractFormData = {
  // contratante (fixo por enquanto)
  contratanteRazao: "D HOUSE AGÊNCIA DE PUBLICIDADE LTDA",
  contratanteCnpj: "18.319.139/0001-68",
  contratanteEndereco: "Rua Teopompo de Vasconcelos, 161 ap 22-Vila Adyana-São José dos Campos/SP",
  // prestador
  prestadorNome: "",
  prestadorCpf: "",
  prestadorRg: "",
  prestadorEmail: "",
  prestadorTelefone: "",
  prestadorEndereco: "",
  // parâmetros gerais
  dataInicio: "",
  dataFim: "",
  valorTotal: "",
  formaPagamento: "PIX",
  diaVencimento: "",
  banco: "",
  agencia: "",
  conta: "",
  pix: "",
  foroCidade: "São José dos Campos",
  foroUf: "SP",
  // escolha do documento
  tipoDocumento: "contrato",
  servicoChave: undefined,
  servicoCustomTitulo: "",
  servicoCustomEscopo: "",
  servicoCustomClausulas: "",
  params: {},
  // distrato
  dataDistrato: "",
  valorAcerto: "",
  prazoDevolucao: ""
};

const initialUI: UIState = { step: 0 };

const uiSlice = createSlice({
  name: "ui",
  initialState: initialUI,
  reducers: {
    goToStep(state, action: PayloadAction<number>) {
      state.step = clampStep(action.payload);
    },
    next(state) {
      state.step = clampStep(state.step + 1);
    },
    prev(state) {
      state.step = clampStep(state.step - 1);
    }
  }
});

const formSlice = createSlice({
  name: "form",
  initialState: initialForm,
  reducers: {
    patchForm(state, action: PayloadAction<Partial<ContractFormData>>) {
      return { ...state, ...action.payload };
    },
    resetForm() {
      return initialForm;
    }
  }
});

export const rootReducer = combineReducers({
  ui: uiSlice.reducer,
  form: formSlice.reducer
});

// Tipos do estado raiz (antes do persist)
export type RootState = ReturnType<typeof rootReducer>;

// Persist configurado com tipo do RootState
const persistConfig = {
  key: "voia-contracts",
  storage,
  whitelist: ["form"] as (keyof RootState)[]
};

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

// Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (gDM) => gDM({ serializableCheck: false })
});

export const persistor = persistStore(store);

// Actions
export const { next, prev, goToStep } = uiSlice.actions;
export const { patchForm, resetForm } = formSlice.actions;

// Tipos públicos
export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
