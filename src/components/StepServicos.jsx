// src/components/StepServicos.jsx
import React, { useEffect, useState } from 'react';
import servicesCatalog from '../data/services.json';
import { useDispatch, useSelector } from 'react-redux';
import { addService, updateService, removeService } from '../store/slices/proposalSlice';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const StepServicos = ({ onBack, onNext }) => {
  const dispatch = useDispatch();
  const selectedServices = useSelector(state => state.proposal.services);

  const serviceTypes = servicesCatalog.serviceTypes;
  const totalTypes = serviceTypes.length;
  const [typeIndex, setTypeIndex] = useState(0);
  const currentType = serviceTypes[typeIndex];
  const [services, setServices] = useState([]);

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
    setServices(updated);
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

  const handlePrev = () => {
    if (typeIndex > 0) setTypeIndex(typeIndex - 1);
    else onBack();
  };

  const handleNext = () => {
    if (typeIndex < totalTypes - 1) setTypeIndex(typeIndex + 1);
    else onNext();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-stone-950 to-black pt-20">
      <div className="relative max-w-4xl w-full mx-auto p-6">
        <div className="relative backdrop-blur-sm bg-neutral-200 bg-opacity-10 rounded-2xl shadow-2xl border border-white border-opacity-20 p-10 overflow-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
            {currentType.name}
          </h2>
          <p className="text-neutral-500 text-center mb-6">
            {typeIndex + 1}/{totalTypes}
          </p>

          <div className="space-y-4">
            {services.map(svc => (
              <div
                key={svc.id}
                className="group flex items-center justify-between bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg p-4 transition hover:bg-opacity-20"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-600">{svc.title}</h3>
                  <p className="text-neutral-400 w-80">{svc.description}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={svc.selected}
                    onChange={() => toggleSelect(svc)}
                    className="w-5 h-5 text-teal-600 bg-neutral-800 border-neutral-600 rounded cursor-pointer"
                  />
                  {svc.selected && (
                    <>
                      <input
                        type="number"
                        min="1"
                        value={svc.qty}
                        onChange={e => changeQty(svc.id, Number(e.target.value))}
                        className="w-16 px-2 py-1 bg-neutral-900 text-white rounded-lg focus:ring-2 focus:ring-teal-600 border-none"
                      />
                      <input
                        type="number"
                        min="0"
                        value={svc.unitValue}
                        onChange={e => changeUnitValue(svc.id, Number(e.target.value))}
                        className="w-24 px-2 py-1 bg-neutral-900 text-white rounded-lg focus:ring-2 focus:ring-teal-600 border-none"
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={handlePrev}
              className="group relative flex items-center justify-center overflow-hidden cursor-pointer rounded-3xl bg-neutral-800 w-40 py-2 text-white shadow-lg transition-all hover:shadow-neutral-700/25"
            >
              <span className="relative z-10 mr-2 font-medium">
                {typeIndex > 0 ? 'Anterior' : 'Voltar'}
              </span>
              <ChevronLeft size={18} className="relative z-10" />
              <span className="absolute inset-0 h-full w-0 bg-gradient-to-r from-teal-600 to-teal-600 transition-all duration-300 ease-out group-hover:w-full" />
            </button>
            <button
              onClick={handleNext}
              className="group relative flex items-center justify-center overflow-hidden cursor-pointer rounded-3xl bg-gradient-to-r from-teal-600 to-teal-600 w-40 py-2 text-white shadow-lg transition-all hover:shadow-teal-500/25"
            >
              <span className="relative z-10 mr-2 font-medium">
                {typeIndex < totalTypes - 1 ? 'Próximo' : 'Continuar'}
              </span>
              <ChevronRight size={18} className="relative z-10" />
              <span className="absolute inset-0 h-full w-0 bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 ease-out group-hover:w-full" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepServicos;
