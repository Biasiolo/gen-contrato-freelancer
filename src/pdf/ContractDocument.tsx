// /src/pdf/ContractDocument.tsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ContractFormData, ContractTemplates, ServiceTemplate } from "@/types/contracts";
import { interpolate } from "@/utils/mergePlaceholders";
import Watermark from "./Watermark";
import Footer, { FOOTER_HEIGHT } from "./Footer";
import "@/pdf/hyphenation";

type Props = {
  form: ContractFormData;
  templates: ContractTemplates;
  service: ServiceTemplate | null;
  map: Record<string, unknown>;
};

type EscopoSecao = {
  titulo?: string;
  itens: string[];
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
  signBlock: {
    marginTop: 36,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signCol: { width: "48%" },
  signLine: {
    marginTop: 28,
    borderTopWidth: 1,
    borderTopColor: "#000",
    borderTopStyle: "solid",
    paddingTop: 4,
    textAlign: "center",
  },
  meta: { fontSize: 9, textAlign: "center", color: "#444", marginTop: 2 },
  witnessBlock: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  witnessCol: { width: "48%" },
});

function cleanText(value?: string | null) {
  return (value ?? "").trim();
}

function cleanList(items?: Array<string | undefined | null>) {
  return (items || []).map((t) => cleanText(t)).filter(Boolean);
}

function List({ items }: { items?: string[] }) {
  const clean = cleanList(items);
  if (!clean.length) return null;

  return (
    <View style={{ marginTop: 2, marginBottom: 6 }} wrap>
      {clean.map((it, i) => (
        <Text key={i} style={styles.li}>
          • {it}
        </Text>
      ))}
    </View>
  );
}

export default function ContractDocument({ form, templates, service, map }: Props) {
  const b = templates.base;

  const isCustom = form.servicoChave === "custom";

  const s: any = isCustom
    ? {
        escopo: form.servicoCustomEscopo,
        escopoSecoes: form.servicoCustomEscopoSecoes,
        clausulasEspecificas: form.servicoCustomClausulas,
      }
    : service || {};

  const identificacao = interpolate(b.identificacaoPartes, map);
  const objeto = interpolate(b.objeto, map);

  const objetoParagrafos = cleanList(
    (b.objetoParagrafos || []).map((t) => interpolate(t, map))
  );

  const vigencia = interpolate(b.vigencia, map);
  const pagamento = interpolate(b.pagamento, map);

  const obrigacoesContratada = cleanList(
    (b.obrigacoesContratada || []).map((t) => interpolate(t, map))
  );

  const obrigacoesContratante = cleanList(
    (b.obrigacoesContratante || []).map((t) => interpolate(t, map))
  );

  const forcaMaior = b.forcaMaior ? cleanText(interpolate(b.forcaMaior, map)) : "";
  const confidencialidade = interpolate(b.confidencialidadeLgpd, map);
  const usoImagemVoz = b.usoImagemVoz ? cleanText(interpolate(b.usoImagemVoz, map)) : "";
  const propriedadeIntelectual = interpolate(b.propriedadeIntelectual, map);
  const naoConcorrencia = interpolate(b.naoConcorrencia, map);
  const rescisao = interpolate(b.rescisao, map);

  const extincao = cleanList((b.extincao || []).map((t) => interpolate(t, map)));
  const multa = b.multa ? cleanText(interpolate(b.multa, map)) : "";
  const disposicoesGerais = cleanList(
    (b.disposicoesGerais || []).map((t) => interpolate(t, map))
  );
  const foro = interpolate(b.foro, map);

  const escopoSecoes: EscopoSecao[] = Array.isArray(s?.escopoSecoes)
    ? s.escopoSecoes
        .map((sec: any) => ({
          titulo: cleanText(interpolate(sec?.titulo || "", map)),
          itens: cleanList((sec?.itens || []).map((i: string) => interpolate(i, map))),
        }))
        .filter((sec: { titulo: any; itens: string | any[]; }) => sec.titulo || sec.itens.length > 0)
    : [];

  const escopoListClean: string[] =
    typeof s?.escopo === "string"
      ? cleanList([interpolate(s.escopo, map)])
      : Array.isArray(s?.escopo)
      ? cleanList(s.escopo.map((t: string) => interpolate(t, map)))
      : [];

  const especificasList: string[] =
    typeof s?.clausulasEspecificas === "string"
      ? cleanList([interpolate(s.clausulasEspecificas, map)])
      : Array.isArray(s?.clausulasEspecificas)
      ? cleanList(s.clausulasEspecificas.map((t: string) => interpolate(t, map)))
      : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Watermark />

        <Text style={styles.h1}>{interpolate(b.cabecalho, map)}</Text>

        <Text style={styles.p}>{identificacao}</Text>

        <Text style={styles.h2} minPresenceAhead={24}>
          Cláusula 1ª — DO OBJETO
        </Text>
        <Text style={styles.p}>{objeto}</Text>

        {objetoParagrafos.map((p, i) => (
          <Text key={i} style={styles.p}>
            {p}
          </Text>
        ))}

        {(escopoSecoes.length > 0 || escopoListClean.length > 0) && (
          <>
            <Text style={styles.h2} minPresenceAhead={24}>
              Escopo do Serviço
            </Text>

            {escopoSecoes.length > 0 ? (
              <View style={{ marginTop: 2 }} wrap>
                {escopoSecoes.map((sec, idx) => (
                  <View key={idx} style={{ marginBottom: 8 }} wrap>
                    {sec.titulo && (
                      <Text style={{ ...styles.p, fontWeight: 700 }}>
                        {idx + 1}. {sec.titulo}
                      </Text>
                    )}
                    {sec.itens.map((it, i) => (
                      <Text key={i} style={styles.li}>
                        - {it}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            ) : (
              <List items={escopoListClean} />
            )}
          </>
        )}

        <Text style={styles.h2} minPresenceAhead={24}>
          Cláusula 2ª — DA VIGÊNCIA
        </Text>
        <Text style={styles.p}>{vigencia}</Text>

        <Text style={styles.h2} minPresenceAhead={24}>
          Cláusula 3ª — DO PAGAMENTO
        </Text>
        <Text style={styles.p}>{pagamento}</Text>

        {obrigacoesContratada.length > 0 && (
          <>
            <Text style={styles.h2} minPresenceAhead={24}>
              Cláusula 4ª — DAS OBRIGAÇÕES DA CONTRATADA
            </Text>
            <List items={obrigacoesContratada} />
          </>
        )}

        {obrigacoesContratante.length > 0 && (
          <>
            <Text style={styles.h2} minPresenceAhead={24}>
              Cláusula 5ª — DAS OBRIGAÇÕES DA CONTRATANTE
            </Text>
            <List items={obrigacoesContratante} />
          </>
        )}

        {forcaMaior && (
          <>
            <Text style={styles.h2} minPresenceAhead={24}>
              Cláusula 6ª — DO CASO FORTUITO E FORÇA MAIOR
            </Text>
            <Text style={styles.p}>{forcaMaior}</Text>
          </>
        )}

        <Text style={styles.h2} minPresenceAhead={24}>
          Cláusula 7ª — DA CONFIDENCIALIDADE E PROTEÇÃO DE DADOS
        </Text>
        <Text style={styles.p}>{confidencialidade}</Text>

        {usoImagemVoz && (
          <>
            <Text style={styles.h2} minPresenceAhead={24}>
              Cláusula 8ª — DA AUTORIZAÇÃO DE USO DE IMAGEM E VOZ
            </Text>
            <Text style={styles.p}>{usoImagemVoz}</Text>
          </>
        )}

        <Text style={styles.h2} minPresenceAhead={24}>
          Cláusula 9ª — DOS DIREITOS DE PROPRIEDADE INTELECTUAL
        </Text>
        <Text style={styles.p}>{propriedadeIntelectual}</Text>

        <Text style={styles.h2} minPresenceAhead={24}>
          Cláusula 10ª — NÃO CONCORRÊNCIA
        </Text>
        <Text style={styles.p}>{naoConcorrencia}</Text>

        <Text style={styles.h2} minPresenceAhead={24}>
          Cláusula 11ª — DA RESCISÃO
        </Text>
        <Text style={styles.p}>{rescisao}</Text>

        {extincao.length > 0 && (
          <>
            <Text style={styles.h2} minPresenceAhead={24}>
              Cláusula 12ª — DA EXTINÇÃO
            </Text>
            <List items={extincao} />
          </>
        )}

        {multa && (
          <>
            <Text style={styles.h2} minPresenceAhead={24}>
              Cláusula 13ª — DA MULTA
            </Text>
            <Text style={styles.p}>{multa}</Text>
          </>
        )}

        {disposicoesGerais.length > 0 && (
          <>
            <Text style={styles.h2} minPresenceAhead={24}>
              Cláusula 14ª — DAS DISPOSIÇÕES GERAIS
            </Text>
            <List items={disposicoesGerais} />
          </>
        )}

        {especificasList.length > 0 && (
          <>
            <Text style={styles.h2} minPresenceAhead={24}>
              Cláusulas Específicas do Serviço
            </Text>
            <List items={especificasList} />
          </>
        )}

        <Text style={styles.h2} minPresenceAhead={40}>
          Cláusula 15ª — DO FORO
        </Text>
        <Text style={styles.p}>{foro}</Text>

        <View style={styles.signBlock} wrap={false}>
          <View style={styles.signCol}>
            <Text style={styles.signLine}> </Text>
            <Text style={{ textAlign: "center", fontWeight: 700 }}>
              {form.contratanteRazao}
            </Text>
            <Text style={styles.meta}>CNPJ: {form.contratanteCnpj}</Text>
            <Text style={styles.meta}>
              Representante: {form.contratanteRepresentanteNome} — CPF{" "}
              {form.contratanteRepresentanteCpf}
            </Text>
            <Text style={{ textAlign: "center", marginTop: 4 }}>CONTRATANTE</Text>
          </View>

          <View style={styles.signCol}>
            <Text style={styles.signLine}> </Text>
            <Text style={{ textAlign: "center", fontWeight: 700 }}>
              {form.prestadorNome}
            </Text>
            <Text style={styles.meta}>
              CPF: {form.prestadorCpf}
              {form.prestadorRg ? ` — RG ${form.prestadorRg}` : ""}
            </Text>
            <Text style={{ textAlign: "center", marginTop: 4 }}>CONTRATADA</Text>
          </View>
        </View>

        <View style={styles.witnessBlock} wrap={false}>
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