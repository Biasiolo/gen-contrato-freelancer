// src/pdf/DistratoDocument.tsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ContractFormData, ContractTemplates } from "@/types/contracts";
import { interpolate, interpolateObject } from "@/utils/mergePlaceholders";
import Watermark from "./Watermark";
import Footer, { FOOTER_HEIGHT } from "./Footer";

type Props = {
  form: ContractFormData;
  templates: ContractTemplates;
  map: Record<string, unknown>;
};

const styles = StyleSheet.create({
  page: {
    padding: 32,
    paddingBottom: FOOTER_HEIGHT + 24, // espaço pro rodapé
    fontSize: 12,
    lineHeight: 1.4,
    fontFamily: "Helvetica",
  },
  h1: { fontSize: 14, textAlign: "center", marginBottom: 20, fontWeight: 700 },
  h2: { fontSize: 12, marginTop: 10, marginBottom: 10, fontWeight: 700 },
  p: { marginBottom: 6, textAlign: "justify" },
  li: { marginLeft: 12, marginBottom: 4 },
  divider: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    borderBottomStyle: "solid",
  },
  signBlock: { marginTop: 36, flexDirection: "row", justifyContent: "space-between" },
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
  witnessRow: { marginTop: 24, flexDirection: "row", justifyContent: "space-between" },
  witnessCol: { width: "48%" },
});

export default function DistratoDocument({ form, templates, map }: Props) {
  const d = templates.distrato;
  const clauses = interpolateObject(d.clausulas, map);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Watermark />

        <Text style={styles.h1}>{interpolate(d.titulo, map)}</Text>

        <View>
          <Text style={styles.p}>
            Pelo presente instrumento, as partes abaixo identificadas — {form.contratanteRazao} (CNPJ {form.contratanteCnpj}),
            neste ato representada por {form.contratanteRepresentanteNome || "Daniele Reily da Silva Souza"}
            CPF {form.contratanteRepresentanteCpf || "218.047.008-86"}, e {form.prestadorNome}
            {form.prestadorRg ? `, RG ${form.prestadorRg}` : ""}, CPF {form.prestadorCpf} —
            resolvem formalizar o distrato do contrato anteriormente firmado, nos seguintes termos:
          </Text>
        </View>

        {Object.entries(clauses).map(([key, text], idx) => (
          <View key={key}>
            <Text style={styles.h2}>Cláusula {idx + 1} — {key.toUpperCase()}</Text>
            <Text style={styles.p}>{text as string}</Text>
          </View>
        ))}



        {/* Local e Data */}
        <View>
          <Text style={styles.p}>
            {form.foroCidade}, ____/____/________.
          </Text>
        </View>

        {/* Assinaturas das partes */}
        <View style={styles.signBlock}>
          {/* CONTRATANTE */}
          <View style={styles.signCol}>
            <Text style={styles.signLine}> </Text>
            <Text style={{ textAlign: "center", fontWeight: 700 }}>{form.contratanteRazao}</Text>
            <Text style={styles.meta}>CNPJ: {form.contratanteCnpj}</Text>
            <Text style={styles.meta}>
              Representante: {form.contratanteRepresentanteNome || "Daniele Reily da Silva Souza"} — CPF {form.contratanteRepresentanteCpf || "218.047.008-86"}
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
        <View style={styles.witnessRow}>
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
