import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import SplashScreen from "./SplashScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import LoginScreen from "./screens/auth/login";
import SignupScreen from "./screens/auth/register";
import PostDetails from "./screens/PostDetail";
import BottomTabNavigator from "./BottomTabNavigator";
import Notifications from "./screens/Notifications";
import Settings from "./screens/Settings";
import ChatRoom from "./screens/ChatRoom";
import GroupInfo from "./screens/GroupInfo";

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  MainNav: undefined;
  PostDetail: undefined;
  Notifications: undefined;
  Settings: undefined;
  ChatRoom: undefined;
  GroupInfo: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Language Selection Modal Component
const LanguageSelectModal = ({
  visible,
  onSelectLanguage,
}: {
  visible: boolean;
  onSelectLanguage: (lng: string) => void;
}) => {
  const { t } = useTranslation();

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalOverlay}>
        <SafeAreaView edges={["top", "bottom"]} style={styles.modalContent}>
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
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default function AppNavigator() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [languageSet, setLanguageSet] = useState<boolean | null>(null);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const { i18n } = useTranslation();

  const resetOnboarding = async () => {
    await AsyncStorage.removeItem("hasLaunched");
    console.log(
      "✅ Onboarding state cleared. Next launch will show onboarding again."
    );
  };

  useEffect(() => {
    const checkAppState = async () => {
      const launched = await AsyncStorage.getItem("hasLaunched");
      const userLanguage = await AsyncStorage.getItem("user-language");

      if (!launched) {
        setIsFirstLaunch(true);
        await AsyncStorage.setItem("hasLaunched", "true");
      } else {
        setIsFirstLaunch(false);
      }

      if (!userLanguage) {
        setLanguageSet(false);
        setLanguageModalVisible(true);
      } else {
        setLanguageSet(true);
        await i18n.changeLanguage(userLanguage);
      }
    };
    checkAppState();

    resetOnboarding();
  }, [i18n]);

  // When language is selected in the modal
  const handleSelectLanguage = async (lng: string) => {
    await AsyncStorage.setItem("user-language", lng);
    await i18n.changeLanguage(lng);
    setLanguageModalVisible(false);
    setLanguageSet(true);
  };

  if (isFirstLaunch === null || languageSet === null) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={false}
      />

      {/* Show language modal first if language not set */}
      <LanguageSelectModal
        visible={languageModalVisible}
        onSelectLanguage={handleSelectLanguage}
      />

      {/* Only render navigator if language is set and modal closed */}
      {!languageModalVisible && (
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="Splash"
          >
            <Stack.Screen name="Splash" component={SplashScreenWrapper} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="PostDetail" component={PostDetails} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="MainNav" component={BottomTabNavigator} />
            <Stack.Screen name="ChatRoom" component={ChatRoom} />
            <Stack.Screen name="GroupInfo" component={GroupInfo} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </SafeAreaView>
  );
}

const SplashScreenWrapper = ({ navigation }: any) => {
  useEffect(() => {
    const timer = setTimeout(async () => {
      const launched = await AsyncStorage.getItem("hasLaunched");
      const userLanguage = await AsyncStorage.getItem("user-language");

      if (!userLanguage) {
        // language modal should handle selection first, don't navigate yet
        return;
      }

      navigation.replace(launched ? "Login" : "Onboarding");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SplashScreen
      onLogin={() => navigation.navigate("Login")}
      onSignUp={() => navigation.navigate("Signup")}
      onGuest={() => navigation.replace("MainNav")}
    />
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
    textAlign: "center",
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
