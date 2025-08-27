// src/pdf/Watermark.tsx
import React from "react";
import { View, Image, StyleSheet } from "@react-pdf/renderer";

// ⚠️ Se o import direto não funcionar no seu bundler, use a alternativa abaixo:
// const marca = new URL("@/assets/marca.png", import.meta.url).href;
import marca from "@/assets/marca.png";

const styles = StyleSheet.create({
  rail: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 100,                     // “trilho” à esquerda
    opacity: 0.5,                  // opacidade da marca d’água
    justifyContent: "space-around", // repete verticalmente
    alignItems: "flex-start",
    paddingTop: 8,  
  },
  item: {
    width: 160,                     // ajuste conforme sua arte
    height: 60,                     // ajuste conforme sua arte
    transform: "rotate(-90deg)",    // deixa “de lado”
    marginLeft: -60,                // puxa a arte para a margem esquerda
  },
});

export default function Watermark() {
  // Repete 5x ao longo da página; ajuste se quiser mais/menos
  return (
    <View style={styles.rail} fixed>
      {Array.from({ length: 5 }).map((_, i) => (
        <Image key={i} src={marca as any} style={styles.item} />
      ))}
    </View>
  );
}
