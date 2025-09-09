import { TermoTemplates } from "@/types/termos";

const termos: TermoTemplates = {
  version: "1.0.0",
  base: {
    recebimento: `
TERMO DE RESPONSABILIDADE E RECEBIMENTO DE EQUIPAMENTOS

Pelo presente instrumento, {{EMP_NOME}}, CPF {{EMP_CPF}}{{EMP_RG_OPT}}, exercendo a função de {{EMP_FUNCAO_OPT}}, doravante denominado(a) "COLABORADOR(A)", declara ter recebido de {{EMPRESA_RAZAO}} (CNPJ {{EMPRESA_CNPJ}}), doravante denominada "EMPRESA", o(s) equipamento(s) e acessórios abaixo descritos, em perfeitas condições de uso:

• Tipo: {{EQUIP_TIPO_LABEL}}
• Marca: {{ITEM_MARCA_OPT}}
• Modelo: {{ITEM_MODELO_OPT}}
• Cor: {{ITEM_COR_OPT}}
• Nº de Série/ID: {{ITEM_SERIE_ID_OPT}}
• Acessórios: {{ITEM_ACESSORIOS_OPT}}
• Condições na entrega: {{CONDICOES_OPT}}

O(A) COLABORADOR(A) se compromete a:
1) zelar pelo bom uso e conservação dos bens, utilizando-os exclusivamente para fins laborais;
2) não ceder, emprestar, alienar, modificar ou remover quaisquer identificações dos bens;
3) comunicar imediatamente à EMPRESA qualquer dano, extravio, furto ou roubo, apresentando boletim de ocorrência quando cabível;
4) permitir auditorias/inspeções técnicas quando solicitadas;
5) devolver o(s) bem(ns) quando solicitado(s) pela EMPRESA ou no término do vínculo, em condições equivalentes às recebidas, ressalvado desgaste natural.

Eventuais danos decorrentes de mau uso, descuido ou extravio poderão ser imputados ao(à) COLABORADOR(A), observada a legislação vigente. {{OBSERVACOES_OPT}}

Local e data: {{LOCAL}}, {{DATA_BR}}.
`,
    devolucao: `
TERMO DE DEVOLUÇÃO DE EQUIPAMENTOS

Pelo presente instrumento, {{EMP_NOME}}, CPF {{EMP_CPF}}{{EMP_RG_OPT}}, declara que devolveu à {{EMPRESA_RAZAO}} (CNPJ {{EMPRESA_CNPJ}}) o(s) equipamento(s) e acessórios abaixo descritos:

• Tipo: {{EQUIP_TIPO_LABEL}}
• Marca: {{ITEM_MARCA_OPT}}
• Modelo: {{ITEM_MODELO_OPT}}
• Cor: {{ITEM_COR_OPT}}
• Nº de Série/ID: {{ITEM_SERIE_ID_OPT}}
• Acessórios devolvidos: {{ITEM_ACESSORIOS_OPT}}
• Condições na devolução: {{CONDICOES_OPT}}

As partes dão-se por cientes da devolução, ficando o(a) COLABORADOR(A) responsável por responder por vícios ocultos apurados em inspeção técnica realizada em até 5 (cinco) dias úteis. {{OBSERVACOES_OPT}}

Local e data: {{LOCAL}}, {{DATA_BR}}.
`,
  },
};

export default termos;
