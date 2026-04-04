import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Mail, Lock, ArrowRight, Command, 
  Sparkles, Heart, Eye, EyeOff,
  Shield, Fingerprint,
  CheckCircle2, XCircle, Loader2,
  Sun, Moon
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const [isDark, setIsDark] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/profile', { replace: true });
  }, [isAuthenticated, navigate]);

  const validateEmail = useCallback((email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }, []);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailValid(validateEmail(value) || value === '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/profile');
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  const quotes = [
    "Education is the most powerful weapon.",
    "Learn today, lead tomorrow.",
    "Knowledge shared is knowledge squared.",
    "Together we achieve more."
  ];
  
  const [currentQuote, setCurrentQuote] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`h-screen w-full transition-all duration-500 ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-white to-emerald-50'} overflow-hidden flex flex-col font-sans`}>
      
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
        
        {/* Animated Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Navigation */}
      <nav className={`relative z-20 px-6 md:px-12 py-4 flex items-center justify-between border-b transition-colors ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-white/50'} backdrop-blur-md flex-shrink-0`}>
        <Link to="/" className="flex items-center gap-2 group">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 ${isDark ? 'bg-emerald-500' : 'bg-gradient-to-br from-emerald-500 to-teal-500'}`}>
            <Command className="w-5 h-5 text-white" />
          </div>
          <span className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Campify
          </span>
        </Link>
        
        <Link 
          to="/register" 
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
            isDark 
              ? 'bg-gray-800 text-gray-300 hover:bg-emerald-600 hover:text-white border border-gray-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-emerald-500 hover:text-white'
          }`}
        >
          <span>Sign Up</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </nav>

      {/* Main Content - Tam ekran, scroll yok */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 overflow-hidden">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Side - Sadece değişen metin ve kutucuk */}
            <div className="space-y-6">
              {/* Animated Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 animate-pulse">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-emerald-600 tracking-wider">✦ CAMPIFY ECOSYSTEM ✦</span>
              </div>
              
              {/* Main Heading */}
              <div className="space-y-3">
                <h1 className={`text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter leading-[1.1] ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  Welcome
                  <span className="block bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                    Back to Campus
                  </span>
                </h1>
                <p className={`text-base lg:text-lg max-w-md ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your digital campus hub for collaboration, learning, and growth.
                </p>
              </div>
              
              {/* Rotating Quote */}
              <div className={`p-6 rounded-2xl transition-all duration-500 ${isDark ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/60 border border-emerald-100'} backdrop-blur-sm`}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 text-emerald-500 font-bold text-xs">✦</div>
                  </div>
                  <div>
                    <p className={`text-sm italic leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      "{quotes[currentQuote]}"
                    </p>
                    <p className="text-xs text-emerald-500 mt-2 font-medium">— Campify Community</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Sadece form ve buton */}
            <div className="w-full">
              <div className={`relative rounded-3xl shadow-2xl transition-all duration-500 ${isDark ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/90 border border-gray-100'} backdrop-blur-xl`}>
                <div className="absolute -top-5 -right-5 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-2xl" />
                <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-gradient-to-tr from-teal-400/20 to-transparent rounded-full blur-2xl" />
                
                <div className="relative p-8 md:p-10">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                      <Fingerprint className="w-4 h-4 text-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-600 tracking-wider">SECURE LOGIN</span>
                    </div>
                    <h2 className={`text-2xl md:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      Sign In
                    </h2>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Enter your credentials to access your dashboard
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 animate-shake">
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm text-red-600 flex-1">{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Field */}
                    <div>
                      <label className={`block text-xs font-bold mb-2 uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Mail className="inline w-3 h-3 mr-1" /> Email Address
                      </label>
                      <div className={`relative transition-all duration-200 ${focusedField === 'email' ? 'scale-[1.02]' : ''}`}>
                        <input
                          type="email"
                          value={email}
                          onChange={handleEmailChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          required
                          disabled={loading}
                          className={`w-full border-2 rounded-xl px-4 py-3.5 text-sm focus:outline-none transition-all disabled:opacity-50 ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500 placeholder:text-gray-500' 
                              : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-emerald-500 placeholder:text-gray-400'
                          } ${email && !emailValid ? 'border-red-400 focus:border-red-500' : ''}`}
                          placeholder="student@university.edu"
                        />
                        {email && emailValid && (
                          <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                        )}
                      </div>
                      {email && !emailValid && (
                        <p className="mt-1 text-xs text-red-500">Please enter a valid email address</p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div>
                      <label className={`block text-xs font-bold mb-2 uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <Lock className="inline w-3 h-3 mr-1" /> Password
                      </label>
                      <div className={`relative transition-all duration-200 ${focusedField === 'password' ? 'scale-[1.02]' : ''}`}>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                          required
                          disabled={loading}
                          className={`w-full border-2 rounded-xl px-4 pr-12 py-3.5 text-sm focus:outline-none transition-all disabled:opacity-50 ${
                            isDark 
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-emerald-500 placeholder:text-gray-500' 
                              : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-emerald-500 placeholder:text-gray-400'
                          }`}
                          placeholder="••••••••"
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button - Access Dashboard */}
                    <button 
                      type="submit"
                      disabled={loading || !email || !password || (email && !emailValid)}
                      className="relative w-full mt-6 group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className={`relative px-6 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all group-hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                        isDark 
                          ? 'bg-emerald-600 text-white hover:bg-emerald-500' 
                          : 'bg-emerald-600 text-white hover:bg-emerald-500'
                      }`}>
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Authenticating...</span>
                          </>
                        ) : (
                          <>
                            <span>Access Dashboard</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </div>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Yukarı taşındı, minimal */}
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