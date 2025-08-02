import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  SafeAreaView,
  StatusBar,
  PanResponder,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../theme/colors";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";

interface Message {
  id: string;
  text?: string;
  image?: string;
  caption?: string;
  sender: "me" | "other";
  username: string;
  avatar: string;
  timestamp: string;
  replyTo?: string;
}

export default function ChatRoom({ route, navigation }: any) {
  const { t } = useTranslation();

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        // Cleanup if needed
      };
    }, [])
  );

  const { chatName, chatAvatar } = route.params;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Welcome to the chat room 👋",
      sender: "other",
      username: "John Doe",
      avatar: "https://i.pravatar.cc/150?img=1",
      timestamp: "09:30",
    },
    {
      id: "2",
      text: "Hi! Happy to join this group 🙌",
      sender: "me",
      username: "Me",
      avatar: "https://i.pravatar.cc/150?img=2",
      timestamp: "09:32",
    },
    {
      id: "3",
      image: "https://i.pravatar.cc/300",
      caption: "Check this image out!",
      sender: "other",
      username: "John Doe",
      avatar: "https://i.pravatar.cc/150?img=1",
      timestamp: "09:35",
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 200);
  }, [messages]);

  const sendMessage = () => {
    if (inputText.trim() === "") return;
    const newMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "me",
      username: "Me",
      avatar: "https://i.pravatar.cc/150?img=2",
      timestamp: new Date().toLocaleTimeString().slice(0, 5),
      replyTo: replyingTo || undefined,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setReplyingTo(null);
  };

  // Slide-to-reply gesture
  const createPanResponder = (msgId: string) =>
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dx > 25,
      onPanResponderRelease: () => {
        setReplyingTo(msgId);
      },
    });

  const renderMessage = ({ item }: { item: Message }) => {
    const panResponder = createPanResponder(item.id);
    const isMe = item.sender === "me";

    return (
      <View style={[styles.messageRow, isMe ? styles.rowRight : styles.rowLeft]}>
        {/* Avatar */}
        {!isMe && (
          <TouchableOpacity
            onPress={() => navigation.navigate("UserProfile", { userId: item.id })}
          >
            <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
          </TouchableOpacity>
        )}

        {/* Message Bubble */}
        <View
          {...panResponder.panHandlers}
          style={[
            styles.messageContainer,
            isMe ? styles.myMessage : styles.otherMessage,
          ]}
        >
          {!isMe && <Text style={styles.username}>{item.username}</Text>}

          {item.replyTo && (
            <View style={styles.replyBox}>
              <Text style={styles.replyLabel}>Replying to: </Text>
              <Text style={styles.replyText}>
                {messages.find((m) => m.id === item.replyTo)?.text || "Image message"}
              </Text>
            </View>
          )}

          {item.image && (
            <Image source={{ uri: item.image }} style={styles.imageMessage} />
          )}
          {item.caption && <Text style={styles.messageText}>{item.caption}</Text>}
          {item.text && <Text style={styles.messageText}>{item.text}</Text>}

          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{item.timestamp}</Text>
            {isMe && (
              <Ionicons
                name="checkmark-done"
                size={16}
                color={COLORS.light.primary}
                style={{ marginLeft: 6 }}
              />
            )}
          </View>
          
        </View>

        {/* {isMe && (
          <TouchableOpacity>
            <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
          </TouchableOpacity>
        )} */}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() =>
            navigation.navigate("GroupInfo", {
              chatName,
              chatAvatar,
            })
          }
        >
          <Image source={{ uri: chatAvatar }} style={styles.avatar} />
          <Text style={styles.headerTitle}>{chatName}</Text>
        </TouchableOpacity>
      </View>

      {/* Messages with PNG background */}
      <ImageBackground
        source={require("../../assets/images/chat_bg.png")}
        style={[styles.chatBg, { flex: 1 }]}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
        />
      </ImageBackground>

      {/* Replying preview */}
      {replyingTo && (
        <View style={styles.replyingBox}>
          <Text style={{ color: "#333" }}>
            Replying to:{" "}
            {messages.find((m) => m.id === replyingTo)?.text || "Image message"}
          </Text>
          <TouchableOpacity onPress={() => setReplyingTo(null)}>
            <Ionicons name="close" size={18} color="#555" />
          </TouchableOpacity>
        </View>
      )}

      {/* Input bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity>
            <Ionicons
              name="image-outline"
              size={22}
              color={COLORS.light.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 8 }}>
            <Ionicons
              name="mic-outline"
              size={22}
              color={COLORS.light.primary}
            />
          </TouchableOpacity>

          <TextInput
            placeholder={t("messages.typeMessage") || "Type a message..."}
            placeholderTextColor="#aaa"
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            multiline
            numberOfLines={1}
            maxLength={300}
          />
          <TouchableOpacity onPress={sendMessage}>
            <Ionicons name="send" size={22} color={COLORS.light.primary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  chatBg: {
    // backgroundColor: "#e6f0ff", // example light blue background, change as you like
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 18,
    marginHorizontal: 10,
  },
  headerTitle: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  chatList: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 4,
  },
  rowLeft: { alignSelf: "flex-start" },
  rowRight: { alignSelf: "flex-end", flexDirection: "row-reverse" },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginHorizontal: 6,
  },
  username: {
    fontSize: 11,
    color: "#555",
    fontWeight: "600",
    marginBottom: 2,
  },
  messageContainer: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 10,
    marginVertical: 6,
  },
  myMessage: {
    backgroundColor: "#d4f5f0",
    borderBottomRightRadius: 2,
  },
  otherMessage: {
    backgroundColor: "#e5e5e5",
    borderBottomLeftRadius: 2,
  },
  messageText: {
    color: "#000",
    fontSize: 15,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  timeText: {
    fontSize: 11,
    color: "#555",
    marginTop: 4,
  },
  imageMessage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderTopWidth: 0.5,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    fontSize: 15,
    maxHeight: 120,
  },
  replyingBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e0f2f1",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.light.primary,
  },
  replyBox: {
    backgroundColor: "#c9e9e4",
    padding: 4,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.light.primary,
    marginBottom: 4,
    borderRadius: 4,
  },
  replyLabel: {
    fontSize: 11,
    color: "#555",
    fontWeight: "bold",
  },
  replyText: {
    fontSize: 12,
    color: "#333",
  },
});
