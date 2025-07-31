import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ViewStyle,
  TextStyle,
} from "react-native";
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

import LeComite from "./screens/LeComite";
import Documents from "./screens/Documents";
import Messages from "./screens/Messages";
import Cantiques from "./screens/Cantiques";

type TabRouteName = "LeComite" | "Documents" | "Messages" | "Cantiques";

const Tab = createBottomTabNavigator();

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const icons: Record<TabRouteName, string> = {
          LeComite: "people-outline",
          Documents: "document-text-outline",
          Messages: "chatbubbles-outline",
          Cantiques: "musical-notes-outline",
        };

        const iconName = icons[route.name as TabRouteName];
        const isMiddle = route.name === "Messages";

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[styles.tabButton, isMiddle && styles.middleButtonWrapper]}
            activeOpacity={0.9}
          >
            <View
              style={[
                styles.iconContainer,
                isMiddle
                  ? styles.middleButton
                  : isFocused
                    ? styles.activeTab
                    : undefined,
              ]}
            >
              <Icon
                name={iconName}
                size={isMiddle ? 30 : 24}
                color={isMiddle || isFocused ? "#007BFF" : "#888"}
              />
              {!isMiddle &&
                (typeof label === "string" ? (
                  <Text style={[styles.label, isFocused && styles.activeLabel]}>
                    {label}
                  </Text>
                ) : null)}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="LeComite" component={LeComite} />
      <Tab.Screen name="Documents" component={Documents} />
      <Tab.Screen name="Messages" component={Messages} />
      <Tab.Screen name="Cantiques" component={Cantiques} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 10,
    elevation: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 8,
  } as ViewStyle,
  tabButton: {
    flex: 1,
    alignItems: "center",
  } as ViewStyle,
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  label: {
    fontSize: 12,
    marginTop: 2,
    color: "#888",
  } as TextStyle,
  activeTab: {
    transform: [{ scale: 1.1 }],
  } as ViewStyle,
  activeLabel: {
    color: "#007BFF",
    fontWeight: "600",
  } as TextStyle,
  middleButtonWrapper: {
    top: -20,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  } as ViewStyle,
  middleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
});
