// src/utils/moneyToWordsBRL.ts
import extenso from "extenso";

// Converte string/number em { inteiros, centavos } de forma determinística
function toPartsBRL(input: string | number | null | undefined) {
  if (input === null || input === undefined || input === "") {
    return { inteiros: 0, centavos: 0 };
  }

  let s = typeof input === "number" ? input.toFixed(2) : String(input);
  // Mantém apenas dígitos, ponto e vírgula
  s = s.replace(/[^\d.,-]/g, "").replace(/-/g, ""); // sem sinal

  // Pega o ÚLTIMO separador (.,) como separador decimal
  const lastSep = Math.max(s.lastIndexOf(","), s.lastIndexOf("."));
  let intStr = "", centStr = "";

  if (lastSep >= 0) {
    intStr = s.slice(0, lastSep).replace(/\D/g, "") || "0";
    centStr = s.slice(lastSep + 1).replace(/\D/g, "");
  } else {
    intStr = s.replace(/\D/g, "") || "0";
    centStr = "";
  }

  // normaliza centavos para 2 dígitos
  centStr = (centStr + "00").slice(0, 2);

  const inteiros = parseInt(intStr, 10) || 0;
  const centavos = parseInt(centStr, 10) || 0;

  return { inteiros, centavos };
}

export function brlPorExtenso(input: string | number | null | undefined): string {
  const { inteiros, centavos } = toPartsBRL(input);

  const reaisTxt =
    inteiros === 0 ? "zero" : (extenso as any)(inteiros); // modo número padrão
  const realsLabel = inteiros === 1 ? "real" : "reais";

  if (centavos === 0) {
    return `${reaisTxt} ${realsLabel}`;
  }

  const centsTxt = (extenso as any)(centavos);
  const centsLabel = centavos === 1 ? "centavo" : "centavos";

  if (inteiros === 0) {
    return `${centsTxt} ${centsLabel}`;
  }
  return `${reaisTxt} ${realsLabel} e ${centsTxt} ${centsLabel}`;
}
