import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight, Command, Loader2, Mail, Lock, User, 
  CheckCircle2, XCircle, Eye, EyeOff, 
  Sparkles, Sun, Moon, Shield, Heart
} from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isDark, setIsDark] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/profile', { replace: true });
  }, [isAuthenticated, navigate]);

  const validatePassword = (pass) => {
    const strength = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(re => re.test(pass)).length;
    setPasswordStrength(strength);
    return strength;
  };

  // GÜNCELLEME: Sadece @ogr.sdu.edu.tr uzantısına izin verir
  const isFormValid = useMemo(() => {
    const isSduMail = form.email.toLowerCase().endsWith('@ogr.sdu.edu.tr');
    return form.firstName && form.lastName && isSduMail && form.password.length >= 8 && passwordStrength >= 3;
  }, [form, passwordStrength]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'password') validatePassword(value);
    if (touched[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    if (!value && name !== 'password') {
      setErrors(prev => ({ ...prev, [name]: 'Required' }));
    }
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      setErrors({ submit: 'Lütfen tüm alanları doğru doldurun ve @ogr.sdu.edu.tr maili kullanın.' });
      return;
    }
    
    setLoading(true);
    setErrors({}); // Eski hataları temizle
    
    try {
      // AuthContext'teki register fonksiyonunu çağırıyoruz
      const result = await register(form);
      
      // Kayıt başarılıysa
      if (result.success) {
        setSuccess(true);
        // Kullanıcıyı hemen yönlendirmeden önce bir uyarı gösterelim
        // Çünkü direkt login'e giderse "mail onaylanmadı" hatası alacak
        setTimeout(() => {
          navigate('/login', { state: { message: "Doğrulama maili gönderildi, lütfen onaylayın!" } });
        }, 2000);
      }
    } catch (error) {
      // Hata Firebase'den veya Backend'den gelmiş olabilir
      console.error("Kayıt sırasında hata oluştu:", error.message);
      setErrors({ submit: error.message || 'Kayıt sırasında bir sorun oluştu.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`h-screen w-full transition-all duration-500 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-white to-emerald-50'} overflow-hidden flex flex-col font-sans`}>
      
      {/* Theme Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white/80 backdrop-blur-md shadow-lg hover:scale-110 transition-transform border border-gray-200"
      >
        {isDark ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-gray-700" />}
      </button>
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-100">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-200/20 via-teal-200/15 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-200/15 to-transparent rounded-full blur-3xl" />
        </div>
      </div>

      {/* Navigation */}
      <nav className={`relative z-20 px-6 py-2.5 flex items-center justify-between border-b transition-colors ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white/80'} backdrop-blur-md flex-shrink-0`}>
        <Link to="/" className="flex items-center gap-2 group">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all group-hover:scale-110 ${isDark ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' : 'bg-gradient-to-br from-emerald-500 to-teal-500'}`}>
            <Command className="w-3.5 h-3.5 text-white" />
          </div>
          <span className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-800'}`}>Campify</span>
        </Link>
        <Link to="/login" className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${isDark ? 'bg-white/10 hover:bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-emerald-500 hover:text-white'}`}>
          <span>Sign In</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 overflow-hidden">
        <div className="w-full max-w-md mx-auto">
          
          <div className={`relative rounded-2xl shadow-2xl transition-all duration-500 ${isDark ? 'bg-gray-800/95 border border-gray-700' : 'bg-white/98 border border-gray-100'} backdrop-blur-md`}>
            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-2">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  <span className="text-[8px] font-black text-emerald-600 tracking-[0.15em]">CREATE ACCOUNT</span>
                </div>
                <h2 className={`text-xl font-extrabold mb-0.5 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Get Started
                </h2>
                <p className={`text-[11px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Join Campify and start your journey
                </p>
              </div>

              {errors.submit && (
                <div className={`mb-3 p-2.5 rounded-xl flex items-center gap-2 animate-shake ${isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-100 text-red-700'}`}>
                  <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="text-[10px] font-bold tracking-tight">{errors.submit}</span>
                </div>
              )}
              
              {success && (
                <div className={`mb-3 p-2.5 rounded-xl flex items-center gap-2 animate-shake ${isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="text-[10px] font-bold tracking-tight">Hesap başarıyla oluşturuldu! Giriş sayfasına yönlendiriliyorsunuz...</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block text-[9px] font-bold uppercase tracking-wider mb-1 px-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>First Name</label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${focusedField === 'firstName' ? 'text-emerald-500' : 'text-gray-400'}`} />
                      <input
                        name="firstName"
                        placeholder="MARYA"
                        value={form.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={() => setFocusedField('firstName')}
                        className={`w-full border rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none transition-all shadow-sm ${isDark ? 'bg-gray-900/50 border-gray-700 text-white focus:border-emerald-500 placeholder:text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-emerald-500 placeholder:text-gray-400'}`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-[9px] font-bold uppercase tracking-wider mb-1 px-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Last Name</label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${focusedField === 'lastName' ? 'text-emerald-500' : 'text-gray-400'}`} />
                      <input
                        name="lastName"
                        placeholder="SALIMI"
                        value={form.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={() => setFocusedField('lastName')}
                        className={`w-full border rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none transition-all shadow-sm ${isDark ? 'bg-gray-900/50 border-gray-700 text-white focus:border-emerald-500 placeholder:text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-emerald-500 placeholder:text-gray-400'}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field - GÜNCELLENDİ */}
                <div>
                  <label className={`block text-[9px] font-bold uppercase tracking-wider mb-1 px-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Email</label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${focusedField === 'email' ? 'text-emerald-500' : 'text-gray-400'}`} />
                    <input
                      name="email"
                      type="email"
                      placeholder="ogrencinumarasi@ogr.sdu.edu.tr"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onFocus={() => setFocusedField('email')}
                      className={`w-full border rounded-xl pl-8 pr-8 py-2 text-xs focus:outline-none transition-all shadow-sm ${isDark ? 'bg-gray-900/50 border-gray-700 text-white focus:border-emerald-500 placeholder:text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-emerald-500 placeholder:text-gray-400'}`}
                    />
                    {form.email && form.email.toLowerCase().endsWith('@ogr.sdu.edu.tr') && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-500" />
                    )}
                  </div>
                  {form.email && !form.email.toLowerCase().endsWith('@ogr.sdu.edu.tr') && (
                    <p className="text-[8px] text-amber-500 mt-0.5 px-1 animate-pulse">⚠️ Sadece @ogr.sdu.edu.tr maili kabul edilir</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className={`block text-[9px] font-bold uppercase tracking-wider mb-1 px-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Password</label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${focusedField === 'password' ? 'text-emerald-500' : 'text-gray-400'}`} />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onFocus={() => setFocusedField('password')}
                      className={`w-full border rounded-xl pl-8 pr-8 py-2 text-xs focus:outline-none transition-all shadow-sm ${isDark ? 'bg-gray-900/50 border-gray-700 text-white focus:border-emerald-500 placeholder:text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-emerald-500 placeholder:text-gray-400'}`}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  
                  {form.password && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex gap-1 flex-1">
                        {[1, 2, 3, 4].map((s) => (
                          <div 
                            key={s} 
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${s <= passwordStrength ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : isDark ? 'bg-gray-700' : 'bg-gray-200'}`} 
                          />
                        ))}
                      </div>
                      <span className={`text-[8px] font-bold ${passwordStrength >= 3 ? 'text-emerald-500' : 'text-gray-400'}`}>
                        {passwordStrength === 0 ? 'Very Weak' : passwordStrength === 1 ? 'Weak' : passwordStrength === 2 ? 'Fair' : 'Strong'}
                      </span>
                    </div>
                  )}
                  {form.password && form.password.length < 8 && (
                    <p className="text-[8px] text-amber-500 mt-0.5 px-1">⚠️ En az 8 karakter</p>
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={!isFormValid || loading}
                  className="w-full py-2.5 mt-2 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20"
                >
                  {loading ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Processing...</span></>
                  ) : (
                    <><span>Create Account</span><ArrowRight className="w-3.5 h-3.5" /></>
                  )}
                </button>
              </form>

              <div className="mt-5 text-center">
                <p className={`text-[10px] font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  Already have an account?{' '}
                  <Link to="/login" className="text-emerald-600 font-bold hover:underline">Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className={`relative z-10 py-3 text-center border-t transition-colors ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white/50'} backdrop-blur-sm flex-shrink-0`}>
        <div className="flex items-center justify-center gap-2">
          <Shield className={`w-3 h-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <span className={`text-[8px] font-medium uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Encrypted Connection
          </span>
          <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />
          <span className={`text-[8px] font-medium uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Campify v3.0
          </span>
        </div>
      </footer>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}