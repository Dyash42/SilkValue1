// ─── Silk Value — Reeler App Entry Point ─────────────────────────────────────
// This is a placeholder shell. Full implementation begins in Phase 5.
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Silk Value — Reeler</Text>
      <Text style={styles.subtitle}>Workspace linked. Ready for build.</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 1,
  },
  subtitle: {
    color: "#666666",
    fontSize: 14,
    marginTop: 8,
  },
});
