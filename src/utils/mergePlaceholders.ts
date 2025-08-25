// src/utils/mergePlaceholders.ts

type Dict = Record<string, unknown>;

const formatDate = (iso?: unknown) => {
  if (!iso || typeof iso !== "string") return "";
  // espera "YYYY-MM-DD"
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
};

const formatMoney = (value: unknown) => {
  if (value === undefined || value === null) return "";
  const n = typeof value === "string" ? Number(String(value).replace(",", ".")) : Number(value);
  if (Number.isFinite(n)) {
    return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).replace("R$", "").trim();
  }
  return String(value);
};

/**
 * Interpola placeholders {{CHAVE}} em uma string.
 * Suporta chaves especiais:
 *  - DATA_* => formata dd/mm/yyyy se vier como "yyyy-mm-dd"
 *  - VALOR_* => formata moeda pt-BR sem "R$" (prefixo tratado no texto)
 */
export function interpolate(template: string, map: Dict): string {
  if (!template) return "";

  return template.replace(/\{\{\s*([A-Z0-9_]+)\s*\}\}/g, (_, rawKey: string) => {
    const key = rawKey as keyof Dict;
    const value = map[key as string];

    if (value === undefined || value === null) return "";

    if (String(rawKey).startsWith("DATA_")) {
      return formatDate(value);
    }
    if (String(rawKey).startsWith("VALOR_")) {
      return formatMoney(value);
    }
    return String(value);
  });
}

/** Interpola arrays de strings (ex.: escopo) */
export function interpolateArray(items: string[] = [], map: Dict): string[] {
  return items.map((line) => interpolate(line, map)).filter(Boolean);
}

/** Interpola objeto de cláusulas { chave: "texto ..." } */
export function interpolateObject(obj: Record<string, string> = {}, map: Dict): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) out[k] = interpolate(v, map);
  return out;
}
