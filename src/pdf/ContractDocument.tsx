// /src/pdf/ContractDocument.tsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ContractFormData, ContractTemplates, ServiceTemplate } from "@/types/contracts";
import { interpolate } from "@/utils/mergePlaceholders";
import Watermark from "./Watermark";
import Footer, { FOOTER_HEIGHT } from "./Footer";

type Props = {
  form: ContractFormData;
  templates: ContractTemplates;
  service: ServiceTemplate | null;
  map: Record<string, unknown>;
};

const styles = StyleSheet.create({
  page: {
    padding: 32,
    paddingBottom: FOOTER_HEIGHT + 24,
    fontSize: 11,
    lineHeight: 1.4,
    fontFamily: "Helvetica",
  },
  h1: { fontSize: 14, textAlign: "center", marginBottom: 20, fontWeight: 700 },
  h2: { fontSize: 12, marginTop: 10, marginBottom: 6, fontWeight: 700 },
  p: { marginBottom: 6, textAlign: "justify" },
  li: { marginLeft: 12, marginBottom: 4 },
  signBlock: { marginTop: 36, flexDirection: "row", justifyContent: "space-between" },
  signCol: { width: "48%" },
  signLine: { marginTop: 28, borderTopWidth: 1, borderTopColor: "#000", borderTopStyle: "solid", paddingTop: 4, textAlign: "center" },
  meta: { fontSize: 9, textAlign: "center", color: "#444", marginTop: 2 },
  witnessCol: { width: "48%" },
});

function List({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return (
    <View style={{ marginTop: 2, marginBottom: 6 }}>
      {items.map((it, i) => (
        <Text key={i} style={styles.li}>• {it}</Text>
      ))}
    </View>
  );
}

export default function ContractDocument({ form, templates, service, map }: Props) {
  const b = templates.base;
  const s: any = service || {};

  // strings e listas interpoladas
  const identificacao = interpolate(b.identificacaoPartes, map);
  const objeto = interpolate(b.objeto, map);
  const objetoParagrafos = (b.objetoParagrafos || []).map((t) => interpolate(t, map));

  const vigencia = interpolate(b.vigencia, map);
  const pagamento = interpolate(b.pagamento, map);

  const obrigacoesContratada = (b.obrigacoesContratada || []).map((t) => interpolate(t, map));
  const obrigacoesContratante = (b.obrigacoesContratante || []).map((t) => interpolate(t, map));

  const forcaMaior = b.forcaMaior ? interpolate(b.forcaMaior, map) : null;
  const confidencialidade = interpolate(b.confidencialidadeLgpd, map);
  const usoImagemVoz = b.usoImagemVoz ? interpolate(b.usoImagemVoz, map) : null;
  const propriedadeIntelectual = interpolate(b.propriedadeIntelectual, map);
  const naoConcorrencia = interpolate(b.naoConcorrencia, map);
  const rescisao = interpolate(b.rescisao, map);

  const extincao = (b.extincao || []).map((t) => interpolate(t, map));
  const multa = b.multa ? interpolate(b.multa, map) : null;
  const disposicoesGerais = (b.disposicoesGerais || []).map((t) => interpolate(t, map));
  const foro = interpolate(b.foro, map);

  // ===== Escopo do serviço =====
  // Novo: seções numeradas (escopoSecoes)
  const escopoSecoes: Array<{ titulo: string; itens: string[] }> =
    Array.isArray(s?.escopoSecoes)
      ? s.escopoSecoes.map((sec: any) => ({
          titulo: interpolate(sec.titulo, map),
          itens: (sec.itens || []).map((i: string) => interpolate(i, map)),
        }))
      : [];

  // Fallback antigo: lista simples (escopo)
  const escopoList: string[] =
    typeof s?.escopo === "string"
      ? [interpolate(s.escopo, map)]
      : Array.isArray(s?.escopo)
      ? s.escopo.map((t: string) => interpolate(t, map))
      : [];

  // Cláusulas específicas do serviço
  const especificasList: string[] =
    typeof s?.clausulasEspecificas === "string"
      ? [interpolate(s.clausulasEspecificas, map)]
      : Array.isArray(s?.clausulasEspecificas)
      ? s.clausulasEspecificas.map((t: string) => interpolate(t, map))
      : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Watermark />

        {/* Cabeçalho */}
        <Text style={styles.h1}>{interpolate(b.cabecalho, map)}</Text>

        {/* Identificação das partes */}
        <Text style={styles.p}>{identificacao}</Text>

        {/* Objeto */}
        <Text style={styles.h2}>Cláusula 1ª — DO OBJETO</Text>
        <Text style={styles.p}>{objeto}</Text>
        {objetoParagrafos.map((p, i) => (
          <Text key={i} style={styles.p}>{p}</Text>
        ))}

        {/* Escopo do serviço */}
        {(escopoSecoes.length > 0 || escopoList.length > 0) && (
          <>
            <Text style={styles.h2}>Escopo do Serviço</Text>

            {/* Preferência: seções numeradas */}
            {escopoSecoes.length > 0 ? (
              <View style={{ marginTop: 2 }}>
                {escopoSecoes.map((sec, idx) => (
                  <View key={idx} style={{ marginBottom: 8 }}>
                    <Text style={{ ...styles.p, fontWeight: 700 }}>
                      {idx + 1} {sec.titulo}
                    </Text>
                    {sec.itens.map((it, i) => (
                      <Text key={i} style={styles.li}>- {it}</Text>
                    ))}
                  </View>
                ))}
              </View>
            ) : (
              // Fallback: lista simples antiga
              <List items={escopoList} />
            )}
          </>
        )}

        {/* Vigência */}
        <Text style={styles.h2}>Cláusula 2ª — DA VIGÊNCIA</Text>
        <Text style={styles.p}>{vigencia}</Text>

        {/* Pagamento */}
        <Text style={styles.h2}>Cláusula 3ª — DO PAGAMENTO</Text>
        <Text style={styles.p}>{pagamento}</Text>

        {/* Obrigações da Contratada */}
        {obrigacoesContratada.length > 0 && (
          <>
            <Text style={styles.h2}>Cláusula 4ª — DAS OBRIGAÇÕES DA CONTRATADA</Text>
            <List items={obrigacoesContratada} />
          </>
        )}

        {/* Obrigações da Contratante */}
        {obrigacoesContratante.length > 0 && (
          <>
            <Text style={styles.h2}>Cláusula 5ª — DAS OBRIGAÇÕES DA CONTRATANTE</Text>
            <List items={obrigacoesContratante} />
          </>
        )}

        {/* Caso fortuito e força maior */}
        {forcaMaior && (
          <>
            <Text style={styles.h2}>Cláusula 6ª — DO CASO FORTUITO E FORÇA MAIOR</Text>
            <Text style={styles.p}>{forcaMaior}</Text>
          </>
        )}

        {/* Confidencialidade / LGPD */}
        <Text style={styles.h2}>Cláusula 7ª — DA CONFIDENCIALIDADE E PROTEÇÃO DE DADOS</Text>
        <Text style={styles.p}>{confidencialidade}</Text>

        {/* Uso de imagem e voz */}
        {usoImagemVoz && (
          <>
            <Text style={styles.h2}>Cláusula 8ª — DA AUTORIZAÇÃO DE USO DE IMAGEM E VOZ</Text>
            <Text style={styles.p}>{usoImagemVoz}</Text>
          </>
        )}

        {/* Propriedade Intelectual */}
        <Text style={styles.h2}>Cláusula 9ª — DOS DIREITOS DE PROPRIEDADE INTELECTUAL</Text>
        <Text style={styles.p}>{propriedadeIntelectual}</Text>

        {/* Não concorrência */}
        <Text style={styles.h2}>Cláusula 10ª — NÃO CONCORRÊNCIA</Text>
        <Text style={styles.p}>{naoConcorrencia}</Text>

        {/* Rescisão */}
        <Text style={styles.h2}>Cláusula 11ª — DA RESCISÃO</Text>
        <Text style={styles.p}>{rescisao}</Text>

        {/* Extinção */}
        {extincao.length > 0 && (
          <>
            <Text style={styles.h2}>Cláusula 12ª — DA EXTINÇÃO</Text>
            <List items={extincao} />
          </>
        )}

        {/* Multa */}
        {multa && (
          <>
            <Text style={styles.h2}>Cláusula 13ª — DA MULTA</Text>
            <Text style={styles.p}>{multa}</Text>
          </>
        )}

        {/* Disposições gerais */}
        {disposicoesGerais.length > 0 && (
          <>
            <Text style={styles.h2}>Cláusula 14ª — DAS DISPOSIÇÕES GERAIS</Text>
            <List items={disposicoesGerais} />
          </>
        )}

        {/* Cláusulas específicas do serviço */}
        {especificasList.length > 0 && (
          <>
            <Text style={styles.h2}>Cláusulas Específicas do Serviço</Text>
            <List items={especificasList} />
          </>
        )}

        {/* Foro */}
        <Text style={styles.h2}>Cláusula 15ª — DO FORO</Text>
        <Text style={styles.p}>{foro}</Text>

        {/* Assinaturas */}
        <View style={styles.signBlock}>
          {/* CONTRATANTE */}
          <View style={styles.signCol}>
            <Text style={styles.signLine}> </Text>
            <Text style={{ textAlign: "center", fontWeight: 700 }}>{form.contratanteRazao}</Text>
            <Text style={styles.meta}>CNPJ: {form.contratanteCnpj}</Text>
            <Text style={styles.meta}>
              Representante: {form.contratanteRepresentanteNome} — CPF {form.contratanteRepresentanteCpf}
            </Text>
            <Text style={{ textAlign: "center", marginTop: 4 }}>CONTRATANTE</Text>
          </View>

          {/* CONTRATADA */}
          <View style={styles.signCol}>
            <Text style={styles.signLine}> </Text>
            <Text style={{ textAlign: "center", fontWeight: 700 }}>{form.prestadorNome}</Text>
            <Text style={styles.meta}>
              CPF: {form.prestadorCpf}{form.prestadorRg ? ` — RG ${form.prestadorRg}` : ""}
            </Text>
            <Text style={{ textAlign: "center", marginTop: 4 }}>CONTRATADA</Text>
          </View>
        </View>

        {/* Testemunhas */}
        <View style={{ marginTop: 24, flexDirection: "row", justifyContent: "space-between" }}>
          <View style={styles.witnessCol}>
            <Text style={styles.signLine}> </Text>
            <Text style={{ textAlign: "center" }}>Testemunha 1</Text>
            <Text style={styles.meta}>Nome: ________________________________</Text>
            <Text style={styles.meta}>CPF: ___ . ___ . ___ - __</Text>
          </View>

          <View style={styles.witnessCol}>
            <Text style={styles.signLine}> </Text>
            <Text style={{ textAlign: "center" }}>Testemunha 2</Text>
            <Text style={styles.meta}>Nome: ________________________________</Text>
            <Text style={styles.meta}>CPF: ___ . ___ . ___ - __</Text>
          </View>
        </View>

        <Footer />
      </Page>
    </Document>
  );
}
