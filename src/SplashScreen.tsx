import React from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from "react-native";

// ✅ Define props type
type SplashScreenProps = {
  onLogin: () => void;
  onSignUp: () => void;
  onGuest: () => void;
};

const SplashScreen: React.FC<SplashScreenProps> = ({ onLogin, onSignUp, onGuest }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/appLogo.png")}
        style={styles.logo}
      />
      <ActivityIndicator size="large" color="#64C7C3" style={{ marginTop: 20 }} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  logo: { width: 150, height: 150, resizeMode: "contain", marginBottom: 20 },
  button: {
    backgroundColor: "#64C7C3",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SplashScreen;
