import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { postApi } from '../services/api';
import { Shield, Heart, Command, LogOut, Sparkles } from 'lucide-react';

// Alt bileşenler
import ProfileView from '../components/profile/ProfileView';
import ProfileEdit from '../components/profile/ProfileEdit';

export default function Profile() {
  const { user: currentUser, updateProfile, logout, deleteAccount } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // App.css'deki data-theme değişimini izlemek için state
  const [isDarkModeActive, setIsDarkModeActive] = useState(
    document.documentElement.getAttribute("data-theme") === "dark" || 
    !document.documentElement.getAttribute("data-theme") // Default dark ise
  );

  const [form, setForm] = useState({
    firstName: '', lastName: '', department: '', interests: [], skills: []
  });

  // Sidebar butonu tıklandığında temayı yakalayan observer
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      setIsDarkModeActive(currentTheme !== "light");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = currentUser?.id || currentUser?._id;
        if (!id) return;
        const [userRes, postRes] = await Promise.all([
          api.get(`/v1/users/${id}`),
          postApi.get(`/api/posts?userId=${id}`).catch(() => ({ data: [] }))
        ]);
        const u = userRes.data;
        const normalized = {
          firstName: u.ad, lastName: u.soyad, email: u.email,
          department: u.bolum, interests: u.ilgi_alanlari || [],
          skills: u.yetenekler || [], joinDate: u.createdAt || new Date().toISOString()
        };
        setProfile(normalized);
        setForm({ ...normalized });
        setPosts(postRes.data.posts || postRes.data || []);
      } catch (err) {
        console.error("Profile Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  const handleUpdate = async () => {
    const res = await updateProfile(form);
    if (res.success) {
      setEditing(false);
      setProfile(res.user);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen transition-all duration-500" 
         style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      
      {/* Arka Plan Glow Efekti (Sidebar'daki yeşil ile uyumlu) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[120px]" 
             style={{ backgroundColor: 'var(--green)', opacity: isDarkModeActive ? 0.08 : 0.05 }} />
      </div>

      {/* Üst Bar (Navbar) */}
      <nav className="sticky top-0 z-30 border-b backdrop-blur-xl transition-all"
           style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-soft)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                 style={{ background: `linear-gradient(135deg, var(--green), var(--green-2))` }}>
              <Command className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Campify</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button onClick={logout} 
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all bg-red-500/10 text-red-500 hover:bg-red-500/20">
              <LogOut className="w-4 h-4" /> <span>Çıkış Yap</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Profil İçeriği */}
      <main className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        {editing ? (
          <ProfileEdit 
            form={form} setForm={setForm} isDark={isDarkModeActive} 
            onUpdate={handleUpdate} 
            onCancel={() => { setEditing(false); setForm({ ...profile }); }}
            setShowDeleteModal={setShowDeleteModal}
          />
        ) : (
          <ProfileView 
            profile={profile} posts={posts} isDark={isDarkModeActive} 
            setEditing={setEditing} formatDate={formatDate} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center opacity-40 relative z-10">
        <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold">
          <Shield className="w-3 h-3" /> Güvenli Bağlantı 
          <Heart className="w-3 h-3" style={{ color: 'var(--green)', fill: 'var(--green)' }} /> 
          Campify v3.0
        </div>
      </footer>

      {showDeleteModal && <DeleteModal isDark={isDarkModeActive} onConfirm={deleteAccount} onCancel={() => setShowDeleteModal(false)} />}
    </div>
  );
}

// Yükleme Ekranı (Sidebar ile uyumlu)
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4"
         style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="relative">
        <div className="w-20 h-20 border-4 rounded-full animate-spin"
             style={{ borderColor: 'var(--border-soft)', borderTopColor: 'var(--green)' }}></div>
        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 animate-pulse" 
                  style={{ color: 'var(--green)' }} />
      </div>
      <p className="text-sm font-bold tracking-widest uppercase animate-pulse"
         style={{ color: 'var(--green)' }}>Yükleniyor...</p>
    </div>
  );
}

// Hesap Silme Modalı (Sidebar ile uyumlu)
function DeleteModal({ isDark, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md p-8 rounded-3xl shadow-2xl border transition-all"
           style={{ backgroundColor: 'var(--bg-panel-2)', borderColor: 'var(--border-soft)', color: 'var(--text-main)' }}>
        <h3 className="text-2xl font-bold mb-4">Hesabı Sil?</h3>
        <p className="opacity-70 mb-8 leading-relaxed">Bu işlem geri alınamaz. Devam etmek istiyor musunuz?</p>
        <div className="flex gap-4">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-colors">Vazgeç</button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all">Sil</button>
        </div>
      </div>
    </div>
  );
}