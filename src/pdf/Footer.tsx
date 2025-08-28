// src/pdf/Footer.tsx
import React from "react";
import { View, Text, StyleSheet, Link } from "@react-pdf/renderer";

export const FOOTER_HEIGHT = 72; // ← altura reservada

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: FOOTER_HEIGHT,
        width: "100%",
        paddingHorizontal: 32,
        paddingVertical: 8,
        backgroundColor: "#fff",      // evita sobreposição com watermark
    },
    divider: {
        borderTopWidth: 1,
        borderTopColor: "#d0d0d0",
        borderTopStyle: "solid",
        marginBottom: 6,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    col: { flexDirection: "column" },
    subtle: { color: "#777", fontSize: 9 },
    pageNumber: { marginTop: 4 },
});

export default function Footer() {
    return (
        <View style={styles.container} fixed wrap={false}>
            <View style={styles.divider} />
            <View style={styles.row}>
                <View style={styles.col}>
                    <Text style={styles.subtle}>R. Síria, 71 – Salas 44 e 45</Text>
                    <Text style={styles.subtle}>Jardim Oswaldo Cruz, SJC – SP</Text>
                </View>

                <View style={styles.col}>
                    <Link src="mailto:contato@voiaagency.com.br" style={styles.subtle}>
                        contato@voiaagency.com.br
                    </Link>
                    <Link src="tel:+5512988081002" style={styles.subtle}>
                        (12) 98808-1002
                    </Link>
                    <Text
                        style={[styles.pageNumber, styles.subtle]}
                        render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
                    />
                </View>
            </View>
        </View>
    );
}
