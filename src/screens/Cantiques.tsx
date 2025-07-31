import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Cantiques() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cantiques</Text>
      <Text>This is the Cantiques page.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
});
