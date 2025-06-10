// Exporta tudo que o StepPreview e StepApresentacao precisam
export const formatCurrency = (v) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export function buildItems(services) {
  return services
    .map((svc) => {
      const term = svc.isMonthly ? svc.term || 1 : 1;
      const subtotal = svc.isMonthly
        ? svc.unitValue * svc.qty * term
        : svc.unitValue * svc.qty;
      return { ...svc, term, subtotal };
    })
    .sort((a, b) => b.subtotal - a.subtotal);
}

export function groupByType(items) {
  return items.reduce((acc, item) => {
    (acc[item.type] ||= []).push(item);
    return acc;
  }, {});
}

export function calcTypeTotals(grouped) {
  const totals = {};
  Object.entries(grouped).forEach(([type, list]) => {
    totals[type] = list.reduce((s, i) => s + i.subtotal, 0);
  });
  totals.overall = Object.values(totals).reduce((s, v) => s + v, 0);
  return totals;
}

function parseMoney(str) {
  return parseFloat(String(str || '').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
}

export function calcParcelasAgrupadas(grouped, totals, payment) {
  const map = {};
  Object.keys(grouped).forEach((type) => {
    const total = totals[type] || 0;
    const entrada = parseMoney(payment[type]?.entry);
    const parcelas = parseInt(payment[type]?.installments || 0, 10);
    const saldo = total - entrada;
    if (parcelas && saldo > 0) {
      const val = +(saldo / parcelas).toFixed(2);
      for (let i = 1; i <= parcelas; i++) map[i] = (map[i] || 0) + val;
    }
  });
  const nums = Object.keys(map).map(Number).sort((a, b) => a - b);
  if (!nums.length) return [];
  const grupos = [];
  let ini = nums[0], val = map[ini];
  for (let i = 1; i < nums.length; i++) {
    const n = nums[i];
    if (map[n] !== val || n !== nums[i - 1] + 1) {
      grupos.push({ de: ini, ate: nums[i - 1], valor: val });
      ini = n; val = map[n];
    }
  }
  grupos.push({ de: ini, ate: nums.at(-1), valor: val });
  return grupos;
}
