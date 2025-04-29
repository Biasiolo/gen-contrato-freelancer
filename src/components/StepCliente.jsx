// src/components/StepCliente.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { setClientField } from '../store/slices/proposalSlice';
import { User, Building2, Mail, Phone, ChevronRight } from 'lucide-react';

const fields = [
  { key: 'name',    label: 'Nome do Contato', placeholder: 'Nome completo',      type: 'text',  icon: User      },
  { key: 'company', label: 'Empresa',         placeholder: 'Nome da empresa',     type: 'text',  icon: Building2 },
  { key: 'email',   label: 'Email',           placeholder: 'email@exemplo.com',  type: 'email', icon: Mail      },
  { key: 'phone',   label: 'Telefone',        placeholder: '(00) 00000-0000',    type: 'tel',   icon: Phone     },
];

const StepCliente = ({ data = {}, onChange, onNext }) => {
  const dispatch = useDispatch();
  const clientData = { name: '', company: '', email: '', phone: '', ...data };

  const handleChange = (key, value) => {
    if (typeof onChange === 'function') {
      onChange(key, value);
    }
  };

  const handleNext = () => {
    // Persiste cada campo no Redux
    Object.entries(clientData).forEach(([field, value]) => {
      dispatch(setClientField({ field, value }));
    });
    if (typeof onNext === 'function') {
      onNext();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-stone-950 to-black">
      <div className="relative max-w-4xl w-full mx-auto p-6">
        <div className="relative backdrop-blur-sm bg-neutral-200 bg-opacity-10 rounded-2xl shadow-2xl border border-white border-opacity-20 p-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-200 via-teal-600 to-teal-200" />

          <div className="mb-10">
            <h2 className="text-4xl font-extrabold text-black mb-2">Boas-Vindas</h2>
            <p className="text-neutral-500">
              Preencha os dados para começarmos a criar sua proposta personalizada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fields.map(field => {
              const Icon = field.icon;
              return (
                <div key={field.key} className="group">
                  <label className="flex items-center text-neutral-800 font-medium mb-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-teal-600 bg-opacity-50 rounded-lg mr-3 transition-colors group-hover:bg-orange-500">
                      <Icon size={16} className="text-neutral-200 transition-colors group-hover:text-white" />
                    </div>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    className="w-full px-5 py-4 bg-neutral-100 bg-opacity-20 rounded-xl text-neutral-900 placeholder-gray-300 placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all"
                    placeholder={field.placeholder}
                    value={clientData[field.key]}
                    onChange={e => handleChange(field.key, e.target.value)}
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex justify-between items-center">
            <div className="text-sm text-neutral-400 italic">
              Todos os dados são tratados com confidencialidade
            </div>
            <button
              onClick={handleNext}
              className="group relative flex items-center justify-center w-40 overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 to-teal-600 px-8 py-2 text-white shadow-lg transition-all hover:shadow-orange-400/25 cursor-pointer"
            >
              <span className="relative z-10 mr-2 font-medium">Continuar</span>
              <ChevronRight size={18} className="relative z-10" />
              <span className="absolute inset-0 h-full w-0 bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 ease-out group-hover:w-full" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepCliente;
