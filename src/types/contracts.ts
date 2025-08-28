// src/types/contracts.ts

export type MoneyLike = number | string;

/** Estrutura base do contrato (cláusulas comuns) */
export type BaseTemplate = {
  cabecalho: string;
  identificacaoPartes: string;

  // Objeto + parágrafos (ex.: serviços adicionais, autonomia)
  objeto: string;
  objetoParagrafos?: string[];

  // Vigência e pagamento
  vigencia: string;
  pagamento: string;

  // Listas e textos gerais
  obrigacoesContratada?: string[];
  obrigacoesContratante?: string[];
  forcaMaior?: string;
  confidencialidadeLgpd: string;
  usoImagemVoz?: string;
  propriedadeIntelectual: string;
  naoConcorrencia: string;
  rescisao: string;
  extincao?: string[];
  multa?: string;
  disposicoesGerais?: string[];

  foro: string;
};

export type ServiceKey =
  | "web_designer"
  | "designer"
  | "copywriter"
  | "rh"
  | "assistente_adm"
  | "vendas"
  | "social_media"
  | "trafego_pago"
  | "video"
  | "custom";

/** Seção numerada do escopo (opcional para serviços pré-definidos) */
export type EscopoSecao = {
  titulo: string;
  itens: string[];
};

/** Template de serviço pré-definido (padrão) */
export type PredefinedServiceTemplate = {
  titulo: string;

  /**
   * Escopo simples (lista de itens) — compat com versão antiga
   * Pode ser string[] (lista) ou string (texto único já interpolado).
   * Tornado opcional para permitir uso exclusivo de `escopoSecoes`.
   */
  escopo?: string[] | string;

  /**
   * Escopo em seções numeradas (novo)
   * Se presente, o PDF prioriza este formato (1. Título + itens com “-”).
   */
  escopoSecoes?: EscopoSecao[];

  parametros?: Record<string, unknown>;
  clausulasEspecificas?: string[] | string;
};

/** Template de serviço custom (campos livres via placeholders) */
export type CustomServiceTemplate = {
  titulo: "{{SERVICO_CUSTOM_TITULO}}";
  escopo: "{{SERVICO_CUSTOM_ESCOPO_RICH}}"; // texto rico/markdown
  parametros?: Record<string, unknown>;
  clausulasEspecificas?: "{{SERVICO_CUSTOM_CLAUSULAS_RICH}}"; // texto rico/markdown
};

export type ServiceTemplate = PredefinedServiceTemplate | CustomServiceTemplate;

/** Template de Distrato */
export type DistratoTemplate = {
  titulo: string;
  clausulas: Record<string, string>; // chave -> texto com placeholders
};

/** Conjunto completo de templates */
export type ContractTemplates = {
  version: string;
  base: BaseTemplate;
  servicos: Record<ServiceKey, ServiceTemplate>;
  distrato: DistratoTemplate;
};

/** Dados coletados no formulário (wizard) */
export type ContractFormData = {
  // partes (contratante fixo)
  contratanteRazao: string;
  contratanteCnpj: string;
  contratanteEndereco: string;

  contratanteRepresentanteNome: string;
  contratanteRepresentanteCpf: string;

  // prestador
  prestadorNome: string;
  prestadorCpf: string;
  prestadorRg?: string;
  prestadorEmail: string;
  prestadorTelefone?: string;

  // Endereço granular do prestador
  prestadorEnderecoLogradouro?: string;
  prestadorEnderecoNumero?: string;
  prestadorEnderecoBairro?: string;
  prestadorEnderecoCidade?: string;
  prestadorEnderecoUf?: string;
  prestadorEnderecoCep?: string;

  // (compat/fallback)
  prestadorEndereco: string;

  // parâmetros gerais
  dataInicio: string;
  dataFim?: string;
  valorTotal: string; // mantido como string para integração com máscara
  formaPagamento: "PIX" | "Transferência" | "Boleto" | "Outro";
  diaVencimento?: string; // YYYY-MM-DD na UI; formatado no buildMap
  banco?: string;
  agencia?: string;
  conta?: string;
  pix?: string;

  foroCidade: string;
  foroUf: string;

  // escolha do documento
  tipoDocumento: "contrato" | "distrato";

  // serviço
  servicoChave?: ServiceKey;
  servicoCustomTitulo?: string;
  servicoCustomEscopo?: string;
  servicoCustomClausulas?: string;

  params?: Record<string, unknown>;

  // distrato
  dataDistrato?: string; // Data do contrato original
  valorAcerto?: MoneyLike;
  prazoDevolucao?: string;
  dataAcerto?: string; // Data de pagamento
};
