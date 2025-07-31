import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Documents() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Documents</Text>
      <Text>This is the Documents page.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
});
