import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

type LanguageSelectModalProps = {
  visible: boolean;
  onSelectLanguage: (lng: string) => void;
};

const LanguageSelectModal = ({ visible, onSelectLanguage }: LanguageSelectModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{t("settings.selectLanguage")}</Text>
          {["en", "fr", "yo", "gou", "es"].map((lng) => (
            <Pressable
              key={lng}
              style={styles.languageItem}
              onPress={() => onSelectLanguage(lng)}
            >
              <Text style={styles.languageText}>{t(`lang.${lng}`)}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  languageItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  languageText: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default LanguageSelectModal;
