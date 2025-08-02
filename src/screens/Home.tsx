import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import Video from "react-native-video";
import { Audio } from "expo-av";

import postsData from "./posts";
import styles from "./styles";

const Home = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("news");
  const [posts] = useState(postsData);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Play audio function
  const playAudio = async (audioFile: any, postId: string) => {
    try {
      if (sound) {
        await sound.unloadAsync();
        setPlayingId(null);
      }
      const { sound: newSound } = await Audio.Sound.createAsync(audioFile);
      setSound(newSound);
      setPlayingId(postId);
      await newSound.playAsync();
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && !status.isPlaying) {
          setPlayingId(null);
          newSound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  // Render post images (same as before)
  const renderPostImages = (images: any[]) => {
    if (images.length === 1) {
      return <Image source={images[0]} style={styles.singleImage} />;
    }
    return (
      <View style={styles.imageGrid}>
        {images.map((img, index) => (
          <Image key={index} source={img} style={styles.gridImage} />
        ))}
      </View>
    );
  };

  // Render media (video, audio, or images)
  const renderPostMedia = (post: any) => {
    if (post.video) {
      return (
        <Video
          source={post.video}
          style={videoStyles.video}
          controls={true}
          resizeMode="cover"
          paused={true}
        />
      );
    }
    if (post.audio) {
      return (
        <TouchableOpacity
          style={audioStyles.audioContainer}
          onPress={() => playAudio(post.audio, post.id)}
        >
          <Icon
            name={playingId === post.id ? "pause-circle" : "play-circle"}
            size={40}
            color="#007bff"
          />
          <Text style={audioStyles.audioText}>
            {playingId === post.id
              ? t("home.audioPlaying")
              : t("home.audioPlay")}
          </Text>
        </TouchableOpacity>
      );
    }
    if (post.images?.length) {
      return renderPostImages(post.images);
    }
    return null;
  };

  // Render post for NEWS (standard post card)
  const renderNewsPost = (post: any) => (
    <View style={styles.postCard}>
      <View style={styles.profileRow}>
        <Image source={post.user.profileImage} style={styles.avatar} />
        <Text style={styles.username}>{post.user.name}</Text>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("PostDetail", { post })}>
        {renderPostMedia(post)}
      </TouchableOpacity>

      <Text
        style={styles.postText}
        numberOfLines={post.isLongText ? 2 : undefined}
      >
        {post.text}
      </Text>
      {post.isLongText && (
        <TouchableOpacity onPress={() => navigation.navigate("PostDetail", { post })}>
          <Text style={styles.seeMore}>{t("home.seeMore")}</Text>
        </TouchableOpacity>
      )}

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn}>
          <Icon name="heart-outline" size={22} color="#444" />
          <Text style={styles.actionText}>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate("PostDetail", { post })}
        >
          <Icon name="chatbubble-outline" size={22} color="#444" />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Icon name="share-social-outline" size={22} color="#444" />
          <Text style={styles.actionText}>{post.shares}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render announcement post (different style)
  const renderAnnouncementPost = (post: any) => (
    <View style={[styles.postCard, { backgroundColor: "#e7f3ff" }]}>
      <Text style={[styles.titleSimple, { marginBottom: 6 }]}>{post.title}</Text>
      <Text style={{ color: "#666", fontSize: 12, marginBottom: 6 }}>
        {post.date}
      </Text>
      <Image source={post.image} style={styles.singleImage} />
      <Text style={{ marginVertical: 10 }}>{post.content}</Text>
      {post.audio && renderPostMedia(post)}
    </View>
  );

  // Render reform post
  const renderReformPost = (post: any) => (
    <View style={[styles.postCard, { backgroundColor: "#fff7e6" }]}>
      <Text style={[styles.titleSimple, { marginBottom: 6 }]}>{post.title}</Text>
      <Text style={{ fontWeight: "bold", marginBottom: 4 }}>{post.summary}</Text>
      <Text>{post.fullText}</Text>
      <Text style={{ fontSize: 10, marginTop: 8, color: "#555" }}>
        {t("home.updatedBy")}: {post.updatedBy} | {t("home.updatedOn")}: {post.updatedOn}
      </Text>
    </View>
  );

  // Render decision post
  const renderDecisionPost = (post: any) => (
    <View style={[styles.postCard, { backgroundColor: "#e6fff7" }]}>
      <Text style={[styles.titleSimple, { marginBottom: 6 }]}>{post.decisionTitle}</Text>
      <Text style={{ color: "#666", fontSize: 12, marginBottom: 6 }}>
        {post.decisionDate}
      </Text>
      <Text style={{ fontWeight: "bold", marginBottom: 6 }}>{post.decisionSummary}</Text>
      <Text>{post.decisionDetails}</Text>
    </View>
  );

  // Render event post
  const renderEventPost = (post: any) => (
    <View style={[styles.postCard, { backgroundColor: "#f0f7ff" }]}>
      <Text style={[styles.titleSimple, { marginBottom: 6 }]}>{post.eventName}</Text>
      <Text style={{ color: "#666", fontSize: 12 }}>{post.eventDate} - {post.eventLocation}</Text>
      <Image source={post.bannerImage} style={styles.singleImage} />
      <Text style={{ marginTop: 10 }}>{post.description}</Text>
    </View>
  );

  // Main render post switch by category
  const renderPost = ({ item }: any) => {
    switch (item.category) {
      case "news":
        return renderNewsPost(item);
      case "announcements":
        return renderAnnouncementPost(item);
      case "reforms":
        return renderReformPost(item);
      case "decisions":
        return renderDecisionPost(item);
      case "events":
        return renderEventPost(item);
      default:
        return null;
    }
  };

  // Filter posts by selected tab/category
  const filteredPosts = posts.filter((p) => p.category === activeTab);

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header1}>
        <Text style={styles.titleSimple2}>{t("home.explore")}</Text>

        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
            <Icon
              name="notifications-outline"
              size={24}
              color="#444"
              style={styles.iconRight}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Settings")}>
            <Icon name="settings-outline" size={24} color="#444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" />
        <TextInput
          style={styles.searchInput}
          placeholder={t("home.searchPlaceholder")}
          placeholderTextColor="#888"
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          {[
            { key: "news", label: t("home.tabs.news") },
            { key: "announcements", label: t("home.tabs.announcements") },
            { key: "reforms", label: t("home.tabs.reforms") },
            { key: "decisions", label: t("home.tabs.decisions") },
            { key: "events", label: t("home.tabs.events") },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tabButton,
                activeTab === tab.key && styles.tabButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Posts List */}
      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const videoStyles = StyleSheet.create({
  video: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
});

const audioStyles = StyleSheet.create({
  audioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  audioText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#007bff",
  },
});

export default Home;
