// src/App.jsx
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import StepCliente from './components/StepCliente';
import StepServicos from './components/StepServicos';
import StepPrazo from './components/StepPrazo';
import StepCondicoes from './components/StepCondicoes';
import StepDetalhes from './components/StepDetalhes';
import StepPreview from './components/StepPreview';
import PrintView from './components/PrintView';
import './index.css';

function App() {
  const [step, setStep] = useState(1);
  const [clientData, setClientData] = useState({ name: '', company: '', email: '', phone: '' });

  const handleClientChange = (field, value) =>
    setClientData(prev => ({ ...prev, [field]: value }));

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="min-h-screen bg-gray-100 py-10">
          {/* ProgressBar could go here */}

          {step === 1 && (
            <StepCliente
              data={clientData}
              onChange={handleClientChange}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <StepServicos
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <StepPrazo
              onBack={() => setStep(2)}
              onNext={() => setStep(4)}
            />
          )}

          {step === 4 && (
            <StepCondicoes
              onBack={() => setStep(3)}
              onNext={() => setStep(5)}
            />
          )}

          {step === 5 && (
            <StepDetalhes
              onBack={() => setStep(4)}
              onNext={() => setStep(6)}
            />
          )}

          {step === 6 && (
            <StepPreview
              onBack={() => setStep(5)}
              onNext={() => setStep(7)}
            />
          )}

          {step === 7 && (
            <PrintView
              onBack={() => setStep(6)}
            />
          )}

        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
