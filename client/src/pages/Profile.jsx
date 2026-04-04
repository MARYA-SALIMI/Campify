import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { postApi } from '../services/api';
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
  Loader2,
  Sparkles,
  Plus,
  Command,
  Shield,
  Sun,
  Moon,
  AlertCircle
} from 'lucide-react';

export default function Profile() {
  const { user: currentUser, updateProfile, logout, deleteAccount } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    department: '',
    interests: [],
    skills: []
  });

  const [newInterest, setNewInterest] = useState('');
  const [newSkill, setNewSkill] = useState('');

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
          firstName: u.ad,
          lastName: u.soyad,
          email: u.email,
          department: u.bolum,
          interests: u.ilgi_alanlari || [],
          skills: u.yetenekler || [],
          joinDate: u.createdAt || new Date().toISOString()
        };

        setProfile(normalized);
        setForm({
          firstName: normalized.firstName || '',
          lastName: normalized.lastName || '',
          department: normalized.department || '',
          interests: normalized.interests || [],
          skills: normalized.skills || []
        });

        setPosts(postRes.data.posts || postRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleAddInterest = (e) => {
    if (e.key === 'Enter' && newInterest.trim()) {
      e.preventDefault();
      if (!form.interests.includes(newInterest.trim())) {
        setForm({
          ...form,
          interests: [...form.interests, newInterest.trim()]
        });
      }
      setNewInterest('');
    }
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      if (!form.skills.includes(newSkill.trim())) {
        setForm({
          ...form,
          skills: [...form.skills, newSkill.trim()]
        });
      }
      setNewSkill('');
    }
  };

  const removeInterest = (interestToRemove) => {
    setForm({
      ...form,
      interests: form.interests.filter(i => i !== interestToRemove)
    });
  };

  const removeSkill = (skillToRemove) => {
    setForm({
      ...form,
      skills: form.skills.filter(s => s !== skillToRemove)
    });
  };

  const handleUpdate = async () => {
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      department: form.department,
      interests: form.interests,
      skills: form.skills
    };

    const res = await updateProfile(payload);
    if (res.success) {
      setEditing(false);
      setProfile(res.user);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen transition-all duration-500 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-white to-emerald-50'} flex items-center justify-center`}>
        <div className="relative">
          <div className={`w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin`}></div>
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-emerald-500 w-6 h-6 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-white to-emerald-50'}`}>
      
      {/* Theme Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-6 right-6 z-50 p-2 rounded-full bg-white/80 dark:bg-gray-800 shadow-lg hover:scale-110 transition-transform"
      >
        {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700" />}
      </button>

      {/* Premium Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isDark ? 'opacity-30' : 'opacity-100'}`}>
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-emerald-200/40 via-teal-200/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full blur-3xl" />
        </div>
        
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Navbar */}
      <nav className={`sticky top-0 z-20 transition-all duration-500 ${isDark ? 'bg-gray-900/50 backdrop-blur-xl border-gray-800' : 'bg-white/50 backdrop-blur-xl border-gray-100'} border-b`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Command className="w-4 h-4 text-white" />
              </div>
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                Campify
              </span>
            </div>
            <button
              onClick={logout}
              className={`group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 border ${
                isDark 
                  ? 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20' 
                  : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20'
              }`}
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
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl blur-3xl"></div>
          <div className={`relative rounded-3xl shadow-2xl transition-all duration-500 ${isDark ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/80 border border-gray-100'} backdrop-blur-xl`}>
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 p-1 shadow-2xl">
                    <div className={`w-full h-full rounded-2xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                      <User className={`w-12 h-12 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
                    </div>
                  </div>
                  {profile?.department && (
                    <div className={`mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full ${isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
                      <BookOpen className="w-4 h-4 text-emerald-500" />
                      <span className={`text-sm ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>{profile.department}</span>
                    </div>
                  )}
                </div>

                {/* Info Section */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                        {profile?.firstName} {profile?.lastName}
                      </h1>
                      <div className="flex items-center gap-2 mt-3">
                        <Mail className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
                        <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{profile?.email}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
                        <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Katılım: {formatDate(profile?.joinDate)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setEditing(!editing)}
                      className="group flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl text-white"
                    >
                      <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                      <span className="font-medium">{editing ? 'İptal' : 'Profili Düzenle'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Mode */}
        {editing && (
          <div className={`rounded-3xl shadow-2xl transition-all duration-500 mb-8 ${isDark ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/80 border border-gray-100'} backdrop-blur-xl p-8`}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Ad</label>
                <input
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className={`w-full p-3 rounded-xl transition-all ${isDark ? 'bg-gray-700 border border-gray-600 text-white focus:border-emerald-500' : 'bg-gray-50 border border-gray-200 text-gray-800 focus:border-emerald-500'} focus:outline-none`}
                />
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Soyad</label>
                <input
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className={`w-full p-3 rounded-xl transition-all ${isDark ? 'bg-gray-700 border border-gray-600 text-white focus:border-emerald-500' : 'bg-gray-50 border border-gray-200 text-gray-800 focus:border-emerald-500'} focus:outline-none`}
                />
              </div>
              <div className="md:col-span-2">
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Bölüm</label>
                <input
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  placeholder="Örn: Bilgisayar Mühendisliği"
                  className={`w-full p-3 rounded-xl transition-all ${isDark ? 'bg-gray-700 border border-gray-600 text-white focus:border-emerald-500' : 'bg-gray-50 border border-gray-200 text-gray-800 focus:border-emerald-500'} focus:outline-none`}
                />
              </div>
            </div>

            {/* Skills Section */}
            <div className="mt-8">
              <label className={`block text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-500" />
                  Yetenekler
                </div>
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {form.skills.map(skill => (
                  <span key={skill} className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${isDark ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600'}`}>
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors">
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
                  className={`w-full p-3 pl-10 rounded-xl transition-all ${isDark ? 'bg-gray-700 border border-gray-600 text-white focus:border-emerald-500' : 'bg-gray-50 border border-gray-200 text-gray-800 focus:border-emerald-500'} focus:outline-none`}
                />
                <Plus className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>↩ Enter tuşuna basarak ekleyin</p>
            </div>

            {/* Interests Section */}
            <div className="mt-8">
              <label className={`block text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-emerald-500" />
                  İlgi Alanları
                </div>
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {form.interests.map(interest => (
                  <span key={interest} className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${isDark ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600'}`}>
                    #{interest}
                    <button onClick={() => removeInterest(interest)} className="hover:text-red-400 transition-colors">
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
                  className={`w-full p-3 pl-10 rounded-xl transition-all ${isDark ? 'bg-gray-700 border border-gray-600 text-white focus:border-emerald-500' : 'bg-gray-50 border border-gray-200 text-gray-800 focus:border-emerald-500'} focus:outline-none`}
                />
                <Plus className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>↩ Enter tuşuna basarak ekleyin</p>
            </div>

            {/* Delete Account Button inside Edit Mode */}
            <div className="mt-8 pt-6 border-t border-red-500/20">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Hesabı Sil</span>
              </button>
              <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                <AlertCircle className="w-3 h-3 inline mr-1" />
                Hesabınızı silmek tüm verilerinizi kalıcı olarak kaldırır
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleUpdate}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all shadow-lg text-white"
              >
                <Save className="w-4 h-4" />
                <span className="font-medium">Değişiklikleri Kaydet</span>
              </button>
            </div>
          </div>
        )}

        {/* Skills & Interests Display */}
        {!editing && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {profile?.skills?.length > 0 && (
              <div className={`rounded-2xl p-6 transition-all ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 border border-gray-100'} backdrop-blur-xl hover:shadow-xl`}>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`p-2 rounded-xl ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-500/10'}`}>
                    <Award className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
                  </div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Yetenekler</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map(skill => (
                    <span key={skill} className={`px-3 py-1.5 rounded-full text-sm transition-transform hover:scale-105 cursor-default ${isDark ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'}`}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile?.interests?.length > 0 && (
              <div className={`rounded-2xl p-6 transition-all ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/80 border border-gray-100'} backdrop-blur-xl hover:shadow-xl`}>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`p-2 rounded-xl ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-500/10'}`}>
                    <Heart className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
                  </div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>İlgi Alanları</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map(interest => (
                    <span key={interest} className={`px-3 py-1.5 rounded-full text-sm transition-transform hover:scale-105 cursor-default ${isDark ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'}`}>
                      #{interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Posts Section - Beğeni ve yorum butonları kaldırıldı */}
        <div className={`rounded-3xl p-8 transition-all ${isDark ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/80 border border-gray-100'} backdrop-blur-xl shadow-2xl`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-500/10'}`}>
                <BookOpen className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
              </div>
              <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Gönderiler</h2>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-500/10 text-emerald-600'}`}>
                {posts.length}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {posts.length > 0 ? (
              posts.map(post => (
                <div key={post._id} className={`group rounded-2xl p-6 transition-all duration-300 ${isDark ? 'bg-gray-700/50 hover:bg-gray-700 border border-gray-600' : 'bg-white hover:shadow-xl border border-gray-100'}`}>
                  <h3 className={`text-lg font-semibold mb-3 transition-colors ${isDark ? 'text-white group-hover:text-emerald-400' : 'text-gray-800 group-hover:text-emerald-600'}`}>
                    {post.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {post.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-16">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-500/10'}`}>
                  <BookOpen className={`w-10 h-10 ${isDark ? 'text-emerald-400' : 'text-emerald-400'}`} />
                </div>
                <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Henüz gönderi paylaşılmamış</p>
                <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>İlk gönderini paylaşmaya ne dersin?</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`relative z-10 py-3 text-center border-t transition-all duration-500 ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white/50'} backdrop-blur-sm`}>
        <div className="flex items-center justify-center gap-2">
          <Shield className={`w-3 h-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <span className={`text-[8px] font-medium uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Encrypted Connection
          </span>
          <Heart className="w-2.5 h-2.5 text-emerald-400 fill-emerald-400" />
          <span className={`text-[8px] font-medium uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Campify v3.0
          </span>
        </div>
      </footer>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Hesabı Sil</h3>
              <button onClick={() => setShowDeleteModal(false)} className={`transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Bu işlem geri alınamaz. Tüm verileriniz kalıcı olarak silinecektir. 
              Devam etmek istediğinizden emin misiniz?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className={`flex-1 px-4 py-2 rounded-xl transition-all ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              >
                İptal
              </button>
              <button 
                onClick={deleteAccount} 
                className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all text-white"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}