import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/Ionicons";
import { Colors } from "../../theme/colors";
import { useAppTheme } from "../../ThemeContext";

const { width } = Dimensions.get("window");

const countries = [
  { code: "BJ", name: "Benin" },
  { code: "NG", name: "Nigeria" },
  { code: "FR", name: "France" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
];

const SignupScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { mode } = useAppTheme();
  const isDark = mode === "dark";

  const textColor = isDark ? Colors.textDark : Colors.textLight;
  const inputBg = isDark ? Colors.inputDark : Colors.inputLight;

  const [step, setStep] = useState(1);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("Benin");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    parish: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const selectCountry = (name: string) => {
    setSelectedCountry(name);
    setCountryModalVisible(false);
  };

  const goNext = () => {
    if (step < 3) setStep(step + 1);
    else navigation.navigate("MainNav");
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
    else navigation.goBack();
  };

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
          <Text style={[styles.title, { color: textColor }]}>
            {t("signupTitle")}
          </Text>

          {step === 1 && (
            <>
              <Text style={[styles.label, { color: textColor }]}>
                {t("firstname")}
              </Text>
              <TextInput
                placeholder={t("firstname")}
                placeholderTextColor="#aaa"
                style={[
                  styles.input,
                  { backgroundColor: inputBg, color: textColor },
                ]}
                value={form.firstName}
                onChangeText={(text) => handleInputChange("firstName", text)}
              />

              <Text style={[styles.label, { color: textColor }]}>
                {t("lastname")}
              </Text>
              <TextInput
                placeholder={t("lastname")}
                placeholderTextColor="#aaa"
                style={[
                  styles.input,
                  { backgroundColor: inputBg, color: textColor },
                ]}
                value={form.lastName}
                onChangeText={(text) => handleInputChange("lastName", text)}
              />

              <Text style={[styles.label, { color: textColor }]}>
                {t("parishName")}
              </Text>
              <TextInput
                placeholder={t("parishName")}
                placeholderTextColor="#aaa"
                style={[
                  styles.input,
                  { backgroundColor: inputBg, color: textColor },
                ]}
                value={form.parish}
                onChangeText={(text) => handleInputChange("parish", text)}
              />
            </>
          )}

          {step === 2 && (
            <>
              <Text style={[styles.label, { color: textColor }]}>
                {t("phone")}
              </Text>
              <TextInput
                placeholder={t("phone")}
                placeholderTextColor="#aaa"
                keyboardType="phone-pad"
                style={[
                  styles.input,
                  { backgroundColor: inputBg, color: textColor },
                ]}
                value={form.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
              />

              <Text style={[styles.label, { color: textColor }]}>
                {t("email")}
              </Text>
              <TextInput
                placeholder={t("emailPlaceholder")}
                placeholderTextColor="#aaa"
                keyboardType="email-address"
                style={[
                  styles.input,
                  { backgroundColor: inputBg, color: textColor },
                ]}
                value={form.email}
                onChangeText={(text) => handleInputChange("email", text)}
              />

              <Text style={[styles.label, { color: textColor }]}>
                {t("selectCountry")}
              </Text>
              <TouchableOpacity
                style={[styles.input, styles.countryInput]}
                onPress={() => setCountryModalVisible(true)}
              >
                <Text style={{ color: textColor }}>{selectedCountry}</Text>
                <Icon name="chevron-down" size={20} color={textColor} />
              </TouchableOpacity>
            </>
          )}

          {step === 3 && (
            <>
              <Text style={[styles.label, { color: textColor }]}>
                {t("password")}
              </Text>
              <View
                style={[styles.passwordContainer, { backgroundColor: inputBg }]}
              >
                <TextInput
                  placeholder={t("passwordPlaceholder")}
                  placeholderTextColor="#aaa"
                  secureTextEntry={!showPassword}
                  style={[styles.passwordInput, { color: textColor }]}
                  value={form.password}
                  onChangeText={(text) => handleInputChange("password", text)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color={textColor}
                  />
                </TouchableOpacity>
              </View>

              <Text style={[styles.label, { color: textColor }]}>
                {t("confirmPassword")}
              </Text>
              <View
                style={[styles.passwordContainer, { backgroundColor: inputBg }]}
              >
                <TextInput
                  placeholder={t("passwordPlaceholder")}
                  placeholderTextColor="#aaa"
                  secureTextEntry={!showConfirm}
                  style={[styles.passwordInput, { color: textColor }]}
                  value={form.confirmPassword}
                  onChangeText={(text) =>
                    handleInputChange("confirmPassword", text)
                  }
                />
                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                  <Icon
                    name={showConfirm ? "eye-off" : "eye"}
                    size={20}
                    color={textColor}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}

          <TouchableOpacity
            onPress={goNext}
            style={[styles.button, { backgroundColor: Colors.primary }]}
          >
            <Text style={styles.buttonText}>
              {step < 3 ? t("next") : t("signup")}
            </Text>
          </TouchableOpacity>

          {step > 1 && (
            <TouchableOpacity onPress={goBack}>
              <Text style={[styles.link, { color: Colors.primary }]}>
                {t("back")}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={[styles.link, { color: Colors.primary }]}>
              {t("haveAccountLogin")}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Modal visible={countryModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{t("selectCountry")}</Text>
            <FlatList
              data={countries}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => selectCountry(item.name)}
                  style={styles.modalItem}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setCountryModalVisible(false)}>
              <Text style={styles.modalClose}>{t("back")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: { flex: 1, justifyContent: "flex-end" },
  logoContainer: { alignItems: "center", marginBottom: 30, padding: 20 },
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
  label: { fontSize: 14, marginBottom: 4, marginTop: 10 },
  input: {
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  passwordInput: { flex: 1, paddingVertical: 12, fontSize: 16 },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 12,
  },
  buttonText: { color: "#fff", fontSize: 16 },
  link: { textAlign: "center", marginTop: 10 },
  countryInput: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modal: {
    backgroundColor: "#fff",
    margin: 32,
    borderRadius: 16,
    padding: 20,
    maxHeight: "70%",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  modalItem: { paddingVertical: 10 },
  modalClose: { color: "#007AFF", marginTop: 20, textAlign: "center" },
});

export default SignupScreen;
