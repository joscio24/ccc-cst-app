import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";

import SplashScreen from "./SplashScreen";
import LoginScreen from "./screens/auth/login";
import SignupScreen from "./screens/auth/register";
import PostDetails from "./screens/PostDetail";
import BottomTabNavigator from "./BottomTabNavigator";
import Notifications from './screens/Notifications';
import Settings from './screens/Settings';
import ChatRoom from "./screens/ChatRoom";
import GroupInfo from "./screens/GroupInfo";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  PostDetail: undefined;
  Notifications: undefined;
  Settings: undefined;
  ChatRoom: undefined;
  GroupInfo: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <>
      {/* ✅ Apply global status bar style */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
        translucent={false}
      />

      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Splash"
        >
          <Stack.Screen name="Splash" component={SplashScreenWrapper} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="PostDetail" component={PostDetails} />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Home" component={BottomTabNavigator} />
          <Stack.Screen name="ChatRoom" component={ChatRoom} />
          <Stack.Screen name="GroupInfo" component={GroupInfo} />

        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const SplashScreenWrapper = ({ navigation }: any) => {
  return (
    <SplashScreen
      onLogin={() => navigation.navigate("Login")}
      onSignUp={() => navigation.navigate("Signup")}
      onGuest={() => navigation.replace("Home")}
    />
  );
};
