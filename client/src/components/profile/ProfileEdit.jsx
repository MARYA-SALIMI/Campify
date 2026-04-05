import React, { useState } from 'react';
import { Save, Trash2, X, Plus, AlertCircle, Award, Heart } from 'lucide-react';

export default function ProfileEdit({ form, setForm, isDark, onUpdate, onCancel, setShowDeleteModal }) {
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  const handleAddTag = (e, type, value, setter) => {
    if (e.key === 'Enter' && value.trim()) {
      e.preventDefault();
      if (!form[type].includes(value.trim())) {
        setForm({ ...form, [type]: [...form[type], value.trim()] });
      }
      setter('');
    }
  };

  const removeTag = (type, tagToRemove) => {
    setForm({ ...form, [type]: form[type].filter(t => t !== tagToRemove) });
  };

  return (
    <div className={`rounded-3xl shadow-2xl transition-all duration-500 p-8 border backdrop-blur-2xl animate-in slide-in-from-bottom-4 ${isDark ? 'bg-gray-800/40 border-gray-700' : 'bg-white/60 border-gray-100'}`}>
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { label: 'First Name', key: 'firstName' },
          { label: 'Last Name', key: 'lastName' }
        ].map(field => (
          <div key={field.key}>
            <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{field.label}</label>
            <input
              value={form[field.key]}
              onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
              className={`w-full p-3.5 rounded-xl transition-all outline-none border ${isDark ? 'bg-gray-900/50 border-gray-600 text-white focus:border-emerald-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-emerald-500'}`}
            />
          </div>
        ))}
        <div className="md:col-span-2">
          <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Department</label>
          <input
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            placeholder="e.g. Computer Engineering"
            className={`w-full p-3.5 rounded-xl transition-all outline-none border ${isDark ? 'bg-gray-900/50 border-gray-600 text-white focus:border-emerald-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-emerald-500'}`}
          />
        </div>
      </div>

      {/* Dynamic Tags Management */}
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {[
          { title: 'Skills', icon: Award, type: 'skills', val: newSkill, set: setNewSkill },
          { title: 'Interests', icon: Heart, type: 'interests', val: newInterest, set: setNewInterest }
        ].map(section => (
          <div key={section.type}>
            <label className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <section.icon className="w-4 h-4 text-emerald-500" /> {section.title}
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {form[section.type].map(tag => (
                <span key={tag} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600'}`}>
                  {tag}
                  <button onClick={() => removeTag(section.type, tag)} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <div className="relative">
              <input
                value={section.val}
                onChange={(e) => section.set(e.target.value)}
                onKeyDown={(e) => handleAddTag(e, section.type, section.val, section.set)}
                placeholder={`Type a ${section.type.slice(0,-1)} and press Enter`}
                className={`w-full p-3 pl-10 rounded-xl text-sm border transition-all outline-none ${isDark ? 'bg-gray-900/50 border-gray-600 text-white focus:border-emerald-500' : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-emerald-500'}`}
              />
              <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="mt-10 pt-6 border-t border-red-500/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-2 text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-xl transition-all text-sm font-medium"
        >
          <Trash2 className="w-4 h-4" /> Delete Account
        </button>

        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={onCancel} className={`flex-1 md:px-8 py-3 rounded-xl font-medium transition-all ${isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            Cancel
          </button>
          <button onClick={onUpdate} className="flex-1 md:px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg font-medium flex items-center justify-center gap-2 hover:scale-105 transition-all">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}