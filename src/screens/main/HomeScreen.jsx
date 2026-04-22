import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import PostCard from "../../components/posts/PostCard"; // Birazdan oluşturacağız

const HomeScreen = () => {
  // Webdeki verilerine benzer örnek bir veri seti
  const posts = [
    {
      id: "1",
      user: "Ahmet Yılmaz",
      title: "Matematik Çalışma Arkadaşı",
      content: "Vize sınavı için kütüphanede çalışacak arkadaş arıyorum.",
      time: "2s önce",
    },
    {
      id: "2",
      user: "Zeynep Kaya",
      title: "Kayıp Anahtarlık",
      content: "Yemekhane önünde mavi bir anahtarlık buldum.",
      time: "5s önce",
    },
    {
      id: "3",
      user: "Can Demir",
      title: "Halısaha Maçı",
      content: "Bu akşam 22:00 maçı için 2 kişi eksik.",
      time: "1sa önce",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kampüs Akışı</Text>
      </View>

      <FlatList
        data={posts} // Malzeme listemiz
        keyExtractor={(item) => item.id} // Her birine ayrı bir kimlik
        renderItem={({ item }) => <PostCard post={item} />} // Her birini nasıl pişireceğiz?
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false} // O çirkin yan barı kapatalım
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "#fff",
    elevation: 2,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#1B4332" },
  listContent: { padding: 15, paddingBottom: 100 }, // Alt barın altında kalmasın diye padding
});

export default HomeScreen;
