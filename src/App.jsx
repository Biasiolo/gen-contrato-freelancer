import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import ProgressBar from './components/ProgressBar';
import StepCliente from './components/StepCliente';
import StepServicos from './components/StepServicos';
import StepPrazo from './components/StepPrazo';
import StepCondicoes from './components/StepCondicoes';
import StepDetalhes from './components/StepDetalhes';
import StepPreview from './components/StepPreview';
import StepApresentacao from './components/StepApresentacao';
import './index.css';

// Tela com fluxo das etapas
function WizardFlow() {
  const [step, setStep] = useState(1);
  const [clientData, setClientData] = useState({ name: '', company: '', email: '', phone: '' });

  const handleClientChange = (field, value) =>
    setClientData(prev => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen bg-gradient-to-r from-neutral-800 via-zinc-950 to-stone-800 ">

      <div className="no-print">
        {/* Passa onStepClick para habilitar navegação via ProgressBar */}
        <ProgressBar currentStep={step} onStepClick={setStep} />
      </div>

      <div className="pt-20 px-4">
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
          <StepApresentacao
            onBack={() => setStep(6)}
          />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/inicio" element={<WizardFlow />} />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  );
}

export default App;
