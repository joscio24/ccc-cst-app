import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { COLORS } from "../theme/colors";
import Icon from "react-native-vector-icons/Ionicons";

const cantiqueKeys = [
  { key: "cantique_goun", label: "Cantique en Goun" },
  { key: "cantique_yoruba", label: "Cantique en Yoruba" },
  { key: "cantique_anglais", label: "Cantique en Anglais" },
  { key: "cantique_francais", label: "Cantique en Français" },
];

export default function Cantiques({ navigation }: any) {
  const { t } = useTranslation();

  const handleOpenCantique = (key: string) => {
    navigation.navigate("CantiqueDetails", { cantiqueKey: key });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("cantiques.title")}</Text>

      <FlatList
        data={cantiqueKeys}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => handleOpenCantique(item.key)}
          >
            <View style={styles.iconContainer}>
              <Icon name="musical-notes-outline" size={24} color={COLORS.light.primary} />
            </View>

            <Text style={styles.cardText}>{item.label}</Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color="#aaa"
              style={{ marginLeft: "auto" }}
            />
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
    marginBlockStart: 30,
    color: COLORS.light.primary,
  },
  card: {
    backgroundColor: "#fff",
    elevation: 0.4,
    padding: 16,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E6F0FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
});
