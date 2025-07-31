import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Colors } from "../../theme/colors";
import { useAppTheme } from "../../ThemeContext"; 
import Icon from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import countryData from "../../data/country.json";

const SignupScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { mode } = useAppTheme();
  const isDark = mode === "dark";

  const backgroundColor = isDark
    ? Colors.darkBackground
    : Colors.lightBackground;
  const textColor = isDark ? Colors.textDark : Colors.textLight;
  const inputBg = isDark ? Colors.inputDark : Colors.inputLight;

  // Extract country list from JSON
  const countryList = Object.entries(countryData.country).map(
    ([code, name]) => ({
      code,
      name,
    })
  );
  const [step, setStep] = useState(1);

  const { width, height } = Dimensions.get("window");
  // States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [country, setCountry] = useState("");
  const [parishName, setParishName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={50}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={[styles.container2, { marginBlockStart: 10 }]}>
            <Image
              source={require("../../../assets/images/celeLogo.png")}
              style={styles.logo} 
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.title, { color: textColor }]}>
            {t("signup")}
          </Text>

          {step === 1 ? (
            <>
              <TextInput
                placeholder={t("firstname")}
                placeholderTextColor="#888"
                style={[
                  styles.input,
                  { backgroundColor: inputBg, color: textColor },
                ]}
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                placeholder={t("lastname")}
                placeholderTextColor="#888"
                style={[
                  styles.input,
                  { backgroundColor: inputBg, color: textColor },
                ]}
                value={lastName}
                onChangeText={setLastName}
              />
              <View style={[styles.input, { backgroundColor: inputBg }]}>
                <Picker
                  selectedValue={country}
                  onValueChange={(value) => setCountry(value)}
                  style={{ color: textColor }}
                  dropdownIconColor={textColor}
                >
                  <Picker.Item label={t("selectCountry")} value="" />
                  {countryList.map((c) => (
                    <Picker.Item key={c.code} label={c.name} value={c.name} />
                  ))}
                </Picker>
              </View>
              <TextInput
                placeholder={t("parishName")}
                placeholderTextColor="#888"
                style={[
                  styles.input,
                  { backgroundColor: inputBg, color: textColor },
                ]}
                value={parishName}
                onChangeText={setParishName}
              />
              <TouchableOpacity
                style={[styles.button, { backgroundColor: Colors.primary }]}
                onPress={() => setStep(2)}
              >
                <Text style={styles.buttonText}>{t("next")}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                placeholder={t("phone")}
                placeholderTextColor="#888"
                keyboardType="phone-pad"
                style={[
                  styles.input,
                  { backgroundColor: inputBg, color: textColor },
                ]}
                value={phone}
                onChangeText={setPhone}
              />
              <TextInput
                placeholder={t("email")}
                placeholderTextColor="#888"
                keyboardType="email-address"
                style={[
                  styles.input,
                  { backgroundColor: inputBg, color: textColor },
                ]}
                value={email}
                onChangeText={setEmail}
              />
              <View
                style={[styles.passwordContainer, { backgroundColor: inputBg }]}
              >
                <TextInput
                  placeholder={t("password")}
                  secureTextEntry={!showPassword}
                  placeholderTextColor="#888"
                  style={[styles.passwordInput, { color: textColor }]}
                  value={password}
                  onChangeText={setPassword}
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
              <View
                style={[styles.passwordContainer, { backgroundColor: inputBg }]}
              >
                <TextInput
                  placeholder={t("confirmPassword")}
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor="#888"
                  style={[styles.passwordInput, { color: textColor }]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Icon
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={20}
                    color={textColor}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: Colors.primary }]}
                onPress={() => {
                  // submit handler
                }}
              >
                <Text style={styles.buttonText}>{t("signup")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setStep(1)}>
                <Text style={[styles.link, { color: Colors.primary }]}>
                  {t("back")}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.link, { color: Colors.primary }]}>
              {t("haveAccountLogin")}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};


const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({

    
  safeArea: {
    flex: 1,

    // padding: 24,
  },
  container: {
    flex: 1,
    width: width,
    minHeight: height,
    justifyContent: "center",
  },
  scroll: {
    
    padding: 24,
    
    justifyContent: "center",
    // alignItems: "center"
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    // padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
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

export default SignupScreen;
