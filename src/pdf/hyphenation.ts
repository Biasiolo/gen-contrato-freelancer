// src/pdf/hyphenation.ts
import { Font } from "@react-pdf/renderer";
import Hypher from "hypher";
import pt from "hyphenation.pt";

const h = new Hypher(pt);

// Hifenização em pt-BR; evita hifenizar URLs e palavras muito curtas
Font.registerHyphenationCallback((word: string) => {
    if (word.length <= 4) return [word];
    if (/^https?:\/\//i.test(word) || /@/.test(word)) return [word];
    return h.hyphenate(word);
});

export { };
