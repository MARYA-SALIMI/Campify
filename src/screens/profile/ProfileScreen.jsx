import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView, StyleSheet,
  Text, TouchableOpacity, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EditProfileModal from '../../components/profile/EditProfileModal';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const { logout, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  const dummyPosts = [
    { id: 1, content: "Yeni React Native projem yayında! 🚀", date: "2 saat önce", likes: 12 },
    { id: 2, content: "Backend mimarisinde mikroservisler üzerine bir çalışma...", date: "Dün", likes: 45 },
  ];

  useEffect(() => {
    if (user?.uid || user?.id) fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const data = await authService.getProfile(user.uid || user.id);
      setProfile(data);
    } catch (error) {
      console.error("Profil yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* --- PREMIUM HEADER (ÜST KISIM) --- */}
        <View style={styles.headerWrapper}>
          <View style={styles.meshGradientCover}>
            <View style={[styles.gradientBlob, styles.blob1]} />
            <View style={[styles.gradientBlob, styles.blob2]} />
          </View>

          <View style={styles.profileMainInfo}>
            <View style={styles.avatarNeonRing}>
              <View style={styles.avatarSolid}>
                <Text style={styles.avatarInitialText}>
                  {profile?.ad?.[0]}{profile?.soyad?.[0]}
                </Text>
              </View>
            </View>
            <Text style={styles.titleName}>{`${profile?.ad} ${profile?.soyad}`}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{profile?.bolum || "ENGINEER"}</Text>
            </View>
          </View>
        </View>

        {/* --- ACTIONS --- */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.glassButton} onPress={() => setModalVisible(true)}>
            <Ionicons name="flash" size={18} color="#fff" />
            <Text style={styles.glassButtonText}>Profili Düzenle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutCircle} onPress={logout}>
            <Ionicons name="power-outline" size={20} color="#f43f5e" />
          </TouchableOpacity>
        </View>

        {/* --- PROFESYONEL TAB SELECTOR --- */}
        <View style={styles.tabBar}>
          {['posts', 'about'].map((t) => (
            <TouchableOpacity key={t} onPress={() => setActiveTab(t)} style={styles.tabTrigger}>
              <Text style={[styles.tabLabel, activeTab === t && styles.tabLabelActive]}>
                {t === 'posts' ? 'Aktivite' : 'Yetenekler'}
              </Text>
              {activeTab === t && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* --- PROFESYONEL ALT KISIM (CONTENT) --- */}
        <View style={styles.contentContainer}>
          {activeTab === 'posts' ? (
            dummyPosts.map(post => (
              <View key={post.id} style={styles.postCardModern}>
                <View style={styles.postHeaderLine}>
                    <View style={styles.postInfo}>
                        <Text style={styles.postAuthorTitle}>{profile?.ad}</Text>
                        <Text style={styles.postTimestamp}>{post.date}</Text>
                    </View>
                    <Ionicons name="ellipsis-horizontal" size={16} color="#334155" />
                </View>
                <Text style={styles.postContentMain}>{post.content}</Text>
                <View style={styles.postActionArea}>
                  <View style={styles.likeBadge}>
                    <Ionicons name="heart" size={14} color="#10b981" />
                    <Text style={styles.likeCount}>{post.likes}</Text>
                  </View>
                  <TouchableOpacity>
                    <Ionicons name="share-outline" size={18} color="#475569" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.bentoContainer}>
              <BentoCard 
                icon="terminal-outline" 
                title="Teknik Stack" 
                items={profile?.yetenekler} 
                color="#10b981" 
              />
              <BentoCard 
                icon="extension-puzzle-outline" 
                title="İlgi Alanları" 
                items={profile?.ilgi_alanlari} 
                color="#3b82f6" 
              />
            </View>
          )}
        </View>

        <EditProfileModal 
          visible={isModalVisible} 
          onClose={() => setModalVisible(false)}
          currentUser={profile}
          onUpdateSuccess={(newData) => setProfile(newData)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

// Alt Kısım İçin Profesyonel Bileşen
const BentoCard = ({ icon, title, items, color }) => (
  <View style={styles.bentoCard}>
    <View style={styles.bentoHeader}>
      <View style={[styles.bentoIconInner, { backgroundColor: `${color}10` }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.bentoTitle}>{title}</Text>
    </View>
    <View style={styles.bentoTagCloud}>
      {items?.map((item, i) => (
        <View key={i} style={styles.bentoTag}>
          <Text style={styles.bentoTagText}>{item}</Text>
        </View>
      )) || <Text style={styles.empty}>Henüz eklenmemiş.</Text>}
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000' },
  loadingContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },

  // --- Header ---
  headerWrapper: { height: 280, justifyContent: 'center', alignItems: 'center' },
  meshGradientCover: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000' },
  gradientBlob: { position: 'absolute', width: 250, height: 250, borderRadius: 125, opacity: 0.12 },
  blob1: { backgroundColor: '#10b981', top: -50, right: -50 },
  blob2: { backgroundColor: '#6366f1', bottom: -50, left: -50 },

  profileMainInfo: { alignItems: 'center' },
  avatarNeonRing: {
    width: 100, height: 100, borderRadius: 50, padding: 3,
    borderWidth: 1, borderColor: '#10b981', justifyContent: 'center', alignItems: 'center',
  },
  avatarSolid: {
    width: '100%', height: '100%', borderRadius: 50, backgroundColor: '#0a0a0a',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarInitialText: { fontSize: 36, fontWeight: '200', color: '#fff', letterSpacing: 2 },
  
  titleName: { fontSize: 28, fontWeight: '700', color: '#fff', marginTop: 15 },
  statusBadge: { marginTop: 8, paddingHorizontal: 10, paddingVertical: 3, borderWidth: 1, borderColor: '#1e293b', borderRadius: 6 },
  statusText: { color: '#475569', fontSize: 9, fontWeight: '900', letterSpacing: 2 },

  // --- Actions ---
  actionSection: { flexDirection: 'row', paddingHorizontal: 25, gap: 12, marginTop: -20 },
  glassButton: {
    flex: 1, height: 50, borderRadius: 12, backgroundColor: '#10b981',
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
  },
  glassButtonText: { color: '#fff', fontWeight: '700', marginLeft: 8, fontSize: 14 },
  logoutCircle: {
    width: 50, height: 50, borderRadius: 12, backgroundColor: '#0a0a0a',
    borderWidth: 1, borderColor: '#1e293b', justifyContent: 'center', alignItems: 'center'
  },

  // --- Tabs ---
  tabBar: { flexDirection: 'row', marginTop: 30, paddingHorizontal: 25, gap: 25 },
  tabTrigger: { paddingBottom: 8 },
  tabLabel: { color: '#475569', fontSize: 15, fontWeight: '600' },
  tabLabelActive: { color: '#fff' },
  activeIndicator: { height: 2, backgroundColor: '#10b981', marginTop: 4, width: '100%' },

  // --- ALT KISIM: Profesyonel Kartlar (Postlar) ---
  contentContainer: { padding: 20 },
  postCardModern: {
    backgroundColor: '#0a0a0a',
    borderRadius: 20, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: '#161b22', // GitHub Dark mod rengi
  },
  postHeaderLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  postAuthorTitle: { color: '#f8fafc', fontWeight: '700', fontSize: 14 },
  postTimestamp: { color: '#475569', fontSize: 11, marginTop: 2 },
  postContentMain: { color: '#94a3b8', lineHeight: 22, fontSize: 14, fontWeight: '400' },
  postActionArea: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    marginTop: 20, borderTopWidth: 1, borderTopColor: '#161b22', paddingTop: 15 
  },
  likeBadge: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#10b98110', 
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 
  },
  likeCount: { color: '#10b981', fontSize: 12, fontWeight: '700', marginLeft: 5 },

  // --- ALT KISIM: Bento Grid (Yetenekler) ---
  bentoContainer: { gap: 16 },
  bentoCard: {
    backgroundColor: '#0a0a0a', borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: '#161b22',
  },
  bentoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  bentoIconInner: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  bentoTitle: { color: '#f8fafc', fontSize: 15, fontWeight: '700', marginLeft: 12 },
  bentoTagCloud: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  bentoTag: {
    backgroundColor: '#000', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 8, borderWidth: 1, borderColor: '#1e293b'
  },
  bentoTagText: { color: '#94a3b8', fontSize: 12, fontWeight: '500' },
  empty: { color: '#334155', fontSize: 12, fontStyle: 'italic' }
});

export default ProfileScreen;