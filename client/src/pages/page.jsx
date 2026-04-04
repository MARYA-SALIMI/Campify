import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [constellation, setConstellation] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [floatingMessages, setFloatingMessages] = useState([]);
  const [activeMessage, setActiveMessage] = useState(null);
  const [glowIntensity, setGlowIntensity] = useState(0.5);
  const canvasRef = useRef(null);
  const cardRef = useRef(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Zamanı algıla
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
  }, []);

  // Rastgele yüzen mesajlar oluştur (EGLENCELİ!)
  useEffect(() => {
    const messages = [
      { text: "🚀 projeni fırlat", icon: "🚀", color: "#FF6B6B", size: 16, speed: 1 },
      { text: "💡 yeni fikir", icon: "💡", color: "#FFD93D", size: 18, speed: 1.2 },
      { text: "🤖 AI destek", icon: "🤖", color: "#6C5CE7", size: 17, speed: 0.8 },
      { text: "⚡ hızlı öğren", icon: "⚡", color: "#00E696", size: 15, speed: 1.5 },
      { text: "🎯 hedef bul", icon: "🎯", color: "#FF8A5C", size: 16, speed: 1.1 },
      { text: "📚 ders notu", icon: "📚", color: "#A8E6CF", size: 14, speed: 0.9 },
      { text: "👥 ekip kur", icon: "👥", color: "#FFB8B8", size: 17, speed: 1.3 },
      { text: "🏆 başarı", icon: "🏆", color: "#FFD700", size: 19, speed: 0.7 },
      { text: "🌱 büyü", icon: "🌱", color: "#00E696", size: 16, speed: 1.4 },
      { text: "🔮 gelecek", icon: "🔮", color: "#9B59B6", size: 15, speed: 1.6 },
      { text: "🎨 yarat", icon: "🎨", color: "#F39C12", size: 17, speed: 0.8 },
      { text: "🧠 öğren", icon: "🧠", color: "#3498DB", size: 18, speed: 1.2 },
      { text: "💪 geliş", icon: "💪", color: "#E67E22", size: 16, speed: 1.1 },
      { text: "🌟 parla", icon: "🌟", color: "#F1C40F", size: 20, speed: 0.9 },
      { text: "🎓 mezun", icon: "🎓", color: "#1ABC9C", size: 15, speed: 1.3 },
      { text: "📝 not al", icon: "📝", color: "#E74C3C", size: 14, speed: 1.5 },
    ];

    const positionedMessages = messages.map((msg, i) => ({
      ...msg,
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * msg.speed * 0.15,
      vy: (Math.random() - 0.5) * msg.speed * 0.15,
      rotation: Math.random() * 360,
      scale: 0.8 + Math.random() * 0.5,
      delay: Math.random() * 5,
      pulseSpeed: 0.5 + Math.random(),
      glowSize: 10 + Math.random() * 20,
    }));

    setFloatingMessages(positionedMessages);

    // Animasyon döngüsü
    const interval = setInterval(() => {
      setFloatingMessages(prev => prev.map(msg => ({
        ...msg,
        x: msg.x + msg.vx,
        y: msg.y + msg.vy,
        rotation: msg.rotation + 0.02,
        ...(msg.x < 0 || msg.x > 100 ? { vx: msg.vx * -1 } : {}),
        ...(msg.y < 0 || msg.y > 100 ? { vy: msg.vy * -1 } : {}),
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Rastgele takımyıldız oluştur
  useEffect(() => {
    const points = [];
    const centerX = 50;
    const centerY = 50;
    
    for (let i = 0; i < 15; i++) {
      const angle = (i / 15) * Math.PI * 2;
      const radius = 20 + Math.sin(i) * 5;
      
      points.push({
        x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 3,
        y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 3,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5,
        glow: Math.random() * 0.5 + 0.3
      });
    }
    setConstellation(points);
  }, []);

  // Mouse takibi
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
      
      // Işık yoğunluğunu fare hızına göre ayarla
      setGlowIntensity(prev => Math.min(1, prev + 0.01));
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    const interval = setInterval(() => {
      setGlowIntensity(prev => Math.max(0.3, prev - 0.01));
    }, 100);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  // Canvas çizimleri (GELİŞMİŞ!)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 0.5,
        color: `rgba(0, 230, 150, ${0.1 + Math.random() * 0.2})`,
        life: Math.random() * 100
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // SİYAH Arka Plan (derin uzay efekti)
      const gradient = ctx.createRadialGradient(
        canvas.width * (mousePosition.x / 100), 
        canvas.height * (mousePosition.y / 100), 
        0,
        canvas.width / 2, 
        canvas.height / 2, 
        canvas.width / 1.2
      );
      gradient.addColorStop(0, '#0A0A0F');
      gradient.addColorStop(0.3, '#0F0F15');
      gradient.addColorStop(0.7, '#050508');
      gradient.addColorStop(1, '#000000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Yıldızlar
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 0.1;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Parlama efekti
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 230, 150, ${0.02 + Math.sin(p.life * 0.02) * 0.01})`;
        ctx.fill();

        // Yıldız
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // AI Bağlantı Ağı
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Çizgi rengi - Siyah + Yeşil
            const opacity = 0.03 * (1 - distance / 150) * glowIntensity;
            ctx.strokeStyle = `rgba(0, 230, 150, ${opacity})`;
            ctx.lineWidth = 0.3;
            ctx.stroke();

            // Veri akışı partikülleri
            if (Math.random() < 0.01) {
              ctx.beginPath();
              ctx.arc(
                p1.x + (p2.x - p1.x) * Math.random(),
                p1.y + (p2.y - p1.y) * Math.random(),
                1, 0, Math.PI * 2
              );
              ctx.fillStyle = '#00E696';
              ctx.fill();
            }
          }
        });
      });

      requestAnimationFrame(draw);
    };
    draw();
  }, [mousePosition, glowIntensity]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
  };

  // Zaman dilimine göre mesajlar (KOMİK!)
  const timeMessages = {
    morning: [
      { emoji: "☕", text: "kahven hazır", icon: "🫘", tip: "double espresso" },
      { emoji: "🌅", text: "güne başla", icon: "🚀", tip: "erken kalkan yol alır" },
      { emoji: "📚", text: "ders vakti", icon: "🧠", tip: "beyin açılıyor..." },
      { emoji: "⚡", text: "enerji dolu", icon: "💪", tip: "%100 kapasite" }
    ],
    afternoon: [
      { emoji: "🍜", text: "öğle arası", icon: "🥢", tip: "ramen molası" },
      { emoji: "💻", text: "proje zamanı", icon: "👨‍💻", tip: "kodlar uçuşuyor" },
      { emoji: "🤝", text: "ekip toplantısı", icon: "👥", tip: "beyin fırtınası" },
      { emoji: "🎯", text: "hedef odaklı", icon: "🎯", tip: "vur ve geç" }
    ],
    evening: [
      { emoji: "🌙", text: "gece modu", icon: "🦉", tip: "baykuşlar uyanık" },
      { emoji: "🍵", text: "çay molası", icon: "🫖", tip: "demleme başlasın" },
      { emoji: "📝", text: "özet çıkar", icon: "✍️", tip: "notlar yetişiyor" },
      { emoji: "🎮", text: "mola zamanı", icon: "🎲", tip: "5 dakika ara" }
    ]
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes quantumFloat {
            0% { transform: translate(0, 0) rotate(0deg) scale(1); }
            25% { transform: translate(3px, -5px) rotate(1deg) scale(1.02); }
            50% { transform: translate(-2px, 3px) rotate(-1deg) scale(0.98); }
            75% { transform: translate(5px, 2px) rotate(0.5deg) scale(1.01); }
            100% { transform: translate(0, 0) rotate(0deg) scale(1); }
          }
          
          @keyframes borderGlow {
            0%, 100% { border-color: rgba(0, 230, 150, 0.3); box-shadow: 0 0 30px rgba(0, 230, 150, 0.1); }
            25% { border-color: rgba(0, 230, 150, 0.5); box-shadow: 0 0 50px rgba(0, 230, 150, 0.2); }
            50% { border-color: rgba(0, 230, 150, 0.7); box-shadow: 0 0 70px rgba(0, 230, 150, 0.3); }
            75% { border-color: rgba(0, 230, 150, 0.5); box-shadow: 0 0 50px rgba(0, 230, 150, 0.2); }
          }
          
          @keyframes rotatingLight {
            0% { transform: rotate(0deg) translateX(5px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(5px) rotate(-360deg); }
          }
          
          @keyframes glassShimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
          @keyframes messagePop {
            0% { transform: scale(1); }
            50% { transform: scale(1.1) rotate(5deg); }
            100% { transform: scale(1); }
          }
          
          @keyframes floatParticle {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
            50% { transform: translateY(-20px) scale(1.2); opacity: 0.6; }
          }
          
          .glass-card {
            background: rgba(10, 20, 15, 0.25);
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
            border: 1px solid rgba(0, 230, 150, 0.2);
            animation: borderGlow 4s ease-in-out infinite;
            position: relative;
            overflow: hidden;
          }
          
          .glass-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: conic-gradient(
              from 0deg at 50% 50%,
              transparent 0deg,
              rgba(0, 230, 150, 0.1) 60deg,
              transparent 120deg,
              rgba(0, 230, 150, 0.1) 180deg,
              transparent 240deg,
              rgba(0, 230, 150, 0.1) 300deg,
              transparent 360deg
            );
            animation: rotatingLight 8s linear infinite;
            pointer-events: none;
          }
          
          .glass-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.05),
              transparent
            );
            background-size: 200% 100%;
            animation: glassShimmer 3s linear infinite;
            pointer-events: none;
          }
          
          .floating-message {
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
            user-select: none;
          }
          
          .floating-message:hover {
            transform: scale(1.2) !important;
            z-index: 1000;
            filter: drop-shadow(0 0 20px currentColor);
          }
          
          .ai-particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: #00E696;
            border-radius: 50%;
            filter: blur(1px);
            animation: floatParticle 3s ease-in-out infinite;
          }
        `}
      </style>

      {/* Canvas - Derin Uzay */}
      <canvas ref={canvasRef} style={styles.canvas} />

      {/* AI Partikülleri */}
      {[...Array(30)].map((_, i) => (
        <div
          key={`ai-${i}`}
          className="ai-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: 0.1 + Math.random() * 0.2,
          }}
        />
      ))}

      {/* YÜZEN MESAJLAR - EĞLENCELİ! */}
      {floatingMessages.map((msg) => (
        <div
          key={msg.id}
          className="floating-message"
          style={{
            position: 'fixed',
            left: `${msg.x}%`,
            top: `${msg.y}%`,
            transform: `translate(-50%, -50%) rotate(${msg.rotation}deg) scale(${msg.scale})`,
            zIndex: activeMessage === msg.id ? 100 : 5,
            background: `linear-gradient(135deg, ${msg.color}15, ${msg.color}05)`,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: `1px solid ${msg.color}30`,
            borderRadius: '30px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#fff',
            fontSize: `${msg.size}px`,
            boxShadow: `0 5px 20px ${msg.color}20`,
            transition: 'all 0.2s ease',
            animation: `messagePop ${msg.pulseSpeed}s ease-in-out infinite`,
            pointerEvents: 'auto',
            cursor: 'pointer',
          }}
          onMouseEnter={() => setActiveMessage(msg.id)}
          onMouseLeave={() => setActiveMessage(null)}
          onClick={() => setSelectedMemory(msg)}
        >
          <span style={{ fontSize: msg.size + 4 }}>{msg.icon}</span>
          <span style={{ fontSize: msg.size - 2, fontWeight: '500' }}>{msg.text}</span>
          {activeMessage === msg.id && (
            <span style={{
              fontSize: msg.size - 4,
              color: msg.color,
              marginLeft: '4px',
              animation: 'quantumFloat 0.5s ease',
            }}>
              {msg.tip || '✨'}
            </span>
          )}
        </div>
      ))}

      {/* Zaman Kristali - Siyah + Yeşil */}
      <div style={styles.timeCrystal}>
        <div style={styles.crystalCore}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{
              ...styles.crystalRing,
              borderColor: `rgba(0, 230, 150, ${0.15 - i * 0.025})`,
              width: `${100 - i * 12}%`,
              height: `${100 - i * 12}%`,
              animationDelay: `${i * 0.3}s`,
              boxShadow: `0 0 20px rgba(0, 230, 150, ${0.1 - i * 0.02})`,
              background: `radial-gradient(circle at 30% 30%, rgba(0, 230, 150, ${0.05 - i * 0.01}), transparent)`,
            }} />
          ))}
        </div>
      </div>

      {/* Takımyıldız - Gelişmiş */}
      <svg style={styles.constellation}>
        <defs>
          <radialGradient id="starGlow2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00E696" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00E696" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {constellation.map((point, i) => (
          <g key={i} filter="url(#glow)">
            <circle
              cx={`${point.x}%`}
              cy={`${point.y}%`}
              r={point.size * 4}
              fill="url(#starGlow2)"
              opacity="0.1"
            />
            <circle
              cx={`${point.x}%`}
              cy={`${point.y}%`}
              r={point.size}
              fill="#00E696"
              opacity={point.glow}
              style={{ animation: `quantumFloat ${3 + point.delay}s ease-in-out infinite` }}
            />
          </g>
        ))}
      </svg>

      {/* Veri Akışı - Premium */}
      <div style={styles.dataStreams}>
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{
            ...styles.stream,
            background: `linear-gradient(180deg, transparent, rgba(0, 230, 150, ${0.03}), transparent)`,
            left: `${(i * 5) % 100}%`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: `${3 + (i % 4)}s`,
            height: `${20 + (i % 8) * 10}%`,
          }} />
        ))}
      </div>

      {/* ZAMAN MESAJLARI - ÇOK EĞLENCELİ! */}
      <div style={styles.timeMessages}>
        {timeMessages[timeOfDay].map((msg, i) => {
          const positions = [
            { top: '12%', left: '8%' },
            { top: '18%', right: '8%' },
            { top: '75%', left: '10%' },
            { top: '82%', right: '10%' }
          ];
          
          return (
            <div
              key={i}
              className="floating-message"
              style={{
                position: 'absolute',
                ...positions[i],
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 230, 150, 0.2)',
                borderRadius: '20px',
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#fff',
                fontSize: '14px',
                boxShadow: '0 5px 20px rgba(0, 0, 0, 0.3)',
                zIndex: 6,
                animation: `quantumFloat ${3 + i}s ease-in-out infinite`,
                minWidth: '180px',
              }}
            >
              <div style={{
                background: `linear-gradient(135deg, ${msg.emoji === '☕' ? '#6F4E37' : '#00E696'}, #00B86B)`,
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}>
                {msg.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                  {msg.text} {msg.icon}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                  {msg.tip}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ANA KART - CAM GİBİ VE IŞIKLI! */}
      <div style={styles.quantumCore}>
        <div className="glass-card" style={styles.card} ref={cardRef}>
          
          {/* Işık Halkaları */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            left: '-20%',
            width: '140%',
            height: '140%',
            background: 'radial-gradient(circle at 30% 30%, rgba(0, 230, 150, 0.1), transparent 70%)',
            animation: 'rotatingLight 12s linear infinite',
            pointerEvents: 'none',
          }} />

          {/* Logo - Premium */}
          <div style={styles.logoDimension}>
            <div style={styles.logoCrystal}>
              <div style={{...styles.logoFace1, background: 'linear-gradient(135deg, #00E696, #000000)'}}>
                <span style={styles.logoText}>AI</span>
              </div>
              <div style={{...styles.logoFace2, background: 'linear-gradient(135deg, #000000, #00E696)'}}>
                <span style={styles.logoText}>∞</span>
              </div>
              <div style={{...styles.logoFace3, background: 'linear-gradient(135deg, #00E696, #001A0F)'}}>
                <span style={styles.logoText}>C</span>
              </div>
            </div>
            <h1 style={{...styles.title, color: '#fff'}}>
              <span style={{ background: 'linear-gradient(135deg, #00E696, #fff, #00E696)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                DeepCamp
              </span>
            </h1>
            <div style={styles.titleUnderline}>
              <span style={styles.underlineText}>AI-Powered v3.0</span>
              <span style={{color: '#00E696', fontSize: '16px'}}>⚡</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} style={styles.quantumForm}>
            
            {/* Email - Siyah Tema */}
            <div style={styles.quantumField}>
              <div style={{...styles.fieldEnergy, 
                background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 230, 150, 0.1), transparent 60%)`
              }} />
              <input
                type="email"
                className="input-quantum"
                placeholder="🤖 AI e-posta"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.quantumInput}
                required
              />
            </div>

            {/* Şifre */}
            <div style={styles.quantumField}>
              <div style={{...styles.fieldEnergy, 
                background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 230, 150, 0.1), transparent 60%)`
              }} />
              <input
                type="password"
                className="input-quantum"
                placeholder="🔐 AI şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.quantumInput}
                required
              />
            </div>

            {/* AI Buton */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="quantum-button"
              style={{
                ...styles.quantumButton,
                background: 'linear-gradient(135deg, #000000, #00E696, #000000)',
                backgroundSize: '200% 200%',
                animation: 'gradientShift 3s ease infinite',
                ...(isSubmitting ? styles.buttonCollapsed : {})
              }}
            >
              {isSubmitting ? (
                <span style={styles.quantumLoader}>🤖</span>
              ) : (
                <>
                  <span style={styles.buttonText}>AI GİRİŞ YAP</span>
                  <span style={styles.buttonParticle}>🚀</span>
                </>
              )}
            </button>
          </form>

          {/* Register Link - Siyah + Yeşil */}
          <div style={styles.parallelUniverse}>
            <div style={{...styles.universeLine, 
              background: 'linear-gradient(90deg, transparent, #00E696, #000000, #00E696, transparent)'
            }} />
            <div style={styles.universeContent}>
              <span style={styles.universeText}>AI dünyasına katıl</span>
              <Link to="/register" className="universe-portal" style={styles.universePortal}>
                <span style={styles.portalText}>yapay zeka oluştur</span>
                <span style={styles.portalIcon}>🧠</span>
              </Link>
            </div>
          </div>

          {/* AI Durum Göstergesi */}
          <div style={styles.quantumState}>
            <div style={styles.stateIndicator}>
              <span style={{...styles.stateDot, background: '#00E696', animation: 'pulse 1s infinite'}} />
              <span style={styles.stateText}>AI</span>
              <span style={styles.stateLabel}>aktif</span>
            </div>
            <div style={styles.stateParticles}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{
                  ...styles.stateParticle,
                  background: '#00E696',
                  left: `${i * 8}px`,
                  animation: `quantumFloat ${1 + i * 0.2}s ease-in-out infinite`,
                }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SEÇİLİ MESAJ DETAYI - Premium Modal */}
      {selectedMemory && (
        <div style={styles.memoryDetail} onClick={() => setSelectedMemory(null)}>
          <div style={{...styles.detailContent, borderColor: '#00E696', background: 'rgba(0,0,0,0.8)'}}>
            <span style={styles.detailEmoji}>{selectedMemory.icon || selectedMemory}</span>
            <h3 style={styles.detailTitle}>
              {selectedMemory.text || 'AI Mesajı'}
            </h3>
            <p style={styles.detailText}>
              {selectedMemory.tip || 'Bu mesaj hakkında daha fazla bilgi...'}
            </p>
            <div style={styles.detailFooter}>
              <span style={styles.detailButton}>AI ile keşfet →</span>
            </div>
          </div>
        </div>
      )}

      {/* Sonsuzluk Göstergesi - Premium */}
      <div style={styles.infinityIndicator}>
        <div style={styles.infinityTrack}>
          <div style={{...styles.infinityProgress, background: '#00E696', width: `${glowIntensity * 100}%`}} />
        </div>
        <span style={styles.infinityText}>
          <span style={styles.infinityIcon}>∞</span>
          <span>AI BAĞLANTI</span>
        </span>
      </div>

      {/* AI Versiyon */}
      <div style={styles.version}>
        <span style={styles.versionText}>DeepSeek AI • v3.0 • %100 Güç</span>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    background: '#000000', // SİYAH!
  },

  canvas: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    pointerEvents: 'none',
  },

  timeCrystal: {
    position: 'fixed',
    top: '5%',
    right: '3%',
    width: '100px',
    height: '100px',
    zIndex: 1,
    opacity: 0.3,
  },

  crystalCore: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'timeCrystal 15s linear infinite',
  },

  crystalRing: {
    position: 'absolute',
    border: '1px solid',
    borderRadius: '40% 60% 60% 40% / 40% 40% 60% 60%',
    animation: 'quantumFloat 6s ease-in-out infinite',
  },

  constellation: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    pointerEvents: 'none',
  },

  dataStreams: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    pointerEvents: 'none',
  },

  stream: {
    position: 'absolute',
    top: 0,
    animation: 'dataStream 4s linear infinite',
  },

  timeMessages: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 6,
    pointerEvents: 'none',
  },

  quantumCore: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10,
    width: '100%',
    maxWidth: '360px', // Biraz daha küçük
  },

  card: {
    position: 'relative',
    borderRadius: '35px',
    padding: '30px',
    overflow: 'hidden',
  },

  logoDimension: {
    textAlign: 'center',
    marginBottom: '20px',
  },

  logoCrystal: {
    position: 'relative',
    width: '55px',
    height: '55px',
    margin: '0 auto 12px',
    transformStyle: 'preserve-3d',
    animation: 'timeCrystal 15s linear infinite',
  },

  logoFace1: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    transform: 'rotateY(0deg) translateZ(12px)',
  },

  logoFace2: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    transform: 'rotateY(90deg) translateZ(12px)',
  },

  logoFace3: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    transform: 'rotateY(180deg) translateZ(12px)',
  },

  logoText: {
    fontSize: '24px',
    fontWeight: '700',
  },

  title: {
    fontSize: '30px',
    fontWeight: '700',
    margin: '0 0 4px 0',
    letterSpacing: '-0.5px',
  },

  titleUnderline: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },

  underlineText: {
    fontSize: '10px',
    color: 'rgba(255, 255, 255, 0.3)',
  },

  quantumForm: {
    marginBottom: '18px',
  },

  quantumField: {
    position: 'relative',
    marginBottom: '10px',
  },

  fieldEnergy: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    animation: 'quantumFloat 5s ease-in-out infinite',
  },

  quantumInput: {
    width: '100%',
    padding: '12px 18px',
    borderRadius: '22px',
    color: '#fff',
    fontSize: '13px',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: 1,
    background: 'rgba(0, 0, 0, 0.3) !important',
    border: '1px solid rgba(0, 230, 150, 0.2) !important',
  },

  quantumButton: {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '22px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    position: 'relative',
    overflow: 'hidden',
  },

  buttonText: {
    position: 'relative',
    zIndex: 2,
  },

  buttonParticle: {
    fontSize: '16px',
    animation: 'quantumFloat 1s ease-in-out infinite',
  },

  buttonCollapsed: {
    transform: 'scale(0.98)',
    opacity: 0.8,
  },

  quantumLoader: {
    fontSize: '20px',
    animation: 'timeCrystal 1s linear infinite',
  },

  parallelUniverse: {
    textAlign: 'center',
  },

  universeLine: {
    height: '1px',
    marginBottom: '12px',
  },

  universeContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },

  universeText: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.4)',
  },

  universePortal: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(0, 230, 150, 0.2)',
    borderRadius: '22px',
    textDecoration: 'none',
    fontSize: '12px',
    transition: 'all 0.3s ease',
  },

  portalText: {
    color: '#00E696',
  },

  portalIcon: {
    fontSize: '14px',
    color: '#00E696',
  },

  quantumState: {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  stateIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '14px',
    border: '1px solid rgba(0, 230, 150, 0.1)',
  },

  stateDot: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
  },

  stateText: {
    fontSize: '10px',
    color: '#00E696',
  },

  stateLabel: {
    fontSize: '9px',
    color: 'rgba(255, 255, 255, 0.3)',
  },

  stateParticles: {
    position: 'relative',
    width: '24px',
    height: '8px',
  },

  stateParticle: {
    position: 'absolute',
    width: '2px',
    height: '2px',
    borderRadius: '50%',
  },

  memoryDetail: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },

  detailContent: {
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    border: '1px solid',
    borderRadius: '35px',
    padding: '25px',
    textAlign: 'center',
    maxWidth: '280px',
  },

  detailEmoji: {
    fontSize: '45px',
    marginBottom: '12px',
    display: 'block',
  },

  detailTitle: {
    fontSize: '18px',
    color: '#fff',
    margin: '0 0 8px 0',
  },

  detailText: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.7)',
    margin: '0 0 16px 0',
  },

  detailFooter: {
    marginTop: '8px',
  },

  detailButton: {
    fontSize: '12px',
    color: '#00E696',
  },

  infinityIndicator: {
    position: 'fixed',
    bottom: '12px',
    left: '12px',
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  infinityTrack: {
    width: '45px',
    height: '2px',
    background: 'rgba(0, 230, 150, 0.1)',
    borderRadius: '1px',
    overflow: 'hidden',
  },

  infinityProgress: {
    height: '100%',
    transition: 'width 0.3s ease',
  },

  infinityText: {
    fontSize: '9px',
    color: 'rgba(0, 230, 150, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '3px',
  },

  infinityIcon: {
    fontSize: '10px',
  },

  version: {
    position: 'fixed',
    bottom: '12px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 5,
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(5px)',
    WebkitBackdropFilter: 'blur(5px)',
    padding: '3px 10px',
    borderRadius: '16px',
    border: '1px solid rgba(0, 230, 150, 0.1)',
  },

  versionText: {
    fontSize: '9px',
    color: 'rgba(255, 255, 255, 0.2)',
  },
};