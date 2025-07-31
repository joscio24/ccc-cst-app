import React = require("react");
("react");
import AppNavigator from "./src/Navigation"; // path to your navigator
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./i18n"; // translation setup

import { ThemeProvider } from "./src/ThemeContext";
// import React = require('react');
import "./global.css";
import "expo-dev-client";

import { StatusBar } from "expo-status-bar";
import { ThemeProvider as NavThemeProvider } from "@react-navigation/native";

import { useColorScheme, useInitialAndroidBarSync } from "./lib/useColorScheme";
import { NAV_THEME } from "./src/theme";



export default function RootLayout() {
  useInitialAndroidBarSync();
  const { colorScheme, isDarkColorScheme } = useColorScheme();

  return (
    <>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? "light" : "dark"}`}
        style={isDarkColorScheme ? "light" : "dark"}
      />

      <NavThemeProvider value={NAV_THEME[colorScheme]}>
        <AppNavigator />
      </NavThemeProvider>
    </>
  );
}
