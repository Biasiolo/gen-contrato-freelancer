// src/templates/termos.ts
import type { TermoTemplates } from "@/types/termos";

const termosTemplates: TermoTemplates = {
  version: "1.0.0",
  base: {
    // === RECEBIMENTO / RESPONSABILIDADE (multi-itens) ===
    recebimento: `
Pelo presente termo de recebimento, responsabilidade, guarda e uso de equipamento(s)/item(ns),
eu {{EMP_NOME}}, inscrito(a) no CPF {{EMP_CPF}}{{EMP_RG_OPT}}, empregado(a) na função de {{EMP_FUNCAO_OPT}},
declaro ter ciência das obrigações abaixo estabelecidas:

1) Este termo tem por objetivo regular o uso do(s) equipamento(s)/item(ns) adiante descrito(s), que recebo da
{{EMPRESA_RAZAO}}, CNPJ {{EMPRESA_CNPJ}}, em perfeito estado de funcionamento.

Itens recebidos ({{EQUIP_QTD}}):
{{EQUIP_LISTA_TXT}}

2) Declaro que o(s) equipamento(s)/item(ns) será(ão) utilizado(s) EXCLUSIVAMENTE para fins profissionais,
nas atividades realizadas durante a jornada de trabalho;

3) Autorizo a empresa a efetuar, quando aplicável e conforme legislação vigente e políticas internas,
descontos correspondentes ao valor do(s) equipamento(s)/item(ns) em caso de perda, dano decorrente de uso
indevido ou má conservação, reconhecendo minha responsabilidade por seu uso e zelo;

4) Declaro estar ciente de que o(s) equipamento(s)/item(ns) é(são) de propriedade da empresa,
comprometendo-me a devolvê-lo(s), nas mesmas condições do recebimento (salvo desgaste natural),
em caso de transferência, desligamento ou quando sua utilização se tornar desnecessária;

5) É terminantemente proibido o aluguel, venda, empréstimo ou cessão do(s) equipamento(s)/item(ns) a terceiros.

{{LOCAL}}, {{DATA_BR}}.

`,

    // === DEVOLUÇÃO (multi-itens) ===
    devolucao: `
Eu, {{EMP_NOME}}, inscrito(a) no CPF {{EMP_CPF}}{{EMP_RG_OPT}}, residente e domiciliado(a) no endereço:
{{EMP_ENDERECO_OPT}}, declaro ter DEVOLVIDO à {{EMPRESA_RAZAO}} (CNPJ {{EMPRESA_CNPJ}})
o(s) seguinte(s) equipamento(s)/item(ns), {{CONDICOES_OPT}}

Itens devolvidos ({{EQUIP_QTD}}):
{{EQUIP_LISTA_TXT}}

Declaro que o equipamento foi utilizado EXCLUSIVAMENTE para fins profissionais, nas atividades realizadas durante a jornada de trabalho; 
Estou ciente da obrigação de devolução dos mesmos em perfeitas condições de funcionamento, após a descontinuação do contrato com a VOIA AGENCY. 

{{OBSERVACOES_OPT}}

{{LOCAL}}, {{DATA_BR}}.
`
  }
};

export default termosTemplates;
