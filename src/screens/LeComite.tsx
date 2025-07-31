import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function LeComite() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Le Comité</Text>
      <Text>This is the Le Comité page.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
});
