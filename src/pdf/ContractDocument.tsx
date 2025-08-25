// src/pdf/ContractDocument.tsx
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ContractFormData, ContractTemplates, ServiceTemplate } from "@/types/contracts";
import { interpolate, interpolateArray } from "@/utils/mergePlaceholders";

type Props = {
  form: ContractFormData;
  templates: ContractTemplates;
  service?: ServiceTemplate | null;
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

export default function ContractDocument({ form, templates, service, map }: Props) {
  const base = templates.base;

  // Escopo e cláusulas específicas
  const isCustom = form.servicoChave === "custom";
  const escopoList = !isCustom
    ? interpolateArray((service as any)?.escopo || [], map)
    : (form.servicoCustomEscopo || "").split("\n").map((s) => s.trim()).filter(Boolean);

  const clausulasSpecific =
    isCustom
      ? (form.servicoCustomClausulas || "").split("\n").map((s) => s.trim()).filter(Boolean)
      : interpolateArray(((service as any)?.clausulasEspecificas || []) as string[], map);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>{interpolate(base.cabecalho, map)}</Text>

        <View>
          <Text style={styles.p}>{interpolate(base.identificacaoPartes, map)}</Text>
        </View>

        <View>
          <Text style={styles.h2}>CLÁUSULA 1ª — DO OBJETO</Text>
          <Text style={styles.p}>{interpolate(base.objeto, map)}</Text>
        </View>

        {/* Escopo */}
        {escopoList?.length > 0 && (
          <View>
            <Text style={styles.h2}>CLÁUSULA 2ª — DO ESCOPO</Text>
            {escopoList.map((item, idx) => (
              <Text key={idx} style={styles.li}>• {item}</Text>
            ))}
          </View>
        )}

        {/* Vigência e Pagamento */}
        <View>
          <Text style={styles.h2}>CLÁUSULA 3ª — DA VIGÊNCIA</Text>
          <Text style={styles.p}>{interpolate(base.vigencia, map)}</Text>
        </View>
        <View>
          <Text style={styles.h2}>CLÁUSULA 4ª — DO PAGAMENTO</Text>
          <Text style={styles.p}>{interpolate(base.pagamento, map)}</Text>
        </View>

        {/* Cláusulas Específicas do Serviço */}
        {clausulasSpecific?.length > 0 && (
          <View>
            <Text style={styles.h2}>CLÁUSULA 5ª — CONDIÇÕES ESPECÍFICAS</Text>
            {clausulasSpecific.map((c, idx) => (
              <Text key={idx} style={styles.p}>• {c}</Text>
            ))}
          </View>
        )}

        {/* Cláusulas Gerais */}
        <View>
          <Text style={styles.h2}>CLÁUSULA 6ª — CONFIDENCIALIDADE E LGPD</Text>
          <Text style={styles.p}>{interpolate(base.confidencialidadeLgpd, map)}</Text>
        </View>
        <View>
          <Text style={styles.h2}>CLÁUSULA 7ª — PROPRIEDADE INTELECTUAL</Text>
          <Text style={styles.p}>{interpolate(base.propriedadeIntelectual, map)}</Text>
        </View>
        <View>
          <Text style={styles.h2}>CLÁUSULA 8ª — NÃO CONCORRÊNCIA</Text>
          <Text style={styles.p}>{interpolate(base.naoConcorrencia, map)}</Text>
        </View>
        <View>
          <Text style={styles.h2}>CLÁUSULA 9ª — RESCISÃO</Text>
          <Text style={styles.p}>{interpolate(base.rescisao, map)}</Text>
        </View>
        <View>
          <Text style={styles.h2}>CLÁUSULA 10ª — FORO</Text>
          <Text style={styles.p}>{interpolate(base.foro, map)}</Text>
        </View>

        <View style={styles.divider} />

        <View>
          <Text style={styles.p}>
            E, por estarem justas e contratadas, firmam o presente instrumento.
          </Text>
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
