import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Animated,
  PanResponder,
  StyleSheet,
  Modal,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";
import styles from "./chatStyle";
import * as ImagePicker from "expo-image-picker";
import { COLORS } from "../theme/colors";

interface Message {
  id: string;
  text?: string;
  image?: string[];
  caption?: string;
  sender: "me" | "other";
  username: string;
  avatar: string;
  timestamp: string;
  replyTo?: string;
  isSending?: boolean;
  uploadProgress?: number; // Add upload progress field
  type?: "text" | "image" | "doc" | "audio" | "video";
  animatedValue?: Animated.Value;
  docName?: string; // document file name
  docUri?: string; // local uri for document
  videoUri?: string; // local uri for document
  imageUri?: string; // local uri for document
  audioUri?: string; // local uri for document
}

export default function ChatRoom({ route, navigation }: any) {
  const { t } = useTranslation();
  const { chatName, chatAvatar } = route.params;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! Welcome to the chat room 👋",
      sender: "other",
      username: "John Doe",
      avatar: "https://i.pravatar.cc/150?img=1",
      timestamp: "09:30",
      animatedValue: new Animated.Value(0),
    },
    {
      id: "2",
      text: "Hi! Happy to join this group 🙌",
      sender: "me",
      username: "Me",
      avatar: "https://i.pravatar.cc/150?img=2",
      timestamp: "09:32",
      animatedValue: new Animated.Value(0),
    },
    {
      id: "3",
      image: ["https://i.pravatar.cc/300"],
      caption: "Check these images!",
      sender: "other",
      username: "John Doe",
      avatar: "https://i.pravatar.cc/150?img=1",
      timestamp: "09:35",
      type: "image",
      animatedValue: new Animated.Value(0),
    },
    {
      id: "4",
      image: ["https://i.pravatar.cc/300"],
      caption: "Check these images!",
      sender: "me",
      username: "John Doe",
      avatar: "https://i.pravatar.cc/150?img=1",
      timestamp: "09:35",
      type: "image",
      animatedValue: new Animated.Value(0),
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const downloadController = useRef<FileSystem.DownloadResumable | null>(null);

  const [showAttachmentSheet, setShowAttachmentSheet] = useState(false);

  useFocusEffect(React.useCallback(() => () => {}, []));

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 200);
  }, [messages]);

  const sendMessage = () => {
    if (!inputText.trim()) return;
    const id = Date.now().toString();
    const newMsg: Message = {
      id,
      text: inputText,
      sender: "me",
      username: "Me",
      avatar: "https://i.pravatar.cc/150?img=2",
      timestamp: new Date().toLocaleTimeString().slice(0, 5),
      replyTo: replyingTo || undefined,
      isSending: true,
      type: "text",
      animatedValue: new Animated.Value(0),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setReplyingTo(null);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, isSending: false } : msg))
      );
    }, 2000);
  };

  // Document picker and upload simulation
  const selectDocument = async () => {
    setShowAttachmentSheet(false);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });

      if (result.canceled) return;

      const id = Date.now().toString();
      const newMsg: Message = {
        id,
        sender: "me",
        username: "Me",
        avatar: "https://i.pravatar.cc/150?img=2",
        timestamp: new Date().toLocaleTimeString().slice(0, 5),
        isSending: true,
        type: "doc",
        docName: result.output?.item.name,
        docUri: result.assets?.with.name,
        uploadProgress: 0,
        animatedValue: new Animated.Value(0),
      };

      setMessages((prev) => [...prev, newMsg]);

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.1;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === id
              ? { ...msg, uploadProgress: Math.min(progress, 1) }
              : msg
          )
        );
        if (progress >= 1) {
          clearInterval(interval);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === id ? { ...msg, isSending: false } : msg
            )
          );
        }
      }, 300);
    } catch (e) {
      console.log("Document picker error:", e);
    }
  };

  const createPanResponder = (msg: Message) =>
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dx > 25,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0) {
          msg.animatedValue?.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: () => {
        setReplyingTo(msg.id);
        Animated.timing(msg.animatedValue!, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      },
    });
  const [downloadedImages, setDownloadedImages] = useState<{
    [key: string]: string;
  }>({});

  const startDownload = async (url: string, msgId: string) => {
    try {
      setDownloadingId(msgId);
      setDownloadProgress(0);

      const callback = (downloadProgress: FileSystem.DownloadProgressData) => {
        const progress =
          downloadProgress.totalBytesWritten /
          downloadProgress.totalBytesExpectedToWrite;
        setDownloadProgress(progress);
      };

      const fileUri =
        FileSystem.documentDirectory +
        (url.split("/").pop() || `file_${msgId}.jpg`);

      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        fileUri,
        {},
        callback
      );
      downloadController.current = downloadResumable;

      const result = await downloadResumable.downloadAsync();
      setDownloadingId(null);

      if (result && result.uri) {
        setDownloadedImages((prev) => ({ ...prev, [msgId]: result.uri }));
      }
    } catch (e) {
      console.log("Download cancelled or failed:", e);
      setDownloadingId(null);
    }
  };

  const cancelDownload = () => {
    if (downloadController.current) {
      downloadController.current.pauseAsync();
      setDownloadingId(null);
      setDownloadProgress(0);
    }
  };

  const renderImageGrid = (item: Message) => {
    const images = item.image || [];
    const msgId = item.id;
    const displayedImages = images.slice(0, 4);
    const isDownloaded = downloadedImages[msgId];
    const isMe = item.sender === "me";

    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 2 }}>
        {displayedImages.map((img, index) => {
          const imageSource = isDownloaded
            ? { uri: isDownloaded }
            : { uri: img };

          return (
            <TouchableOpacity
              key={index}
              style={{
                width: images.length === 1 ? 200 : 100,
                height: images.length === 1 ? 200 : 100,
                margin: 1,
              }}
              onPress={() => {
                if (!isDownloaded) {
                  startDownload(img, msgId);
                } else {
                  console.log("Viewing downloaded image:", isDownloaded);
                }
              }}
            >
              <Image
                source={imageSource}
                style={{ width: "100%", height: "100%", borderRadius: 6 }}
                blurRadius={
                  !isDownloaded && downloadingId !== msgId && !isMe ? 100 : 0
                }
              />

              {index === 3 && images.length > 4 && (
                <View
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 6,
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 18 }}>
                    +{images.length - 4}
                  </Text>
                </View>
              )}

              {!isDownloaded && (
                <>
                  {!isMe && (
                    <>
                      {downloadingId === msgId ? (
                        <View
                          style={{
                            ...StyleSheet.absoluteFillObject,
                            backgroundColor: "rgba(0,0,0,0.4)",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <TouchableOpacity onPress={cancelDownload}>
                            <Ionicons
                              name="close-circle-outline"
                              size={36}
                              color={COLORS.white}
                            />
                          </TouchableOpacity>
                          <Text style={{ color: "#fff" }}>
                            {Math.floor(downloadProgress * 100)}%
                          </Text>
                        </View>
                      ) : (
                        <Ionicons
                          name="download"
                          size={24}
                          color="#fff"
                          style={{ position: "absolute", bottom: 8, right: 8 }}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const simulateUpload = (id: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.1;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id
            ? { ...msg, uploadProgress: Math.min(progress, 1) }
            : msg
        )
      );
      if (progress >= 1) {
        clearInterval(interval);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === id ? { ...msg, isSending: false } : msg
          )
        );
      }
    }, 300);
  };

  const selectImage = async () => {
    setShowAttachmentSheet(false);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });
      if (result.canceled) return;

      const images = result.assets.map((asset) => asset.uri);
      const id = Date.now().toString();
      const newMsg: Message = {
        id,
        sender: "me",
        username: "Me",
        avatar: "https://i.pravatar.cc/150?img=2",
        timestamp: new Date().toLocaleTimeString().slice(0, 5),
        isSending: true,
        type: "image",
        image: images,
        uploadProgress: 0,
        animatedValue: new Animated.Value(0),
      };

      setMessages((prev) => [...prev, newMsg]);
      simulateUpload(id);
    } catch (e) {
      console.log("Image picker error:", e);
    }
  };

  // Video picker
  const selectVideo = async () => {
    setShowAttachmentSheet(false);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsMultipleSelection: false,
        quality: 1,
      });
      if (result.canceled) return;

      const id = Date.now().toString();
      const videoUri = result.assets[0].uri;
      const newMsg: Message = {
        id,
        sender: "me",
        username: "Me",
        avatar: "https://i.pravatar.cc/150?img=2",
        timestamp: new Date().toLocaleTimeString().slice(0, 5),
        isSending: true,
        type: "video",
        videoUri,
        uploadProgress: 0,
        animatedValue: new Animated.Value(0),
      };

      setMessages((prev) => [...prev, newMsg]);
      simulateUpload(id);
    } catch (e) {
      console.log("Video picker error:", e);
    }
  };

  // Audio picker
  const selectAudio = async () => {
    setShowAttachmentSheet(false);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        multiple: false,
      });
      if (result.canceled) return;

      const id = Date.now().toString();
      const newMsg: Message = {
        id,
        sender: "me",
        username: "Me",
        avatar: "https://i.pravatar.cc/150?img=2",
        timestamp: new Date().toLocaleTimeString().slice(0, 5),
        isSending: true,
        type: "audio",
        docName: result.output?.item.name,
        audioUri: result.assets?.with.name,
        uploadProgress: 0,
        animatedValue: new Animated.Value(0),
      };

      setMessages((prev) => [...prev, newMsg]);
      simulateUpload(id);
    } catch (e) {
      console.log("Audio picker error:", e);
    }
  };
  // Render document message with name and upload progress
  const renderDocMessage = (item: Message) => {
    const isMe = item.sender === "me";
    return (
      <View
        style={[
          styles.docMessageContainer,
          isMe ? styles.myBubble : styles.otherBubble,
        ]}
      >
        <Ionicons
          name="document-text-outline"
          size={32}
          color={isMe ? "#0084ff" : "#555"}
          style={{ marginRight: 8 }}
        />
        <View style={{ flexShrink: 1 }}>
          <Text style={[styles.messageText, { fontWeight: "600" }]}>
            {item.docName || "Document"}
          </Text>
          {item.isSending && (
            <Text style={{ color: "#888", fontSize: 12, marginTop: 4 }}>
              Uploading... {Math.floor((item.uploadProgress || 0) * 100)}%
            </Text>
          )}
        </View>
      </View>
    );
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender === "me";
    const panResponder = createPanResponder(item);

    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          transform: [
            { translateX: item.animatedValue || new Animated.Value(0) },
          ],
        }}
      >
        <View
          style={[styles.messageRow, isMe ? styles.rowRight : styles.rowLeft]}
        >
          {!isMe && (
            <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
          )}
          {item.type === "doc" ? (
            renderDocMessage(item)
          ) : (
            <View
              style={[
                styles.messageBubble,
                isMe ? styles.myBubble : styles.otherBubble,
              ]}
            >
              {!isMe && <Text style={styles.username}>{item.username}</Text>}

              {item.replyTo && (
                <View style={styles.replyBox}>
                  <Text style={styles.replyLabel}>Replying to:</Text>
                  <Text style={styles.replyText}>
                    {messages.find((m) => m.id === item.replyTo)?.text ||
                      "Image message"}
                  </Text>
                </View>
              )}

              {item.image && renderImageGrid(item)}

              {item.caption && (
                <Text style={styles.messageText}>{item.caption}</Text>
              )}
              {item.text && <Text style={styles.messageText}>{item.text}</Text>}

              <View style={styles.footerRow}>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
                {isMe &&
                  (item.isSending ? (
                    <Ionicons name="time-outline" size={14} color="#aaa" />
                  ) : (
                    <Ionicons name="checkmark-done" size={14} color="#aaa" />
                  ))}
              </View>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderAttachmentSheet = () => (
    <Modal visible={showAttachmentSheet} transparent animationType="slide">
      <View style={styles.attachmentSheet}>
        <View style={styles.attachmentGrid}>
          <TouchableOpacity
            onPress={selectDocument}
            style={styles.attachmentCard}
          >
            <Ionicons
              name="document-text-outline"
              size={36}
              color={COLORS.light.primary}
            />
            <Text style={styles.attachmentLabel}>Documents</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={selectImage} style={styles.attachmentCard}>
            <Ionicons
              name="image-outline"
              size={36}
              color={COLORS.light.primary}
            />
            <Text style={styles.attachmentLabel}>Images</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={selectVideo} style={styles.attachmentCard}>
            <Ionicons
              name="videocam-outline"
              size={36}
              color={COLORS.light.primary}
            />
            <Text style={styles.attachmentLabel}>Videos</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={selectAudio} style={styles.attachmentCard}>
            <Ionicons
              name="musical-notes-outline"
              size={36}
              color={COLORS.light.primary}
            />
            <Text style={styles.attachmentLabel}>Audio</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setShowAttachmentSheet(false)}
          style={styles.attachmentCancelBtn}
        >
          <Text style={styles.attachmentCancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 34} // Adjust if header overlaps
      >
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerGroup}
              onPress={() =>
                navigation.navigate("GroupInfo", { chatName, chatAvatar })
              }
            >
              <Image source={{ uri: chatAvatar }} style={styles.headerAvatar} />
              <View>
                <Text style={styles.headerTitle}>{chatName}</Text>
                <Text style={{ fontSize: 12, color: "#666" }}>
                  623k members
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="call-outline" size={22} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Chat Background */}
          <View style={styles.chatBg}>
            <Image
              source={require("../../assets/images/chatBg.jpg")}
              style={styles.chatTiledBg}
              resizeMode="repeat" // works only on iOS
            />
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              contentContainerStyle={styles.chatList}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />
          </View>

          {/* Replying */}
          {replyingTo && (
            <View style={styles.replyPreview}>
              <Text style={styles.replyPreviewText}>
                Replying:{" "}
                {messages.find((m) => m.id === replyingTo)?.text || "Image"}
              </Text>
              <TouchableOpacity onPress={() => setReplyingTo(null)}>
                <Ionicons name="close" size={20} color="#555" />
              </TouchableOpacity>
            </View>
          )}

          {/* Input Area */}
          <View style={styles.inputArea}>
            <TouchableOpacity onPress={() => setShowAttachmentSheet(true)}>
              <Ionicons name="document-attach-outline" size={24} color="#555" />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginHorizontal: 8 }}>
              <Ionicons name="mic-outline" size={24} color="#555" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder={t("messages.typeMessage") || "Type a message..."}
              placeholderTextColor="#aaa"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity onPress={sendMessage}>
              <Ionicons name="send" size={24} color="#2FA5A9" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {renderAttachmentSheet()}
    </SafeAreaView>
  );
}
