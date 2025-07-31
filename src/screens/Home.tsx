import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTranslation } from "react-i18next"; // ✅ Import translation hook
import postsData from "./posts";
import styles from "./styles";

const Home = ({ navigation }: any) => {
  const { t } = useTranslation(); // ✅ Initialize translation
  const [activeTab, setActiveTab] = useState("news");
  const [posts] = useState(postsData);

  // ✅ Handles single/multiple images
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

  // ✅ Render individual post
  const renderPost = ({ item }: any) => (
    <View style={styles.postCard}>
      {/* Profile row */}
      <View style={styles.profileRow}>
        <Image source={item.user.profileImage} style={styles.avatar} />
        <Text style={styles.username}>{item.user.name}</Text>
      </View>

      {/* Images */}
      <TouchableOpacity
        onPress={() => navigation.navigate("PostDetail", { post: item })}
      >
        {renderPostImages(item.images)}
      </TouchableOpacity>

      {/* Text */}
      <Text
        style={styles.postText}
        numberOfLines={item.isLongText ? 2 : undefined}
      >
        {item.text}
      </Text>
      {item.isLongText && (
        <TouchableOpacity
          onPress={() => navigation.navigate("PostDetail", { post: item })}
        >
          <Text style={styles.seeMore}>{t("home.seeMore")}</Text>
        </TouchableOpacity>
      )}

      {/* Action buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn}>
          <Icon name="heart-outline" size={22} color="#444" />
          <Text style={styles.actionText}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate("PostDetail", { post: item })}
        >
          <Icon name="chatbubble-outline" size={22} color="#444" />
          <Text style={styles.actionText}>{item.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Icon name="share-social-outline" size={22} color="#444" />
          <Text style={styles.actionText}>{item.shares}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.titleSimple}>{t("home.explore")}</Text>
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
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Home;
