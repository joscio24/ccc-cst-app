import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Pressable, 
  Image, 
  Modal, 
  TouchableOpacity 
} from "react-native";
import { COLORS } from "../theme/colors";
import { useTranslation } from "react-i18next";

// Default global chat rooms
const chatRooms = [
  {
    id: "1",
    name: "Forum des jeunes du monde",
    avatar: "https://i.pravatar.cc/60?img=5",
    isJoined: true,
    lastMessage: "Bienvenue au forum des jeunes ✨",
    unreadCount: 3,
  },
  {
    id: "2",
    name: "Collège des dignitaires à travers le monde",
    avatar: "https://i.pravatar.cc/60?img=8",
    isJoined: false,
    lastMessage: "Cliquez pour demander l'accès.",
    unreadCount: 0,
  },
  {
    id: "3",
    name: "Forum publique ECC monde",
    avatar: "https://i.pravatar.cc/60?img=15",
    isJoined: true,
    lastMessage: "Dernier message public ECC.",
    unreadCount: 0,
  },
];

// Suggested chat rooms based on user's country
const suggestedRooms = [
  {
    id: "4",
    name: "Forum des jeunes - Bénin",
    avatar: "https://i.pravatar.cc/60?img=22",
    isJoined: false,
    lastMessage: "Cliquez pour demander l'accès.",
    unreadCount: 0,
  },
  {
    id: "5",
    name: "Forum des jeunes - Nigeria",
    avatar: "https://i.pravatar.cc/60?img=30",
    isJoined: false,
    lastMessage: "Cliquez pour demander l'accès.",
    unreadCount: 0,
  },
];

export default function Messages({ navigation }: any) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Handle pressing a chat room
  

  const handleOpenChat = (room: any) => {
    if (room.isJoined) {
      navigation.navigate("ChatRoom", {
        chatId: room.id,
        chatName: room.name,
        chatAvatar: room.avatar,
      });
    } else {
      setSelectedRoom(room);
      setShowModal(true);
    }
  };

  // Show confirmation dialog instead of alert
  const handleApplyToJoin = () => {
    setShowModal(false);
    setShowConfirmation(true);
  };

  const renderRoomItem = ({ item }: any) => (
    <Pressable style={styles.card} onPress={() => handleOpenChat(item)}>
      {/* Avatar */}
      <View style={styles.iconContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      </View>

      {/* Chat Info */}
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text 
          style={[
            styles.lastMessage,
            item.unreadCount > 0 && { fontWeight: "bold", color: "#000" },
          ]}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>

      {/* Unread Messages Badge */}
      {item.isJoined && item.unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.unreadCount}</Text>
        </View>
      )}

      {/* Apply text if not joined */}
      {!item.isJoined && (
        <Text style={styles.pendingText}>{t("messages.apply")}</Text>
      )}
    </Pressable>
  );

  return (
    <View style={[styles.container, , { flex: 1, backgroundColor: "#fff" }]}>
      <Text style={styles.title}>{t("messages.title")}</Text>

      {/* ✅ Default Rooms */}
      <FlatList
        data={chatRooms}
        keyExtractor={(item) => item.id}
        renderItem={renderRoomItem}
        contentContainerStyle={{ paddingBottom: 10 }}
      />

      {/* ✅ Suggested Rooms */}
      <Text style={styles.subTitle}>{t("messages.suggestedRooms")}</Text>
      <FlatList
        data={suggestedRooms}
        keyExtractor={(item) => item.id}
        renderItem={renderRoomItem}
        contentContainerStyle={{ paddingBottom: 24 }}
      />

      {/* ✅ Modal for Apply to Join */}
      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t("messages.requestTitle")}</Text>
            <Text style={styles.modalText}>
              {t("messages.requestText", { name: selectedRoom?.name })}
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelText}>{t("common.cancel")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.applyBtn} onPress={handleApplyToJoin}>
                <Text style={styles.applyText}>{t("common.apply")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ✅ Confirmation Dialog */}
      <Modal transparent visible={showConfirmation} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t("messages.requestSent")}</Text>
            <Text style={styles.modalText}>
              {t("messages.confirmText", { name: selectedRoom?.name })}
            </Text>
            <TouchableOpacity style={[styles.applyBtn, { marginTop: 10 }]} onPress={() => setShowConfirmation(false)}>
              <Text style={styles.applyText}>{t("common.ok")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, 
    backgroundColor: "#fff",
    justifyContent: "flex-start",
     padding: 10
     },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    // marginVertical: 16,
    marginBlockStart: 30,
    color: COLORS.light.primary,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    // marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    elevation: 0.4,
    padding: 12,
    marginVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E6F0FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },
  chatInfo: {
    flex: 1,
    flexDirection: "column",
  },
  chatName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  lastMessage: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
  badge: {
    backgroundColor: COLORS.light.primary,
    minWidth: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  pendingText: {
    fontSize: 14,
    color: COLORS.light.primary,
    marginLeft: 8,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "90%",
    elevation: 3,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: COLORS.light.primary,
  },
  modalText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelBtn: {
    marginRight: 15,
    justifyContent: "center"
  },
  cancelText: {
    fontSize: 15,
    color: "#999",
  },
  applyBtn: {
    backgroundColor: COLORS.light.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  applyText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
});
