import React from 'react';
import { User, Mail, Calendar, BookOpen, Award, Heart, Edit3 } from 'lucide-react';

export default function ProfileView({ profile, posts, isDark, setEditing, formatDate }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Card */}
      <div 
        className="relative rounded-3xl shadow-2xl transition-all duration-500 border backdrop-blur-2xl p-8"
        style={{ 
          backgroundColor: 'var(--bg-panel)', 
          borderColor: 'var(--border-soft)' 
        }}
      >
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="flex flex-col items-center">
            {/* Profil İkon Kutusu - Sidebar Yeşili Gradyan */}
            <div className="w-32 h-32 rounded-2xl p-1 shadow-2xl"
                 style={{ background: 'linear-gradient(135deg, var(--green), var(--green-2))' }}>
              <div 
                className="w-full h-full rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--bg-main)' }}
              >
                <User className="w-12 h-12" style={{ color: 'var(--green)' }} />
              </div>
            </div>
            
            {profile?.department && (
              <div 
                className="mt-4 flex items-center gap-2 px-4 py-1.5 rounded-full border"
                style={{ 
                  backgroundColor: 'var(--green-dark)', 
                  borderColor: 'var(--border-green)',
                  color: 'var(--green)'
                }}
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-sm font-medium">{profile.department}</span>
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
              <div>
                <h1 className="text-4xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
                  {profile?.firstName} {profile?.lastName}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-soft)' }}>
                    <Mail className="w-4 h-4" style={{ color: 'var(--green)' }} />
                    <span>{profile?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-soft)' }}>
                    <Calendar className="w-4 h-4" style={{ color: 'var(--green)' }} />
                    <span>Katılım: {formatDate(profile?.joinDate)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl hover:scale-105 transition-all text-white shadow-lg font-medium border-none"
                style={{ background: 'linear-gradient(135deg, var(--green), var(--green-2))' }}
              >
                <Edit3 className="w-4 h-4" />
                Profili Düzenle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Skills & Interests Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { title: 'Yetenekler', icon: Award, data: profile?.skills },
          { title: 'İlgi Alanları', icon: Heart, data: profile?.interests }
        ].map((section, idx) => (
          <div 
            key={idx} 
            className="rounded-2xl p-6 border transition-all backdrop-blur-xl hover:shadow-xl"
            style={{ 
              backgroundColor: 'var(--bg-panel)', 
              borderColor: 'var(--border-soft)' 
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--green-dark)' }}>
                <section.icon className="w-5 h-5" style={{ color: 'var(--green)' }} />
              </div>
              <h3 className="font-semibold" style={{ color: 'var(--text-main)' }}>{section.title}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {section.data?.length > 0 ? section.data.map(item => (
                <span 
                  key={item} 
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 cursor-default border"
                  style={{ 
                    backgroundColor: 'var(--green-dark)', 
                    color: 'var(--green)',
                    borderColor: 'var(--border-green)'
                  }}
                >
                  {section.title === 'İlgi Alanları' ? `#${item}` : item}
                </span>
              )) : <span className="text-sm opacity-50 italic" style={{ color: 'var(--text-soft)' }}>Henüz eklenmemiş.</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Posts Section */}
      <div 
        className="rounded-3xl p-8 border transition-all backdrop-blur-xl"
        style={{ 
          backgroundColor: 'var(--bg-panel)', 
          borderColor: 'var(--border-soft)' 
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--green-dark)' }}>
            <BookOpen className="w-5 h-5" style={{ color: 'var(--green)' }} />
          </div>
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-main)' }}>Paylaşımlar</h2>
          <span 
            className="px-2.5 py-0.5 rounded-full text-xs font-bold"
            style={{ backgroundColor: 'var(--green-dark)', color: 'var(--green)' }}
          >
            {posts.length}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {posts.length > 0 ? posts.map(post => (
            <div 
              key={post._id} 
              className="group rounded-2xl p-6 border transition-all duration-300"
              style={{ 
                backgroundColor: 'var(--bg-panel-2)', 
                borderColor: 'var(--border-soft)' 
              }}
            >
              <h3 
                className="text-lg font-semibold mb-3 transition-colors group-hover:opacity-80"
                style={{ color: 'var(--text-main)' }}
              >
                {post.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-soft)' }}>
                {post.content}
              </p>
            </div>
          )) : (
            <div className="col-span-2 text-center py-12 opacity-50 italic" style={{ color: 'var(--text-soft)' }}>
              Henüz paylaşım yok. Kampüs hayatını paylaşmaya başla!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}