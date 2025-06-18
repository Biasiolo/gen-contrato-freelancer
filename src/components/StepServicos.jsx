// src/components/StepServicos.jsx
import React, { useEffect, useState } from 'react';
import servicesCatalog from '../data/services.json';
import { useDispatch, useSelector } from 'react-redux';
import { addService, updateService, removeService } from '../store/slices/proposalSlice';
import { nanoid } from 'nanoid';

const StepServicos = ({ onBack, onNext }) => {
  const dispatch = useDispatch();
  const selectedServices = useSelector(state => state.proposal.services);

  const serviceTypes = servicesCatalog.serviceTypes;
  const totalTypes = serviceTypes.length;
  const [typeIndex, setTypeIndex] = useState(0);
  const currentType = serviceTypes[typeIndex];
  const [services, setServices] = useState([]);

  const [customService, setCustomService] = useState({
    title: '',
    description: '',
    unitValue: '',
    isMonthly: false
  });

  const handleAddCustomService = () => {
    if (!customService.title || !customService.unitValue) return;

    dispatch(addService({
      id: `custom_${nanoid(6)}`,
      title: customService.title,
      description: customService.description,
      qty: 1,
      unitValue: parseCurrency(customService.unitValue),
      isMonthly: customService.isMonthly,
      type: currentType.id
    }));

    setCustomService({ title: '', description: '', unitValue: '', isMonthly: false });
  };

  useEffect(() => {
    const updated = currentType.services.map(svc => {
      const sel = selectedServices.find(item => item.id === svc.id);
      return {
        ...svc,
        selected: Boolean(sel),
        qty: sel ? sel.qty : 0,
        unitValue: sel ? sel.unitValue : svc.defaultUnitValue
      };
    });

    const customs = selectedServices.filter(item => item.type === currentType.id && item.id.startsWith('custom_'));
    const fullList = [...updated, ...customs.map(svc => ({ ...svc, selected: true }))];

    setServices(fullList);
  }, [currentType, selectedServices]);

  const toggleSelect = svc => {
    if (svc.selected) dispatch(removeService(svc.id));
    else dispatch(addService({
      id: svc.id,
      title: svc.title,
      description: svc.description,
      isMonthly: svc.isMonthly,
      qty: 1,
      unitValue: svc.defaultUnitValue,
      type: currentType.id
    }));
  };

  const changeQty = (id, qty) => dispatch(updateService({ id, changes: { qty } }));
  const changeUnitValue = (id, val) => dispatch(updateService({ id, changes: { unitValue: val } }));



  const parseCurrency = value => {
    const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  };

  const handlePrev = () => {
    if (typeIndex > 0) setTypeIndex(typeIndex - 1);
    else onBack();
  };

  const handleNext = () => {
    if (typeIndex < totalTypes - 1) {
      setTypeIndex(typeIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNext();
    }
  };

  return (
    <div className="flex items-center justify-center pt-0 sm:pt-12 pb-6 bg-transparent">
      <div className="relative w-full max-w-4xl mx-auto">
        <div className="relative backdrop-blur-[10px] bg-neutral-300/10 rounded-3xl p-12 overflow-hidden border border-gray-300/20 shadow-[inset_0_2px_2px_rgba(255,255,255,0.3),0_2px_8px_rgba(0,128,128,0.3)] ring-1 ring-white/10 transition-all">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-700 to-transparent opacity-60" />

          <h2 className="text-3xl sm:text-4xl text-center font-semibold text-orange-100 mb-2 rounded-t-3xl p-2">
            {currentType.name}
          </h2>
          <p className="text-orange-100 text-lg text-center mb-6">
            {typeIndex + 1} de {totalTypes}
          </p>

          <div className="space-y-4">
            {services.map(svc => (
              <div
                key={svc.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/10 border border-white/20 rounded-xl p-4 transition hover:bg-opacity-20"
              >
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">{svc.title}</h3>
                  <p className="text-orange-100 max-w-md text-sm sm:text-base">{svc.description}</p>
                </div>
                <div className="flex flex-row sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <label className="flex items-center gap-1 text-sm text-orange-100">
                    <input
                      type="checkbox"
                      checked={svc.selected}
                      onChange={() => toggleSelect(svc)}
                      className="w-6 h-5 text-teal-600 bg-neutral-800 border-neutral-600 rounded cursor-pointer"
                    />
                  </label>

                  {svc.selected && (
                    <>
                      <label className="flex flex-col text-xs text-orange-100">
                        Qtd
                        <input
                          type="number"
                          min="1"
                          value={svc.qty}
                          onChange={e => changeQty(svc.id, Number(e.target.value))}
                          className="w-20 px-2 py-1 bg-stone-200 bg-opacity-20 text-gray-900 rounded-lg focus:ring-2 focus:ring-teal-600 border-none"
                        />
                      </label>

                      <label className="flex flex-col text-xs text-orange-100">
                        Valor
                        <input
                          type="text"
                          inputMode="numeric"
                          value={`R$ ${svc.unitValue.toFixed(2).replace('.', ',')}`}
                          onChange={e => {
                            const onlyNumbers = e.target.value.replace(/[^\d]/g, '');
                            const value = parseFloat(onlyNumbers) / 100;
                            changeUnitValue(svc.id, value);
                          }}
                          className="w-28 px-2 py-1 bg-stone-200 bg-opacity-20 text-gray-900 rounded-lg focus:ring-2 focus:ring-teal-600 border-none"
                        />
                      </label>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-black/30 border border-teal-700/40 p-6 rounded-3xl space-y-4">
            <h3 className="text-lg font-semibold text-white">Adicionar Serviço Personalizado</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Título do serviço"
                value={customService.title}
                onChange={e => setCustomService({ ...customService, title: e.target.value })}
                className="px-3 py-2 rounded-xl bg-stone-200 bg-opacity-20 text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-teal-600"
              />
              <input
                type="text"
                placeholder="Descrição"
                value={customService.description}
                onChange={e => setCustomService({ ...customService, description: e.target.value })}
                className="px-3 py-2 rounded-xl bg-stone-200 bg-opacity-20 text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-teal-600"
              />
              <input
                type="text"
                placeholder="Valor (R$)"
                value={`R$ ${customService.unitValue}`}
                onChange={e => {
                  const onlyNumbers = e.target.value.replace(/[^\d]/g, '');
                  const formatted = (parseInt(onlyNumbers || '0') / 100).toFixed(2).replace('.', ',');
                  setCustomService({ ...customService, unitValue: formatted });
                }}
                className="px-3 py-2 rounded-xl bg-stone-200 bg-opacity-20 text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-teal-600"
              />
              <label className="flex items-center gap-2 text-orange-100">
                <input
                  type="checkbox"
                  checked={customService.isMonthly}
                  onChange={e => setCustomService({ ...customService, isMonthly: e.target.checked })}
                /> Mensal?
              </label>
            </div>
            <button
              onClick={handleAddCustomService}
              className=" cursor-pointer bg-teal-600/20 hover:bg-orange-500  text-white px-6 py-2 rounded-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_20px_rgba(0,128,128,0.2)] ring-2 ring-white/10 transition-all "
            >
              + Adicionar Serviço
            </button>
          </div>

          <div className="mt-10 flex flex-col md:flex-row justify-between gap-4">
            <button
              onClick={handlePrev}
              className="group relative flex items-center justify-center overflow-hidden cursor-pointer rounded-3xl bg-neutral-800/20 w-full md:w-40 py-2 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_20px_rgba(0,128,128,0.1)] ring-2 ring-white/10 transition-all hover:shadow-neutral-700/25"
            >
              <span className="relative z-10 font-medium">
                {typeIndex > 0 ? '◄ Anterior' : '◄ Voltar'}
              </span>
              <span className="absolute inset-y-0 right-0 h-full w-0 bg-gradient-to-r from-orange-600 to-orange-500 transition-all duration-300 ease-out group-hover:w-full" />
            </button>

            <button
              onClick={handleNext}
              className="group relative flex items-center justify-center overflow-hidden cursor-pointer rounded-3xl bg-teal-600/20 w-full md:w-40 py-2 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_20px_rgba(0,128,128,0.2)] ring-2 ring-white/10 transition-all hover:shadow-orange-400/25"
            >
              <span className="relative z-10 font-medium">
                {typeIndex < totalTypes - 1 ? 'Próximo ►' : 'Continuar ►'}
              </span>
              <span className="absolute inset-0 h-full w-0 bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 ease-out group-hover:w-full" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

};

export default StepServicos;
