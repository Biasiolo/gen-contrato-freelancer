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
    setClientField(state, action) {
      const { field, value } = action.payload;
      state.client[field] = value;
    },
    addService(state, action) {
      // action.payload = { id, title, description, isMonthly, qty, unitValue }
      state.services.push(action.payload);
    },
    updateService(state, action) {
      // action.payload = { id, changes: { qty?, unitValue? } }
      const { id, changes } = action.payload;
      const i = state.services.findIndex(s => s.id === id);
      if (i !== -1) {
        state.services[i] = { ...state.services[i], ...changes };
      }
    },
    removeService(state, action) {
      const id = action.payload;
      state.services = state.services.filter(s => s.id !== id);
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
  addService,
  updateService,
  removeService,
  setTerm,
  setPaymentConditions,
  setDetails,
  resetProposal
} = proposalSlice.actions;

export default proposalSlice.reducer;
