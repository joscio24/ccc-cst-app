import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Appearance, Image } from "react-native";
import { useAppTheme } from "./ThemeContext";
import { Switch } from "react-native";
import tw from "tailwind-react-native-classnames";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Pressable,
  useColorScheme,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Colors } from "./theme/colors";

const SplashScreen = ({ onLogin, onSignUp, onGuest }: any) => {
  const { t, i18n } = useTranslation();
  const scheme = useColorScheme();
  const { mode, toggleTheme } = useAppTheme();
  const isDark = mode === "dark";

  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    await AsyncStorage.setItem("user-language", lng);
    setLanguageModalVisible(false);
  };
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // You can store the new colorScheme in state or context
      console.log("Theme changed to", colorScheme);
    });

    return () => subscription.remove();
  }, []);

  const backgroundColor = isDark
    ? Colors.darkBackground
    : Colors.lightBackground;
  const textColor = isDark ? Colors.textDark : Colors.textLight;
  const buttonBg = isDark ? Colors.darkButton : Colors.primary;

  const insets = useSafeAreaInsets();

  console.log("Current color scheme:", scheme);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.container2}>
        <Image
          source={require("../assets/images/celeLogo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={[styles.title, { color: Colors.primary }]}>
      {t("churchname")}{" "}
      </Text>

      <Text style={[styles.title2, { color: Colors.primary }]}>
        {" "}
        {t("cstTag")}
      </Text>

      <View style={styles.list}>
        <Text style={[styles.listItem, { color: textColor }]}>
          ✓ {t("benefit1")}
        </Text>
        <Text style={[styles.listItem, { color: textColor }]}>
          ✓ {t("benefit2")}
        </Text>
        <Text style={[styles.listItem, { color: textColor }]}>
          ✓ {t("benefit3")}
        </Text>
      </View>

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: Colors.darkBackground }]}
          onPress={onLogin}
        >
          <Text style={{ color: Colors.textDark }}>{t("login")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: Colors.primary }]}
          onPress={onSignUp}
        >
          <Text style={{ color: "#fff" }}>{t("signup")}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onGuest}>
        <Text style={[styles.guestText, { color: textColor }]}>
          {t("guest")}
        </Text>
      </TouchableOpacity>

      

      {/* Language Drawer Trigger */}
      <TouchableOpacity
        style={[styles.languageRow, { bottom: insets.bottom + 8 }]}
        onPress={() => setLanguageModalVisible(true)}
      >
        <Text style={[styles.languageText, { color: textColor }]}>
          {t("language")}
        </Text>
        <Text style={[styles.languageText, { color: textColor }]}>
          {i18n.language.toUpperCase()} ⌄
        </Text>
      </TouchableOpacity>

      {/* Bottom Drawer for Language Selection */}
      <Modal
        visible={languageModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.languageModal, { backgroundColor }]}>
            <Text style={[styles.languageTitle, { color: textColor }]}>
              {t("selectLanguage")}
            </Text>

            {["en", "fr", "yo", "gou", "es"].map((lng) => (
              <Pressable
                key={lng}
                style={styles.languageItem}
                onPress={() => changeLanguage(lng)}
              >
                <Text style={{ color: textColor }}>{t(`lang.${lng}`)}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  container2: {
    // flex: 1,
    // height: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logo: {
    height: 120,
  },
  themeToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "40%",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "stretch",
    textTransform:"uppercase",
    marginBottom: 12,
  },
  title2: {
    fontSize: 18,
    textTransform:"capitalize",
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "stretch",
    marginBottom: 12,
  },
  subtitle: { fontSize: 16, textAlign: "center", marginBottom: 24 },
  list: { marginBottom: 30, alignSelf: "stretch", padding: 20 },
  listItem: { fontSize: 15, marginVertical: 5 },
  btnRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 12,
  },
  btn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 120,
  },
  guestText: { fontSize: 14, marginTop: 10 },
  languageRow: {
    position: "absolute",
    bottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    paddingHorizontal: 20,
  },
  languageText: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  languageModal: {
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  languageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  languageItem: {
    paddingVertical: 12,
  },
});

export default SplashScreen;
