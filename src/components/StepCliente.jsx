import React from 'react';

const StepCliente = ({ data, onChange, onNext }) => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Informações do Cliente</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-1">Nome do Contato</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
            placeholder="Nome completo"
            value={data.name}
            onChange={e => onChange('name', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Empresa</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
            placeholder="Nome da empresa"
            value={data.company}
            onChange={e => onChange('company', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
            placeholder="email@exemplo.com"
            value={data.email}
            onChange={e => onChange('email', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Telefone</label>
          <input
            type="tel"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"
            placeholder="(00) 00000-0000"
            value={data.phone}
            onChange={e => onChange('phone', e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={onNext}
          className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
        >
          Continuar &rarr;
        </button>
      </div>
    </div>
  );
};

export default StepCliente;