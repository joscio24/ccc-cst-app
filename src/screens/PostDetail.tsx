import React from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import styles from "./styles";

const { width } = Dimensions.get("window");

const PostDetail = ({ route }: any) => {
  const { post } = route.params;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* ✅ Images Section */}
      {post.images.length === 1 ? (
        // --- Single Image like Facebook ---
        <View>
          <Image
            source={post.images[0]}
            style={[styles.detailImage, { width: width, height: 350 }]}
            resizeMode="cover"
          />

          {/* Floating icons on single image */}
          <View style={styles.floatingIcons}>
            <TouchableOpacity style={styles.floatingBtn}>
              <Icon name="heart-outline" size={26} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatingBtn}>
              <Icon name="chatbubble-outline" size={26} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatingBtn}>
              <Icon name="share-social-outline" size={26} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // --- Multiple Images Scrollable ---
        <View style={{ height: 350 }}>
          <FlatList
            data={post.images}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Image
                source={item}
                style={[styles.detailImage, { width: width, height: 350 }]}
                resizeMode="cover"
              />
            )}
          />

          {/* Floating icons on scrollable images */}
          <View style={styles.floatingIcons}>
            <TouchableOpacity style={styles.floatingBtn}>
              <Icon name="heart-outline" size={26} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatingBtn}>
              <Icon name="chatbubble-outline" size={26} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatingBtn}>
              <Icon name="share-social-outline" size={26} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ✅ Post content */}
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.content}>
          <View style={styles.profileRow}>
            <Image source={post.user.profileImage} style={styles.avatar} />
            <Text style={styles.username}>{post.user.name}</Text>
          </View>
          <Text style={styles.text}>{post.text}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default PostDetail;
