// src/types/contracts.ts

export type MoneyLike = number | string;

export type BaseTemplate = {
  cabecalho: string;
  identificacaoPartes: string;

  // Objeto + parágrafos (ex.: serviços adicionais, autonomia)
  objeto: string;
  objetoParagrafos?: string[];     // << NOVO

  // Vigência e pagamento
  vigencia: string;
  pagamento: string;

  // Listas e textos gerais
  obrigacoesContratada?: string[];   // << NOVO
  obrigacoesContratante?: string[];  // << NOVO
  forcaMaior?: string;               // << NOVO
  confidencialidadeLgpd: string;
  usoImagemVoz?: string;             // << NOVO
  propriedadeIntelectual: string;
  naoConcorrencia: string;
  rescisao: string;
  extincao?: string[];               // << NOVO
  multa?: string;                    // << NOVO
  disposicoesGerais?: string[];      // << NOVO

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

export type PredefinedServiceTemplate = {
  titulo: string;
  escopo: string[]; // itens de escopo exibidos como lista
  parametros?: Record<string, unknown>;
  clausulasEspecificas?: string[]; // cláusulas que entram após as bases
};

export type CustomServiceTemplate = {
  // estes campos são preenchidos pelo admin no modo "em branco"
  titulo: "{{SERVICO_CUSTOM_TITULO}}";
  escopo: "{{SERVICO_CUSTOM_ESCOPO_RICH}}"; // texto rico/markdown
  parametros?: Record<string, unknown>;
  clausulasEspecificas?: "{{SERVICO_CUSTOM_CLAUSULAS_RICH}}"; // texto rico/markdown
};

export type ServiceTemplate = PredefinedServiceTemplate | CustomServiceTemplate;

export type DistratoTemplate = {
  titulo: string;
  clausulas: Record<string, string>; // chave -> texto com placeholders
};

export type ContractTemplates = {
  version: string;
  base: BaseTemplate;
  servicos: Record<ServiceKey, ServiceTemplate>;
  distrato: DistratoTemplate;
};

// Dados coletados no formulário (wizard)
export type ContractFormData = {
  // partes
  contratanteRazao: string;
  contratanteCnpj: string;
  contratanteEndereco: string;

  contratanteRepresentanteNome: string;
  contratanteRepresentanteCpf: string;

  prestadorNome: string;
  prestadorCpf: string;
  prestadorRg?: string;
  prestadorEmail: string;
  prestadorTelefone?: string;

  // 🔽 Endereço granular do prestador (NOVO)
  prestadorEnderecoLogradouro?: string;
  prestadorEnderecoNumero?: string;
  prestadorEnderecoBairro?: string;
  prestadorEnderecoCidade?: string;
  prestadorEnderecoUf?: string;

  // (compat/fallback)
  prestadorEndereco: string;

  // parâmetros gerais
  dataInicio: string;
  dataFim?: string;
  valorTotal: MoneyLike;
  formaPagamento: "PIX" | "Transferência" | "Boleto" | "Outro";
  diaVencimento?: string;
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
  dataDistrato?: string;
  valorAcerto?: MoneyLike;
  prazoDevolucao?: string;
  dataAcerto?: string;
};