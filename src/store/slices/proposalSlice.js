// src/store/slices/proposalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  client: {
    name: '',
    company: '',
    email: '',
    phone: ''
  },
  services: [],
  term: 1, // meses
  paymentConditions: {
    method: '',
    entry: '',
    installments: 1,
    notes: ''
  },
  details: ''
};

const proposalSlice = createSlice({
  name: 'proposal',
  initialState,
  reducers: {
    // Atualiza um único campo do client
    setClientField(state, action) {
      const { field, value } = action.payload;
      state.client[field] = value;
    },
    // Atribui o objeto client inteiro (útil ao avançar na tela de cadastro)
    setClient(state, action) {
      state.client = action.payload;
    },
    addService(state, action) {
      state.services.push(action.payload);
    },
    updateService(state, action) {
      const { id, changes } = action.payload;
      const i = state.services.findIndex(s => s.id === id);
      if (i !== -1) {
        state.services[i] = { ...state.services[i], ...changes };
      }
    },
    removeService(state, action) {
      state.services = state.services.filter(s => s.id !== action.payload);
    },
    setTerm(state, action) {
      state.term = action.payload;
    },
    setPaymentConditions(state, action) {
      state.paymentConditions = { ...state.paymentConditions, ...action.payload };
    },
    setDetails(state, action) {
      state.details = action.payload;
    },
    resetProposal() {
      return initialState;
    }
  }
});

export const {
  setClientField,
  setClient,
  addService,
  updateService,
  removeService,
  setTerm,
  setPaymentConditions,
  setDetails,
  resetProposal
} = proposalSlice.actions;

export default proposalSlice.reducer;
