// src/templates/termos.ts
import { TermoTemplates } from "@/types/termos";

const termos: TermoTemplates = {
  version: "1.1.0-multiitem",
  base: {
    recebimento: `
TERMO DE RESPONSABILIDADE E RECEBIMENTO DE EQUIPAMENTOS

Pelo presente instrumento, a empresa {{EMPRESA_RAZAO}}, inscrita no CNPJ {{EMPRESA_CNPJ}}, doravante denominada EMPREGADORA, e o(a) colaborador(a) {{EMP_NOME}} (CPF {{EMP_CPF}}{{EMP_RG_OPT}}), função: {{EMP_FUNCAO_OPT}}, e-mail: {{EMP_EMAIL_OPT}}, telefone: {{EMP_TELEFONE_OPT}}, endereço: {{EMP_ENDERECO_OPT}}, ajustam e firmam o presente Termo, pelo qual o(a) colaborador(a) declara TER RECEBIDO {{EQUIP_QTD}} item(ns) de propriedade da EMPREGADORA, descritos a seguir:

{{EQUIP_LISTA_TXT}}

O(A) colaborador(a) declara:
• utilizar os itens exclusivamente para atividades profissionais, zelando por sua conservação e guarda;
• não ceder, emprestar, vender ou permitir uso por terceiros sem autorização;
• comunicar imediatamente qualquer dano, perda, furto ou roubo;
• responsabilizar-se por eventual negligência, mau uso, extravio ou dano não decorrente de desgaste natural.

Este Termo não transfere a propriedade dos itens, permanecendo esta com a EMPREGADORA, que poderá solicitar a devolução a qualquer tempo.

{{OBSERVACOES_OPT}}

Local e data: {{LOCAL}}, {{DATA_BR}}.
`,

    devolucao: `
TERMO DE DEVOLUÇÃO DE EQUIPAMENTOS

Pelo presente, {{EMP_NOME}} (CPF {{EMP_CPF}}{{EMP_RG_OPT}}), função: {{EMP_FUNCAO_OPT}}, declara DEVOLVER à {{EMPRESA_RAZAO}} (CNPJ {{EMPRESA_CNPJ}}) {{EQUIP_QTD}} item(ns) de sua propriedade, relacionados abaixo:

{{EQUIP_LISTA_TXT}}

O(A) colaborador(a) declara que:
• entregou os itens e respectivos acessórios descritos acima;
• informa eventuais avarias/condições no ato da devolução quando houver;
• está ciente de que eventuais perdas, danos ou avarias não decorrentes de uso regular poderão ser objeto de apuração e ressarcimento, conforme políticas internas e legislação aplicável.

{{OBSERVACOES_OPT}}

Local e data: {{LOCAL}}, {{DATA_BR}}.
`,
  },
};

export default termos;
