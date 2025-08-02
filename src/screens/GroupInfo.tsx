import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Switch, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";

export default function GroupInfo({ route, navigation }: any) {
  const { chatName, chatAvatar } = route.params;

  const [isMuted, setIsMuted] = useState(false);

  const handleExitGroup = () => {
    Alert.alert(
      "Exit Group",
      "Are you sure you want to exit this group?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Exit",
          style: "destructive",
          onPress: () => {
            // Handle group exit logic here
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Group Info</Text>
      </View>

      {/* Group Image */}
      <View style={styles.groupImageContainer}>
        <Image source={{ uri: chatAvatar }} style={styles.groupImage} />
        <Text style={styles.groupName}>{chatName}</Text>
        <Text style={styles.groupDesc}>Group • Tap to view members</Text>
      </View>

      {/* Mute Notifications */}
      <View style={styles.optionRow}>
        <Ionicons name="notifications-off-outline" size={22} color="#555" />
        <Text style={styles.optionText}>Mute Notifications</Text>
        <Switch
          value={isMuted}
          onValueChange={setIsMuted}
          thumbColor={isMuted ? COLORS.light.primary : "#ccc"}
        />
      </View>

      {/* Media, Links, Docs */}
      <TouchableOpacity style={styles.optionRow}>
        <Ionicons name="image-outline" size={22} color="#555" />
        <Text style={styles.optionText}>Media, Links, and Docs</Text>
      </TouchableOpacity>

      {/* Exit Group */}
      <TouchableOpacity style={[styles.optionRow, { marginTop: 30 }]} onPress={handleExitGroup}>
        <Ionicons name="exit-outline" size={22} color="red" />
        <Text style={[styles.optionText, { color: "red" }]}>Exit Group</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 12 },
  groupImageContainer: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  groupImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  groupName: { fontSize: 18, fontWeight: "bold" },
  groupDesc: { color: "#777", marginTop: 4 },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },
  optionText: { flex: 1, fontSize: 16, marginLeft: 14 },
});
