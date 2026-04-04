import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  BookOpen,
  Trash2,
  LogOut,
  Edit3,
  Save,
  Award,
  Heart,
  Calendar,
  X,
  Plus,
  Command,
  Shield,
  Sun,
  Moon,
  AlertCircle
} from 'lucide-react';

const MOCK_PROFILE = {
  firstName: 'Ayşe',
  lastName: 'Yılmaz',
  email: 'ayse.yilmaz@kampüs.edu.tr',
  department: 'Bilgisayar Mühendisliği',
  interests: ['Doğa yürüyüşü', 'Fotoğraf', 'Açık kaynak'],
  skills: ['React', 'Node.js', 'Python'],
  joinDate: '2024-09-01T10:00:00.000Z',
};

const MOCK_POSTS = [
  {
    id: 'post-1',
    title: 'Kamp malzemesi önerileri',
    content: 'İlk kez katılacaklar için çadır ve uyku tulumu tavsiyelerimi paylaşıyorum.',
  },
  {
    id: 'post-2',
    title: 'Hafta sonu rotası',
    content: 'Pazar günü için hafif bir parkur önerisi — katılmak isteyenler yazabilir.',
  },
];

export default function Profile() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // --- Post Delete State ---
  const [postToDelete, setPostToDelete] = useState(null); // post id
  // --- Post Edit State ---
  const [postToEdit, setPostToEdit] = useState(null);     // { id, title, content }
  const [editContent, setEditContent] = useState('');

  const [form, setForm] = useState({
    firstName: MOCK_PROFILE.firstName,
    lastName: MOCK_PROFILE.lastName,
    department: MOCK_PROFILE.department,
    interests: [...MOCK_PROFILE.interests],
    skills: [...MOCK_PROFILE.skills],
  });

  const [newInterest, setNewInterest] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const handleAddInterest = (e) => {
    if (e.key === 'Enter' && newInterest.trim()) {
      e.preventDefault();
      if (!form.interests.includes(newInterest.trim())) {
        setForm({ ...form, interests: [...form.interests, newInterest.trim()] });
      }
      setNewInterest('');
    }
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      if (!form.skills.includes(newSkill.trim())) {
        setForm({ ...form, skills: [...form.skills, newSkill.trim()] });
      }
      setNewSkill('');
    }
  };

  const removeInterest = (interestToRemove) => {
    setForm({ ...form, interests: form.interests.filter(i => i !== interestToRemove) });
  };

  const removeSkill = (skillToRemove) => {
    setForm({ ...form, skills: form.skills.filter(s => s !== skillToRemove) });
  };

  const handleUpdate = () => {
    setProfile((prev) => ({
      ...prev,
      firstName: form.firstName,
      lastName: form.lastName,
      department: form.department,
      interests: [...form.interests],
      skills: [...form.skills],
    }));
    setEditing(false);
  };

  // --- Post Delete Handlers ---
  const openDeletePostModal = (postId) => setPostToDelete(postId);
  const closeDeletePostModal = () => setPostToDelete(null);
  const confirmDeletePost = () => {
    setPosts((prev) => prev.filter((p) => p.id !== postToDelete));
    setPostToDelete(null);
  };

  // --- Post Edit Handlers ---
  const openEditPostModal = (post) => {
    setPostToEdit(post);
    setEditContent(post.content);
  };
  const closeEditPostModal = () => {
    setPostToEdit(null);
    setEditContent('');
  };
  const confirmEditPost = () => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postToEdit.id ? { ...p, content: editContent } : p
      )
    );
    closeEditPostModal();
  };

  const handleSimulatedDeleteAccount = () => setShowDeleteModal(false);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDark
          ? 'bg-gray-900'
          : 'bg-gradient-to-br from-slate-50 via-white to-emerald-50'
      }`}
    >
      {/* Theme Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-6 right-6 z-50 p-2 rounded-full bg-white/80 dark:bg-gray-800 shadow-lg hover:scale-110 transition-transform"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            isDark ? 'opacity-30' : 'opacity-100'
          }`}
        >
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-emerald-200/40 via-teal-200/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full blur-3xl" />
        </div>
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Navbar */}
      <nav
        className={`sticky top-0 z-20 transition-all duration-500 ${
          isDark
            ? 'bg-gray-900/50 backdrop-blur-xl border-gray-800'
            : 'bg-white/50 backdrop-blur-xl border-gray-100'
        } border-b`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Command className="w-4 h-4 text-white" />
              </div>
              <span
                className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}
              >
                Campify
              </span>
            </div>
            <button
              onClick={logout}
              className="group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 border bg-red-500/10 hover:bg-red-500/20 border-red-500/20"
            >
              <LogOut className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
              <span className="text-red-500 text-sm font-medium">Çıkış Yap</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Profile Card */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl blur-3xl" />
          <div
            className={`relative rounded-3xl shadow-2xl transition-all duration-500 ${
              isDark
                ? 'bg-gray-800/90 border border-gray-700'
                : 'bg-white/80 border border-gray-100'
            } backdrop-blur-xl`}
          >
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 p-1 shadow-2xl">
                    <div
                      className={`w-full h-full rounded-2xl flex items-center justify-center ${
                        isDark ? 'bg-gray-800' : 'bg-white'
                      }`}
                    >
                      <User
                        className={`w-12 h-12 ${
                          isDark ? 'text-emerald-400' : 'text-emerald-500'
                        }`}
                      />
                    </div>
                  </div>
                  {profile?.department && (
                    <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <BookOpen className="w-4 h-4 text-emerald-500" />
                      <span
                        className={`text-sm ${
                          isDark ? 'text-emerald-300' : 'text-emerald-600'
                        }`}
                      >
                        {profile.department}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h1
                        className={`text-4xl font-bold ${
                          isDark ? 'text-white' : 'text-gray-800'
                        }`}
                      >
                        {profile?.firstName} {profile?.lastName}
                      </h1>
                      <div className="flex items-center gap-2 mt-3">
                        <Mail
                          className={`w-4 h-4 ${
                            isDark ? 'text-emerald-400' : 'text-emerald-500'
                          }`}
                        />
                        <span
                          className={isDark ? 'text-gray-300' : 'text-gray-600'}
                        >
                          {profile?.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar
                          className={`w-4 h-4 ${
                            isDark ? 'text-emerald-400' : 'text-emerald-500'
                          }`}
                        />
                        <span
                          className={isDark ? 'text-gray-400' : 'text-gray-500'}
                        >
                          Katılım: {formatDate(profile?.joinDate)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditing(!editing)}
                      className="group flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl text-white"
                    >
                      <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      <span className="font-medium">
                        {editing ? 'İptal' : 'Profili Düzenle'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Mode */}
        {editing && (
          <div
            className={`rounded-3xl shadow-2xl transition-all duration-500 mb-8 ${
              isDark
                ? 'bg-gray-800/90 border border-gray-700'
                : 'bg-white/80 border border-gray-100'
            } backdrop-blur-xl p-8`}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Ad
                </label>
                <input
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  className="input-premium"
                />
              </div>
              <div>
                <label
                  className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Soyad
                </label>
                <input
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  className="input-premium"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Bölüm
                </label>
                <input
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                  placeholder="Örn: Bilgisayar Mühendisliği"
                  className="input-premium"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="mt-8">
              <label
                className={`block text-xs font-bold uppercase tracking-wider mb-3 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-500" />
                  Yetenekler
                </div>
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {form.skills.map((skill) => (
                  <span
                    key={skill}
                    className="badge badge-green group flex items-center gap-2"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative">
                <input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="Yetenek yaz ve Enter'a bas..."
                  className="input-premium pl-10"
                />
                <Plus
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`}
                />
              </div>
              <p
                className={`text-xs mt-2 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                ↩ Enter tuşuna basarak ekleyin
              </p>
            </div>

            {/* Interests */}
            <div className="mt-8">
              <label
                className={`block text-xs font-bold uppercase tracking-wider mb-3 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-emerald-500" />
                  İlgi Alanları
                </div>
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {form.interests.map((interest) => (
                  <span
                    key={interest}
                    className="badge badge-green group flex items-center gap-2"
                  >
                    #{interest}
                    <button
                      onClick={() => removeInterest(interest)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="relative">
                <input
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={handleAddInterest}
                  placeholder="İlgi alanı yaz ve Enter'a bas..."
                  className="input-premium pl-10"
                />
                <Plus
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`}
                />
              </div>
              <p
                className={`text-xs mt-2 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                ↩ Enter tuşuna basarak ekleyin
              </p>
            </div>

            {/* Delete Account */}
            <div className="mt-8 pt-6 border-t border-red-500/20">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Hesabı Sil</span>
              </button>
              <p
                className={`text-xs mt-2 ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                <AlertCircle className="w-3 h-3 inline mr-1" />
                Hesabınızı silmek tüm verilerinizi kalıcı olarak kaldırır
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button onClick={handleUpdate} className="btn-premium flex items-center gap-2">
                <Save className="w-4 h-4" />
                <span>Değişiklikleri Kaydet</span>
              </button>
            </div>
          </div>
        )}

        {/* Skills & Interests Display */}
        {!editing && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {profile?.skills?.length > 0 && (
              <div
                className={`rounded-2xl p-6 transition-all ${
                  isDark
                    ? 'bg-gray-800/50 border border-gray-700'
                    : 'bg-white/80 border border-gray-100'
                } backdrop-blur-xl hover:shadow-xl`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className={`p-2 rounded-xl ${
                      isDark ? 'bg-emerald-500/20' : 'bg-emerald-500/10'
                    }`}
                  >
                    <Award
                      className={`w-5 h-5 ${
                        isDark ? 'text-emerald-400' : 'text-emerald-500'
                      }`}
                    />
                  </div>
                  <h3
                    className={`font-semibold ${
                      isDark ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    Yetenekler
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span key={skill} className="badge badge-green">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile?.interests?.length > 0 && (
              <div
                className={`rounded-2xl p-6 transition-all ${
                  isDark
                    ? 'bg-gray-800/50 border border-gray-700'
                    : 'bg-white/80 border border-gray-100'
                } backdrop-blur-xl hover:shadow-xl`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className={`p-2 rounded-xl ${
                      isDark ? 'bg-emerald-500/20' : 'bg-emerald-500/10'
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isDark ? 'text-emerald-400' : 'text-emerald-500'
                      }`}
                    />
                  </div>
                  <h3
                    className={`font-semibold ${
                      isDark ? 'text-white' : 'text-gray-800'
                    }`}
                  >
                    İlgi Alanları
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <span key={interest} className="badge badge-green">
                      #{interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Posts Section */}
        <div
          className={`rounded-3xl p-8 transition-all ${
            isDark
              ? 'bg-gray-800/90 border border-gray-700'
              : 'bg-white/80 border border-gray-100'
          } backdrop-blur-xl shadow-2xl`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl ${
                  isDark ? 'bg-emerald-500/20' : 'bg-emerald-500/10'
                }`}
              >
                <BookOpen
                  className={`w-5 h-5 ${
                    isDark ? 'text-emerald-400' : 'text-emerald-500'
                  }`}
                />
              </div>
              <h2
                className={`text-xl font-semibold ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}
              >
                Gönderiler
              </h2>
              <span className="badge badge-green">{posts.length}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post.id}
                  className={`group relative rounded-2xl p-6 transition-all duration-300 ${
                    isDark
                      ? 'bg-gray-700/50 hover:bg-gray-700 border border-gray-600'
                      : 'bg-white hover:shadow-xl border border-gray-100'
                  }`}
                >
                  {/* Post Action Buttons — top-right */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {/* Edit Button */}
                    <button
                      onClick={() => openEditPostModal(post)}
                      title="Düzenle"
                      className={`p-1.5 rounded-lg transition-all hover:scale-110 ${
                        isDark
                          ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600'
                      }`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => openDeletePostModal(post.id)}
                      title="Sil"
                      className="p-1.5 rounded-lg transition-all hover:scale-110 bg-red-500/10 hover:bg-red-500/20 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3
                    className={`text-lg font-semibold mb-3 pr-16 transition-colors ${
                      isDark
                        ? 'text-white group-hover:text-emerald-400'
                        : 'text-gray-800 group-hover:text-emerald-600'
                    }`}
                  >
                    {post.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {post.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-16">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    isDark ? 'bg-emerald-500/20' : 'bg-emerald-500/10'
                  }`}
                >
                  <BookOpen className="w-10 h-10 text-emerald-400" />
                </div>
                <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                  Henüz gönderi paylaşılmamış
                </p>
                <p
                  className={`text-sm mt-1 ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`}
                >
                  İlk gönderini paylaşmaya ne dersin?
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className={`relative z-10 py-3 text-center border-t transition-all duration-500 ${
          isDark
            ? 'border-gray-800 bg-gray-900/50'
            : 'border-gray-100 bg-white/50'
        } backdrop-blur-sm`}
      >
        <div className="flex items-center justify-center gap-2">
          <Shield
            className={`w-3 h-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
          />
          <span
            className={`text-[8px] font-medium uppercase tracking-wider ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            Encrypted Connection
          </span>
          <Heart className="w-2.5 h-2.5 text-emerald-400 fill-emerald-400" />
          <span
            className={`text-[8px] font-medium uppercase tracking-wider ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            Campify v3.0
          </span>
        </div>
      </footer>

      {/* ── Account Delete Modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-premium max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>
                Hesabı Sil
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                style={{ color: 'var(--text-soft)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mb-6" style={{ color: 'var(--text-soft)' }}>
              Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak
              silinecektir. Devam etmek istediğinizden emin misiniz?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-outline flex-1"
              >
                İptal
              </button>
              <button
                onClick={handleSimulatedDeleteAccount}
                className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all text-white font-semibold"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Post Delete Confirmation Modal ── */}
      {postToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-premium max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>
                Gönderiyi Sil
              </h3>
              <button
                onClick={closeDeletePostModal}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                style={{ color: 'var(--text-soft)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="mb-6" style={{ color: 'var(--text-soft)' }}>
              Bu gönderiyi kalıcı olarak silmek istediğinizden emin misiniz?
              Bu işlem geri alınamaz.
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeDeletePostModal}
                className="btn-outline flex-1"
              >
                İptal
              </button>
              <button
                onClick={confirmDeletePost}
                className="flex-1 px-4 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all text-white font-semibold"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Post Edit Modal ── */}
      {postToEdit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-premium max-w-lg w-full p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>
                Gönderiyi Düzenle
              </h3>
              <button
                onClick={closeEditPostModal}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                style={{ color: 'var(--text-soft)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Read-only title */}
            <p
              className="text-xs font-bold uppercase tracking-wider mb-1"
              style={{ color: 'var(--text-soft)' }}
            >
              Başlık
            </p>
            <p
              className="text-base font-semibold mb-5"
              style={{ color: 'var(--text-main)' }}
            >
              {postToEdit.title}
            </p>

            <label
              className="block text-xs font-bold uppercase tracking-wider mb-2"
              style={{ color: 'var(--text-soft)' }}
            >
              İçerik
            </label>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={5}
              className="input-premium resize-none"
              placeholder="Gönderi içeriğini düzenleyin..."
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeEditPostModal}
                className="btn-outline flex-1"
              >
                İptal
              </button>
              <button
                onClick={confirmEditPost}
                className="btn-premium flex-1 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Güncelle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}