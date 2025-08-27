// src/pdf/DistratoDocument.tsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ContractFormData, ContractTemplates } from "@/types/contracts";
import { interpolate, interpolateObject } from "@/utils/mergePlaceholders";
import Watermark from "./Watermark";

type Props = {
  form: ContractFormData;
  templates: ContractTemplates;
  map: Record<string, unknown>;
};

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 11, lineHeight: 1.4, fontFamily: "Helvetica" },
  h1: { fontSize: 14, textAlign: "center", marginBottom: 12, fontWeight: 700 },
  h2: { fontSize: 12, marginTop: 10, marginBottom: 6, fontWeight: 700 },
  p: { marginBottom: 6, textAlign: "justify" },
  li: { marginLeft: 12, marginBottom: 4 },
  divider: { marginVertical: 10, borderBottomWidth: 1, borderBottomColor: "#999", borderBottomStyle: "solid" },
  signBlock: { marginTop: 36, flexDirection: "row", justifyContent: "space-between" },
  signCol: { width: "48%" },
  signLine: { marginTop: 28, borderTopWidth: 1, borderTopColor: "#000", borderTopStyle: "solid", paddingTop: 4, textAlign: "center" }
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
            (CPF {form.contratanteRepresentanteCpf || "218.047.008-86"}), e {form.prestadorNome}
            {form.prestadorRg ? `, RG ${form.prestadorRg}` : ""} (CPF {form.prestadorCpf}) —
            resolvem formalizar o distrato do contrato anteriormente firmado, nos seguintes termos:
          </Text>
        </View>

        {Object.entries(clauses).map(([key, text], idx) => (
          <View key={key}>
            <Text style={styles.h2}>Cláusula {idx + 1} — {key.toUpperCase()}</Text>
            <Text style={styles.p}>{text}</Text>
          </View>
        ))}

        <View style={styles.divider} />

        <View>
          <Text style={styles.p}>
            {form.foroCidade}, ____/____/________.
          </Text>
        </View>

        <View style={styles.signBlock}>
          <View style={styles.signCol}>
            <Text style={styles.signLine}>{form.contratanteRazao}</Text>
            <Text style={{ textAlign: "center" }}>CONTRATANTE</Text>
          </View>
          <View style={styles.signCol}>
            <Text style={styles.signLine}>{form.prestadorNome}</Text>
            <Text style={{ textAlign: "center" }}>CONTRATADA</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
