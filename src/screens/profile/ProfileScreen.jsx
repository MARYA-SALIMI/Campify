import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EditProfileModal from '../../components/profile/EditProfileModal';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { getAllPosts } from '../../services/postService';

const { width } = Dimensions.get('window');

// --- Tarih Formatlayıcıları ---
const formatFullDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const timeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return 'Az önce';
  if (minutes < 60) return `${minutes} dk önce`;
  if (hours < 24) return `${hours} sa önce`;
  if (days === 1) return 'Dün';
  return `${days} gün önce`;
};

const ProfileScreen = () => {
  const { logout, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('posts'); // Sadece posts ve about kaldı

  const fetchData = async () => {
    try {
      const currentUserId = user?.uid || user?.id || user?._id;
      if (currentUserId) {
        const [profileData, allPosts] = await Promise.all([
          authService.getProfile(currentUserId),
          getAllPosts()
        ]);

        setProfile(profileData);

        const userPosts = allPosts.filter(
          (post) => post.userId === currentUserId || (post.userId && post.userId._id === currentUserId)
        );

        userPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(userPosts);
      }
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [user]);

  const firstName = profile?.firstName || profile?.ad || '';
  const lastName = profile?.lastName || profile?.soyad || '';
  const fullName = firstName ? `${firstName} ${lastName}`.trim() : "Kullanıcı";
  const initialLetter = firstName ? String(firstName[0]).toUpperCase() : "M";

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        stickyHeaderIndices={[2]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" colors={['#10b981']} />}
      >
        
        {/* --- HEADER --- */}
        <View style={styles.headerWrapper}>
          <LinearGradient colors={['#064e3b', '#020617']} style={StyleSheet.absoluteFill} />
          <View style={styles.profileMainInfo}>
            <View style={styles.avatarNeonContainer}>
              <LinearGradient colors={['#10b981', '#3b82f6']} style={styles.avatarGradientBorder}>
                <View style={styles.avatarInner}><Text style={styles.avatarInitialText}>{initialLetter}</Text></View>
              </LinearGradient>
            </View>
            <Text style={styles.titleName}>{fullName}</Text>
            {profile?.bolum && (
              <View style={styles.statusBadge}><Text style={styles.statusText}>{String(profile.bolum).toUpperCase()}</Text></View>
            )}
          </View>
        </View>

        <View style={{ height: 20 }} />

        {/* --- NAVBAR (Yorumlar Kaldırıldı) --- */}
        <View style={styles.stickyNavContainer}>
          <BlurView intensity={40} tint="dark" style={styles.navBlur}>
            <View style={styles.navContent}>
              <View style={styles.tabGroup}>
                {[
                  { id: 'posts', label: 'Akış' },
                  { id: 'about', label: 'Bilgiler' }
                ].map((tab) => (
                  <TouchableOpacity key={tab.id} onPress={() => setActiveTab(tab.id)} style={styles.navItem}>
                    <Text style={[styles.navText, activeTab === tab.id && styles.navTextActive]}>{tab.label}</Text>
                    {activeTab === tab.id && <View style={styles.navIndicator} />}
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.actionGroup}>
                <TouchableOpacity style={styles.actionIconButton} onPress={() => setModalVisible(true)}>
                  <Ionicons name="settings-outline" size={19} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionIconButton, styles.exitButton]} onPress={logout}>
                  <Ionicons name="log-out-outline" size={20} color="#f43f5e" />
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </View>

        {/* --- CONTENT --- */}
        <View style={styles.mainContent}>
          {activeTab === 'posts' ? (
            posts.length > 0 ? (
              posts.map((post) => (
                <View key={post._id} style={styles.modernPostCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.miniAvatar}><Text style={styles.miniAvatarText}>{initialLetter}</Text></View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardAuthorName}>{fullName}</Text>
                      <Text style={styles.cardTimestamp}>{formatFullDate(post.createdAt)}</Text>
                    </View>
                    <View style={styles.timeTag}>
                       <Text style={styles.timeTagText}>{timeAgo(post.createdAt)}</Text>
                    </View>
                  </View>
                  
                  {post.title && <Text style={styles.cardTitleText}>{post.title}</Text>}
                  <Text style={styles.cardContentText}>{post.content}</Text>
                  
                  <View style={styles.cardSeparator} />
                  <View style={styles.cardFooter}>
                    <Ionicons name="chatbubble-ellipses-outline" size={16} color="#10b981" />
                    <Text style={styles.engagementCount}>
                      {post.comments?.length || 0} Yorum
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={48} color="#1e293b" />
                <Text style={styles.emptyText}>Henüz bir gönderi paylaşılmadı.</Text>
              </View>
            )
          ) : (
            <View style={styles.insightsStack}>
              <InfoTile title="Yetenekler" data={profile?.skills || profile?.yetenekler} icon="terminal-outline" color="#10b981" />
              <InfoTile title="İlgi Alanları" data={profile?.interests || profile?.ilgi_alanlari} icon="compass-outline" color="#3b82f6" />
            </View>
          )}
        </View>
      </ScrollView>

      {isModalVisible && (
        <EditProfileModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          currentUser={profile}
          onUpdateSuccess={(newData) => setProfile(newData)}
          onLogout={logout}
        />
      )}
    </SafeAreaView>
  );
};

const InfoTile = ({ title, data, icon, color }) => {
  const items = Array.isArray(data) ? data : [];
  return (
    <View style={styles.infoTileCard}>
      <View style={styles.tileHeader}>
        <Ionicons name={icon} size={18} color={color} />
        <Text style={styles.tileTitleText}>{title}</Text>
      </View>
      <View style={styles.tileTagsContainer}>
        {items.length > 0 ? items.map((item, index) => (
          <View key={index} style={styles.skillChip}><Text style={styles.skillChipText}>{String(item)}</Text></View>
        )) : <Text style={{color: '#64748b', fontSize: 12}}>Henüz eklenmedi.</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#020617' },
  loadingContainer: { flex: 1, backgroundColor: '#020617', justifyContent: 'center', alignItems: 'center' },
  headerWrapper: { height: 300, justifyContent: 'center', alignItems: 'center' },
  profileMainInfo: { alignItems: 'center' },
  avatarNeonContainer: { width: 110, height: 110, justifyContent: 'center', alignItems: 'center' },
  avatarGradientBorder: { width: 110, height: 110, borderRadius: 55, padding: 3 },
  avatarInner: { flex: 1, borderRadius: 55, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' },
  avatarInitialText: { fontSize: 36, color: '#fff', fontWeight: 'bold' },
  titleName: { fontSize: 28, fontWeight: '800', color: '#f8fafc', marginTop: 15 },
  statusBadge: { marginTop: 8, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, backgroundColor: 'rgba(30, 41, 59, 0.6)' },
  statusText: { color: '#10b981', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  stickyNavContainer: { width: '100%', backgroundColor: '#020617' },
  navBlur: { borderBottomWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  navContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10 },
  tabGroup: { flexDirection: 'row' },
  navItem: { marginRight: 25 },
  navText: { color: '#64748b', fontSize: 15, fontWeight: '600' },
  navTextActive: { color: '#fff' },
  navIndicator: { height: 2, backgroundColor: '#10b981', width: 12, marginTop: 4 },
  actionGroup: { flexDirection: 'row', gap: 10 },
  actionIconButton: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#1e293b' },
  exitButton: { borderColor: 'rgba(244, 63, 94, 0.2)' },
  mainContent: { padding: 20 },
  modernPostCard: { backgroundColor: '#0f172a', borderRadius: 20, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  miniAvatar: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  miniAvatarText: { color: '#10b981', fontWeight: 'bold', fontSize: 12 },
  cardAuthorName: { color: '#f8fafc', fontWeight: '600', fontSize: 14 },
  cardTimestamp: { color: '#64748b', fontSize: 10, marginTop: 2 },
  timeTag: { backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  timeTagText: { color: '#10b981', fontSize: 9, fontWeight: 'bold' },
  cardTitleText: { color: '#f8fafc', fontSize: 15, fontWeight: 'bold', marginBottom: 6 },
  cardContentText: { color: '#cbd5e1', fontSize: 14, lineHeight: 20 },
  cardSeparator: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.03)', marginVertical: 12 },
  cardFooter: { flexDirection: 'row', alignItems: 'center' },
  engagementCount: { color: '#94a3b8', fontSize: 12, marginLeft: 6 },
  insightsStack: { gap: 15 },
  infoTileCard: { backgroundColor: '#0f172a', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  tileHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
  tileTitleText: { color: '#f8fafc', fontSize: 16, fontWeight: '700' },
  tileTagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#1e293b' },
  skillChipText: { color: '#f8fafc', fontSize: 12 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyText: { color: '#64748b', fontSize: 14, marginTop: 10 }
});

export default ProfileScreen;