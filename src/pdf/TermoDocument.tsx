import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { TermoFormData, TermoTemplates } from "@/types/termos";
import { buildPlaceholderMapTermo } from "@/utils/buildPlaceholderMapTermo";
import templatesTermos from "@/templates/termos";
import { interpolate } from "@/utils/mergePlaceholders";
import Watermark from "./Watermark";
import Footer, { FOOTER_HEIGHT } from "./Footer";

type Props = { form: TermoFormData; templates?: TermoTemplates };

const styles = StyleSheet.create({
  page: {
    padding: 32,
    paddingBottom: FOOTER_HEIGHT + 24,
    fontSize: 11,
    lineHeight: 1.4,
    fontFamily: "Helvetica",
  },
  h1: { fontSize: 14, textAlign: "center", marginBottom: 16, fontWeight: 700 },
  p: { marginBottom: 6, textAlign: "justify" },
  signBlock: { marginTop: 36, flexDirection: "row", justifyContent: "space-between" },
  signCol: { width: "48%" },
  signLine: { marginTop: 28, borderTopWidth: 1, borderTopColor: "#000", borderTopStyle: "solid", paddingTop: 4, textAlign: "center" },
  meta: { fontSize: 9, textAlign: "center", color: "#444", marginTop: 2 },
});

export default function TermoDocument({ form, templates = templatesTermos }: Props) {
  const map = buildPlaceholderMapTermo(form);
  const base =
    form.tipoTermo === "devolucao" ? templates.base.devolucao : templates.base.recebimento;

  const titulo =
    form.tipoTermo === "devolucao"
      ? "TERMO DE DEVOLUÇÃO DE EQUIPAMENTOS"
      : "TERMO DE RESPONSABILIDADE E RECEBIMENTO DE EQUIPAMENTOS";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Watermark />
        <Text style={styles.h1}>{titulo}</Text>

        {/* texto base interpolado */}
        <Text style={styles.p}>{interpolate(base, map)}</Text>

        {/* assinaturas */}
        <View style={styles.signBlock}>
          <View style={styles.signCol}>
            <Text style={styles.signLine}> </Text>
            <Text style={{ textAlign: "center", fontWeight: 700 }}>{form.empresaRazao}</Text>
            <Text style={styles.meta}>CNPJ: {form.empresaCnpj}</Text>
            <Text style={{ textAlign: "center", marginTop: 4 }}>EMPRESA</Text>
          </View>
          <View style={styles.signCol}>
            <Text style={styles.signLine}> </Text>
            <Text style={{ textAlign: "center", fontWeight: 700 }}>{form.empNome}</Text>
            <Text style={styles.meta}>CPF: {form.empCpf}{form.empRg ? ` — RG ${form.empRg}` : ""}</Text>
            <Text style={{ textAlign: "center", marginTop: 4 }}>COLABORADOR(A)</Text>
          </View>
        </View>

        <Footer />
      </Page>
    </Document>
  );
}
