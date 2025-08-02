import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { COLORS } from "../theme/colors";
import { Icon } from "@roninoss/icons";

const documentKeys = [
  "doc_10_commandments",
  "doc_church_history",
  "doc_osh_offa",
  "doc_constitution",
  "doc_light_on_ecc",
  "doc_11_ordnances",
  "doc_4_sacraments",
  "doc_12_forbidden",
  "doc_institutions",
];

export default function Documents({ navigation }: any) {
  const { t } = useTranslation();
  const handleOpenDocument = (key: string) => {
    navigation.navigate("DocumentDetails", { docKey: key }); // optional
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("documents.title")}</Text>

      <FlatList
        data={documentKeys}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => handleOpenDocument(item)}
          >
            {/* <MaterialIcons name="description" size={24} color="#008080" /> */}
            <View style={styles.iconContainer}>
              <Icon
                name="file-document"
                size={24}
                color={COLORS.light.primary}
              />
            </View>

            <Text style={styles.cardText}>{t(item)}</Text>
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
    // textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    elevation: 0.4,
    padding: 16,
    marginVertical: 8,
    // borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
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
