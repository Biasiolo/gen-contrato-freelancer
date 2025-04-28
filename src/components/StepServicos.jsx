// src/components/StepServicos.jsx
import React, { useEffect, useState } from 'react';
import servicesCatalog from '../data/services.json';
import { useDispatch, useSelector } from 'react-redux';
import { addService, updateService, removeService } from '../store/slices/proposalSlice';

const StepServicos = ({ onBack, onNext }) => {
  const dispatch = useDispatch();
  const selectedServices = useSelector(state => state.proposal.services);

  // Carousel index for service types
  const [typeIndex, setTypeIndex] = useState(0);
  const [services, setServices] = useState([]);

  const serviceTypes = servicesCatalog.serviceTypes;
  const totalTypes = serviceTypes.length;
  const currentType = serviceTypes[typeIndex];

  // Sync services for current type with Redux state
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
    if (svc.selected) {
      dispatch(removeService(svc.id));
    } else {
      dispatch(
        addService({
          id: svc.id,
          title: svc.title,
          description: svc.description,
          isMonthly: svc.isMonthly,
          qty: 1,
          unitValue: svc.defaultUnitValue,
          type: currentType.id
        })
      );
    }
  };

  const changeQty = (id, qty) => dispatch(updateService({ id, changes: { qty } }));
  const changeUnitValue = (id, val) => dispatch(updateService({ id, changes: { unitValue: val } }));

  // Navigation controls
  const handlePrev = () => {
    if (typeIndex > 0) setTypeIndex(typeIndex - 1);
    else onBack();
  };
  const handleNext = () => {
    if (typeIndex < totalTypes - 1) setTypeIndex(typeIndex + 1);
    else onNext();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Serviços: {currentType.name} ({typeIndex + 1}/{totalTypes})
      </h2>
      <div className="space-y-4">
        {services.map(svc => (
          <div key={svc.id} className="border p-4 rounded-lg flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{svc.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{svc.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={svc.selected}
                onChange={() => toggleSelect(svc)}
              />
              {svc.selected && (
                <>
                  <input
                    type="number"
                    min="1"
                    className="w-16 px-2 py-1 border rounded"
                    value={svc.qty}
                    onChange={e => changeQty(svc.id, Number(e.target.value))}
                  />
                  <input
                    type="number"
                    min="0"
                    className="w-24 px-2 py-1 border rounded"
                    value={svc.unitValue}
                    onChange={e => changeUnitValue(svc.id, Number(e.target.value))}
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
          className="px-6 py-2 bg-gray-300 rounded-full hover:bg-gray-400"
        >
          &larr; {typeIndex > 0 ? 'Anterior' : 'Voltar'}
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800"
        >
          {typeIndex < totalTypes - 1 ? 'Próximo' : 'Continuar'} &rarr;
        </button>
      </div>
    </div>
  );
};

export default StepServicos;
