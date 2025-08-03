import React, { useState, useRef, useEffect } from "react";
import ImmersiveMode from "react-native-immersive-mode";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  FlatList,
  TextInput,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Video from "react-native-video";

const { width, height } = Dimensions.get("window");

const commentsData = [
  {
    id: "1",
    user: { name: "John Doe", avatar: "https://i.pravatar.cc/40" },
    text: "This is a top-level comment.",
    replies: [
      {
        id: "1-1",
        user: { name: "Alice", avatar: "https://i.pravatar.cc/41" },
        text: "This is a reply.",
      },
    ],
  },
];

const PostDetail = ({ route, navigation }: any) => {
  useEffect(() => {
    ImmersiveMode.fullLayout(true);
    ImmersiveMode.setBarMode("FullSticky");
    ImmersiveMode.setBarStyle("Light");

    return () => {
      ImmersiveMode.fullLayout(false);
      ImmersiveMode.setBarMode("Normal");
    };
  }, []);

  const { post } = route.params;

  const [showCaption, setShowCaption] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);
  // const [scale] = useState(new Animated.Value(1));
  // // For zoom effect
  const [scale] = useState(new Animated.Value(1));
  
  
const [isZoomed, setIsZoomed] = useState(false);
const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
const [isUIVisible, setIsUIVisible] = useState(true);

  const toggleUI = () => {
    setUiVisible(!uiVisible);
  };

  const handleLongPress = () => {
    const newZoom = !isZoomed;
    setIsZoomed(newZoom);
    setIsUIVisible(!newZoom); // hide UI when zoomed in
    Animated.spring(scale, {
      toValue: newZoom ? 2 : 1,
      useNativeDriver: true,
    }).start();
  };
  

  const openComments = () => {
    setShowCaption(false);
    setShowComments(true);
  };

  const toggleVideoFullscreen = () => {
    const newState = !isVideoFullscreen;
    setIsVideoFullscreen(newState);
    setIsUIVisible(!newState); // hide UI when video fullscreen
  };

  const renderCommentItem = ({ item }: any) => (
    <View style={styles.commentItem}>
      <Image source={{ uri: item.user.avatar }} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <Text style={styles.commentName}>{item.user.name}</Text>
        <Text style={styles.commentText}>{item.text}</Text>
        {item.replies.map((reply: any) => (
          <View key={reply.id} style={styles.replyItem}>
            <Image
              source={{ uri: reply.user.avatar }}
              style={styles.replyAvatar}
            />
            <View style={styles.replyContent}>
              <Text style={styles.commentName}>{reply.user.name}</Text>
              <Text style={styles.commentText}>{reply.text}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ✅ Media Section (Tap & Zoom) */}
      <TouchableOpacity
        style={styles.imageWrapper}
        activeOpacity={1}
        onPress={toggleUI}
        onLongPress={handleLongPress}
        delayLongPress={200}
      >
        {post.video ? (
          <Video
            source={post.video}
            style={styles.postImage}
            controls={true}
            resizeMode="contain"
          />
        ) : (
          <Animated.Image
            source={post.images[0]}
            style={[styles.postImage, { transform: [{ scale }] }]}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>

      {/* ✅ UI Elements (hide/show on tap) */}
      {uiVisible && (
        <>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          {/* Reaction Bar */}
          <View style={styles.reactionBar}>
            <TouchableOpacity style={styles.reactionBtn}>
              <Icon name="eye-outline" size={28} color="#fff" />
              <Text style={styles.reactionText}>508k</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.reactionBtn}>
              <Icon name="heart-outline" size={28} color="#fff" />
              <Text style={styles.reactionText}>368k</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.reactionBtn} onPress={openComments}>
              <Icon name="chatbubble-outline" size={28} color="#fff" />
              <Text style={styles.reactionText}>5k</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.reactionBtn}>
              <Icon name="share-social-outline" size={28} color="#fff" />
              <Text style={styles.reactionText}>5k</Text>
            </TouchableOpacity>
          </View>

          {/* Caption Overlay */}
          <View style={styles.captionOverlay}>
            <View style={styles.userRow}>
              <Image source={post.user.profileImage} style={styles.avatar} />
              <Text style={styles.username}>{post.user.name}</Text>
            </View>
            <View style={styles.userRow}>
              <Text numberOfLines={2} style={styles.captionText}>
                {post.text}
              </Text>
              <TouchableOpacity onPress={() => setShowCaption(true)}>
                <Icon name="ellipsis-horizontal" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Comment Bar */}
          <TouchableOpacity onPress={openComments}>
            <View style={styles.commentBar}>
              <Text style={styles.commentInput1}>Add a comment...</Text>
              <Icon
                name="happy-outline"
                size={22}
                color="#ccc"
                style={{ marginHorizontal: 6 }}
              />
              <Icon name="send" size={22} color="#ccc" />
            </View>
          </TouchableOpacity>
        </>
      )}

      {/* ✅ Comments Drawer */}
      {showComments && (
        <View style={styles.drawerOverlay}>
          <View style={styles.commentDrawer}>
            <View style={styles.drawerHeader}>
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                Comments
              </Text>
              <TouchableOpacity onPress={() => setShowComments(false)}>
                <Icon name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={commentsData}
              keyExtractor={(item) => item.id}
              renderItem={renderCommentItem}
              showsVerticalScrollIndicator={false}
            />

            <View style={styles.commentBar}>
              <TextInput
                placeholder="Add a comment..."
                placeholderTextColor="#ccc"
                style={styles.commentInput}
              />
              <Icon
                name="happy-outline"
                size={22}
                color="#ccc"
                style={{ marginHorizontal: 6 }}
              />
              <Icon name="send" size={22} color="#ccc" />
            </View>
          </View>
        </View>
      )}

      {/* ✅ Full Caption Drawer */}
      {showCaption && (
        <View style={styles.drawerOverlay}>
          <View style={styles.drawerContent}>
            <Text style={styles.fullCaption}>{post.text}</Text>
            <TouchableOpacity onPress={() => setShowCaption(false)}>
              <Text
                style={{ color: "#fff", marginTop: 20, textAlign: "center" }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  imageWrapper: { flex: 1, justifyContent: "center", alignItems: "center" },
  postImage: { width: width, height: height * 0.65 },
  backBtn: {
    position: "absolute",
    top: 40,
    left: 10,
    zIndex: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 6,
    borderRadius: 20,
  },
  reactionBar: {
    position: "absolute",
    right: 2,
    top: height * 0.45,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 20,
  },
  reactionBtn: { alignItems: "center", marginBottom: 20 },
  reactionText: { color: "#fff", fontSize: 12, marginTop: 3 },
  captionOverlay: {
    position: "absolute",
    bottom: 55,
    left: 0,
    right: 0,
    flexDirection: "column",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  userRow: { flexDirection: "row", alignItems: "center", flex: 1 },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  username: { color: "#fff", fontWeight: "bold", marginRight: 8 },
  captionText: { flex: 1, color: "#fff", marginLeft: 8 },
  commentBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#111",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  commentInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    height: 40,
    borderColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 5,
  },
  commentInput1: { flex: 1, color: "#fff", fontSize: 14, height: 40 },
  drawerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  commentDrawer: {
    backgroundColor: "#1e1e1e",
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: height * 0.6,
  },
  drawerHeader: { flexDirection: "row", justifyContent: "space-between" },
  commentItem: { flexDirection: "row", marginVertical: 8 },
  commentAvatar: {
    width: 35,
    height: 35,
    borderRadius: 18,
    marginRight: 8,
  },
  commentContent: { flex: 1 },
  commentName: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  commentText: { color: "#ddd", fontSize: 13, marginVertical: 2 },
  replyItem: { flexDirection: "row", marginTop: 6, marginLeft: 40 },
  replyAvatar: { width: 28, height: 28, borderRadius: 14, marginRight: 6 },
  replyContent: { flex: 1 },
  drawerContent: {
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.6,
  },
  fullCaption: { color: "#fff", fontSize: 16, lineHeight: 22 },
});

export default PostDetail;
