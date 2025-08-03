import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import { useTranslation } from "react-i18next";
import { Colors } from "../../theme/colors";
import { useAppTheme } from "../../ThemeContext";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const LoginScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { mode } = useAppTheme();
  const isDark = mode === "dark";

  const textColor = isDark ? Colors.textDark : Colors.textLight;
  const inputBg = isDark ? Colors.inputDark : Colors.inputLight;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <LinearGradient colors={["#E0F7FA", "#FDFEFF"]} style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/images/appLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.inputDrawer}>
          <Text style={[styles.title, { color: textColor }]}>{t("login")}</Text>

          <Text style={[styles.label, { color: textColor }]}>{t("email")}</Text>
          <TextInput
            placeholder={t("emailPlaceholder")}
            placeholderTextColor="#aaa"
            style={[styles.input, { backgroundColor: inputBg, color: textColor }]}
          />

          <Text style={[styles.label, { color: textColor }]}>{t("password")}</Text>
          <View style={[styles.passwordContainer, { backgroundColor: inputBg }]}>
            <TextInput
              placeholder={t("passwordPlaceholder")}
              placeholderTextColor="#aaa"
              secureTextEntry={!showPassword}
              style={[styles.passwordInput, { color: textColor }]}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? "eye-off" : "eye"} size={20} color={textColor} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => navigation.replace("MainNav")}
            style={[styles.button, { backgroundColor: Colors.primary }]}
          >
            <Text style={styles.buttonText}>{t("login")}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
            <Text style={[styles.link, { color: Colors.primary }]}>
              {t("noAccountSignUp")}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  innerContainer: { flex: 1, justifyContent: "flex-end" },
  logoContainer: { alignItems: "center", marginBottom: 50, padding: 20 },
  logo: { height: 140 },
  inputDrawer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    padding: 16,
    borderRadius: 12,
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
