// Navigation.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './SplashScreen'; // Your updated screen
// import LoginScreen from './screens/LoginScreen';
// import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/Home';
import PostDetails from './screens/PostDetail';
import LoginScreen from './screens/auth/login';
import SignupScreen from './screens/auth/register';
import BottomTabNavigator from './BottomTabNavigator';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  PostDetail: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreenWrapper} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PostDetail" component={PostDetails} />
      </Stack.Navigator>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}

// We wrap SplashScreen to pass navigation props easily
const SplashScreenWrapper = ({ navigation }: any) => {
  return (
    <SplashScreen
      onLogin={() => navigation.navigate('Login')}
      onSignUp={() => navigation.navigate('Signup')}
      onGuest={() => navigation.navigate('Home')}
    />
  );
};
