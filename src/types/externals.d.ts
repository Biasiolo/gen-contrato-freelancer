// src/types/externals.d.ts

// --- hypher ---
declare module "hypher" {
    export interface HyphenateTextOptions {
        hyphenChar?: string;        // caractere usado na hifenização (ex.: "-")
        minWordLength?: number;     // ignora palavras menores que isso
        minSubwordLength?: number;  // tamanho mínimo dos pedaços
    }

    export default class Hypher {
        constructor(patterns: any);
        hyphenate(word: string): string[];
        hyphenateText(text: string, options?: HyphenateTextOptions): string;
    }
}

// --- hyphenation.pt ---
declare module "hyphenation.pt" {
    const patterns: any; // objeto de padrões de hifenização (pt)
    export default patterns;
}

// --- extenso (valor por extenso) ---
declare module "extenso" {
    type Mode = "number" | "currency" | "ordinal";
    interface Options {
        mode?: Mode;
        locale?: string; // geralmente "pt"
        number?: { gender?: "m" | "f" };
        currency?: { currency?: string; ignoreZero?: boolean };
    }
    function extenso(value: number | string, options?: Options): string;
    export default extenso;
}
