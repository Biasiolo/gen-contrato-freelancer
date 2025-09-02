// src/types/externals.d.ts
declare module "hypher" {
  export default class Hypher {
    constructor(patterns: any);
    hyphenate(word: string): string[];
    hyphenateText?(text: string): string;
  }
}

declare module "hyphenation.pt" {
  const patterns: any;
  export default patterns;
}
