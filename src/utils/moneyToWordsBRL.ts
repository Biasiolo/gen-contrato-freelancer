// src/utils/moneyToWordsBRL.ts
import extenso from "extenso";

export const brlPorExtenso = (
  input: string | number | undefined | null
): string => {
  if (input === undefined || input === null || input === "") return "";
  let valor: number;

  if (typeof input === "number") {
    valor = input;
  } else {
    // aceita "6.645,00", "6645,00", "R$ 6.645,00", etc.
    const norm = input.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
    valor = Number(norm) || 0;
  }

  // "seis mil, seiscentos e quarenta e cinco reais e..."
  return extenso(valor, { mode: "currency" }) as unknown as string;
};

export default brlPorExtenso; // ✅ export default + nomeado
