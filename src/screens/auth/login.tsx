import React from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { COLORS, Colors } from "../../theme/colors";
import { useAppTheme } from "../../ThemeContext";

const LoginScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { mode } = useAppTheme();
  const isDark = mode === "dark";

  const backgroundColor = isDark ? Colors.darkBackground : Colors.lightBackground;
  const textColor = isDark ? Colors.textDark : Colors.textLight;
  const inputBg = isDark ? Colors.dark : Colors.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>


        <View style={styles.container2}>
                <Image
                  source={require("../../../assets/images/celeLogo.png")}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>
      <Text style={[styles.title, { color: textColor }]}>{t("login")}</Text>

      <TextInput
        placeholder={t("email")}
        placeholderTextColor="#888"
        style={[styles.input, { backgroundColor: Colors.inputLight, color: textColor }]}
      />
      <TextInput
        placeholder={t("password")}
        placeholderTextColor="#888"
        secureTextEntry
        style={[styles.input, { backgroundColor: Colors.inputLight, color: textColor }]}
      />

      <TouchableOpacity  onPress={() => navigation.navigate("Home")} style={[styles.button, { backgroundColor: Colors.primary }]}>
        <Text style={styles.buttonText}>{t("login")}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={[styles.link, { color: Colors.primary }]}>
          {t("noAccountSignUp")}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
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
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  link: {
    textAlign: "center",
    marginTop: 10,
  },
});

export default LoginScreen;
