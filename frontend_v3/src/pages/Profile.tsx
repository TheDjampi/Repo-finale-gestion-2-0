import { useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Save, User as UserIcon, Mail, Phone, Camera, Shield, Star, Award, Zap, Crown, Gamepad2, Trophy, Target, Calendar, Flame, Activity } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { PLAYER_POSITIONS } from '../types/api';

export default function Profile() {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState({
    first_name: user?.first_name ?? '',
    last_name: user?.last_name ?? '',
    position: user?.position ?? '',
    phone: user?.phone ?? '',
    photo_url: user?.photo_url ?? '',
  });
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => api.put('/players/me', form),
    onSuccess: () => { 
      setSaved(true); 
      setTimeout(() => setSaved(false), 2500); 
    },
  });

  async function handlePhotoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const data = new FormData();
      data.append('file', file);
      data.append('folder', 'profiles');
      const response = await api.post('/media/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((current) => ({ ...current, photo_url: response.data.url }));
      await api.put('/players/me', { ...form, photo_url: response.data.url });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setSaved(false);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  if (!user) return null;

  // Initiales pour avatar
  const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  
  // Calculer niveau et stats style UT
  const userLevel = Math.floor((user.total_goals * 2 + user.matches_played) / 3) || 1;
  const xpProgress = ((user.total_goals * 2 + user.matches_played) % 3) / 3 * 100;
  
  // Définir la couleur de rareté
  const getRarityConfig = (level: number) => {
    if (level >= 15) return {
      border: 'border-ut-gold',
      gradient: 'from-ut-gold via-yellow-400 to-ut-gold',
      text: 'text-ut-gold',
      bg: 'bg-ut-gold/10',
      borderColor: 'border-ut-gold/30',
      glow: 'shadow-ut-gold',
      badge: 'LEGENDARY',
      badgeColor: 'bg-ut-gold text-ut-bg border-ut-gold'
    };
    if (level >= 10) return {
      border: 'border-ut-purple',
      gradient: 'from-ut-purple via-purple-400 to-ut-purple',
      text: 'text-ut-purple',
      bg: 'bg-ut-purple/10',
      borderColor: 'border-ut-purple/30',
      glow: 'shadow-ut-purple',
      badge: 'SPECIAL',
      badgeColor: 'bg-ut-purple text-white border-ut-purple'
    };
    if (level >= 5) return {
      border: 'border-ut-cyan',
      gradient: 'from-ut-cyan via-cyan-400 to-ut-cyan',
      text: 'text-ut-cyan',
      bg: 'bg-ut-cyan/10',
      borderColor: 'border-ut-cyan/30',
      glow: 'shadow-ut-cyan',
      badge: 'RARE',
      badgeColor: 'bg-ut-cyan text-ut-bg border-ut-cyan'
    };
    return {
      border: 'border-gray-400',
      gradient: 'from-gray-400 via-gray-300 to-gray-400',
      text: 'text-gray-400',
      bg: 'bg-gray-400/10',
      borderColor: 'border-gray-400/30',
      glow: '',
      badge: 'COMMON',
      badgeColor: 'bg-gray-500 text-white border-gray-500'
    };
  };

  const rarity = getRarityConfig(userLevel);

  return (
    <div className="max-w-4xl mx-auto space-y-6 opacity-0 animate-pitch-entry">
      
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-4 font-heading">
            <span className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/10 border border-pink-500/30 flex items-center justify-center shadow-lg">
              <UserIcon className="w-7 h-7 text-pink-400" />
            </span>
            Mon Profil
          </h1>
          <p className="text-ut-text-secondary text-sm mt-2">Gérez vos informations personnelles et suivez vos statistiques.</p>
        </div>

        {/* Badge compte vérifié style UT */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ut-surface border border-ut-border">
          <Shield className="w-4 h-4 text-ut-green" />
          <span className="text-xs font-medium">Compte vérifié</span>
          <CheckCircle2 className="w-4 h-4 text-ut-green" />
        </div>
      </div>

      {/* ═══ Card principale du profil - Style Carte Joueur UT ═══ */}
      <div className={`ut-card ${rarity.border} border-2 overflow-hidden`}>
        
        {/* Header de la card avec avatar style UT */}
        <div className="p-6 pb-0 sm:p-8 sm:pb-0 bg-gradient-to-br from-ut-bg via-ut-surface to-transparent border-b border-ut-border/50 relative overflow-hidden">
          
          {/* Background décoratif */}
          <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-bl from-ut-cyan/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-ut-purple/5 to-transparent rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative flex items-center gap-6">
            
            {/* Avatar avec anneau gradient style UT */}
            <div className="relative group cursor-pointer w-24 h-24 shrink-0">
              {/* Anneau extérieur animé selon rareté */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${rarity.gradient} p-[3px] opacity-80 group-hover:opacity-100 transition-opacity`}>
                <div className="w-full h-full rounded-2xl ut-bg flex items-center justify-center text-2xl font-bold text-white shadow-lg overflow-hidden">
                  {user.photo_url ? (
                    <img src={user.photo_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
              </div>
              
              {/* Badge niveau style UT */}
              <div className={`absolute -bottom-2 -right-2 px-3 py-1.5 rounded-lg font-black text-sm ut-bg border-2 ${rarity.badgeColor} shadow-lg`}>
                LV.{userLevel}
              </div>
              
              {/* Badge rareté */}
              <div className={`absolute -top-2 -left-2 px-2 py-1 rounded text-[9px] font-black tracking-wider ut-bg border ${rarity.borderColor} ${rarity.text}`}>
                {rarity.badge}
              </div>
              
              {/* Badge camera pour changer la photo */}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full ut-surface border border-ut-border flex items-center justify-center shadow-lg hover:bg-ut-cyan hover:border-ut-cyan hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </div>
            
            {/* Info utilisateur */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-bold text-xl truncate font-heading">{user.email}</h2>
                {saved && (
                  <span className="px-2 py-1 rounded-full bg-ut-green/10 text-ut-green text-[10px] font-bold flex items-center gap-1 animate-bounce-in">
                    <Save className="w-3 h-3" /> Sauvegardé
                  </span>
                )}
              </div>
              <p className="text-xs text-ut-text-secondary capitalize flex items-center gap-2">
                <Star className="w-4 h-4 text-ut-gold" />
                <span className="font-medium">{user.role}</span>
                <span className="text-ut-border">•</span>
                <span>Membre depuis {new Date(user.created_at ?? Date.now()).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
              </p>
              
              {/* Barre XP */}
              <div className="mt-3 max-w-[250px]">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-ut-text-muted">XP vers Niv.{userLevel + 1}</span>
                  <span className={rarity.text}>{Math.round(xpProgress)}%</span>
                </div>
                <div className="h-1.5 bg-ut-bg rounded-full overflow-hidden border border-ut-border/50">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 relative bg-gradient-to-r ${rarity.gradient}`}
                    style={{ width: `${xpProgress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats rapides style attributs UT */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="text-center px-4 py-3 rounded-xl bg-ut-bg/60 border border-ut-border/40 hover:border-ut-cyan/40 transition-all group/stat">
                <Trophy className="w-5 h-5 mx-auto mb-1.5 text-ut-cyan group-hover/stat:scale-110 transition-transform" />
                <p className="text-xl font-extrabold text-ut-cyan font-heading">{user.total_goals}</p>
                <p className="text-[9px] text-ut-text-muted uppercase tracking-wider">Buts</p>
              </div>
              
              <div className="text-center px-4 py-3 rounded-xl bg-ut-bg/60 border border-ut-border/40 hover:border-ut-green/40 transition-all group/stat">
                <Calendar className="w-5 h-5 mx-auto mb-1.5 text-ut-green group-hover/stat:scale-110 transition-transform" />
                <p className="text-xl font-extrabold text-ut-green font-heading">{user.matches_played}</p>
                <p className="text-[9px] text-ut-text-muted uppercase tracking-wider">Matchs</p>
              </div>
              
              <div className="text-center px-4 py-3 rounded-xl bg-ut-bg/60 border border-ut-border/40 hover:border-ut-gold/40 transition-all group/stat">
                <Target className="w-5 h-5 mx-auto mb-1.5 text-ut-gold group-hover/stat:scale-110 transition-transform" />
                <p className="text-xl font-extrabold text-ut-gold font-heading">{user.position || '—'}</p>
                <p className="text-[9px] text-ut-text-muted uppercase tracking-wider">Poste</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire d'édition style UT */}
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="p-6 pt-6 space-y-5">
          
          {/* Nom & Prénom côte à côte */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] text-ut-text-secondary font-semibold uppercase tracking-wide ml-1 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-ut-cyan" /> Prénom
              </label>
              <input 
                value={form.first_name} 
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="ut-input"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] text-ut-text-secondary font-semibold uppercase tracking-wide ml-1 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-ut-cyan" /> Nom
              </label>
              <input 
                value={form.last_name} 
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="ut-input"
              />
            </div>
          </div>

          {/* Poste */}
          <div className="space-y-2">
            <label className="text-[11px] text-ut-text-secondary font-semibold uppercase tracking-wide ml-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-ut-cyan" /> Poste
            </label>
            <select 
              value={form.position} 
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              className="ut-input appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3e%3c/path%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.8rem center', backgroundSize: '14px' }}
            >
              <option value="">Non défini</option>
              {PLAYER_POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Téléphone */}
          <div className="space-y-2">
            <label className="text-[11px] text-ut-text-secondary font-semibold uppercase tracking-wide ml-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-ut-cyan" /> Téléphone
            </label>
            <input 
              value={form.phone} 
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+221 XX XXX XX XX"
              className="ut-input placeholder:text-ut-text-muted/40"
            />
          </div>

          {/* Bouton sauvegarder style UT */}
          <button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || uploading}
            className={`
              w-full relative flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold tracking-wide
              transition-all duration-300 overflow-hidden group
              ${mutation.isPending 
                ? 'bg-gray-600 cursor-not-allowed' 
                : saved 
                  ? 'bg-gradient-to-r from-ut-green to-emerald-600 text-ut-bg shadow-[0_4px_25px_rgba(0,255,136,0.35)] border border-ut-green/50' 
                  : 'bg-gradient-to-r from-ut-cyan/20 to-purple-500/20 hover:from-ut-cyan/30 hover:to-purple-500/30 text-ut-cyan border border-ut-cyan/40 hover:border-ut-cyan/70 hover:shadow-glow-sm hover:-translate-y-0.5 active:translate-y-0'
              }
            `}
          >
            {!mutation.isPending && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            )}
            
            {mutation.isPending ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 0 0 12h.002z"></path></svg>
                Enregistrement...
              </>
            ) : saved ? (
              <>
                <Save className="w-5 h-5" /> Sauvegardé !
              </>
            ) : (
              <>
                <Save className="w-5 h-5" /> Enregistrer les modifications
              </>
            )}
          </button>
        </form>
      </div>

      {/* ═══ Section Badges / Achievements - Style UT ═══ */}
      <div className="ut-card p-6 hover:border-ut-gold/30">
        <h3 className="font-semibold text-base mb-5 flex items-center gap-2 font-heading">
          <Zap className="w-5 h-5 text-ut-gold" />
          Badges & Réalisations
          <span className="ml-auto text-xs text-ut-text-muted font-normal">{[
            { label: 'Profil créé', unlocked: true },
            { label: 'Membre actif', unlocked: true },
            { label: 'Poste défini', unlocked: !!user.position },
            { label: 'Téléphone', unlocked: !!user.phone },
            { label: 'Premier but', unlocked: false },
            { label: '5 matchs', unlocked: false },
          ].filter(b => b.unlocked).length}/6 débloqués</span>
        </h3>
        
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { icon: UserIcon, label: 'Profil créé', unlocked: true, rarity: 'common' },
            { icon: Shield, label: 'Membre actif', unlocked: true, rarity: 'common' },
            { icon: Target, label: 'Poste défini', unlocked: !!user.position, rarity: user.position ? 'rare' : 'locked' },
            { icon: Phone, label: 'Téléphone', unlocked: !!user.phone, rarity: user.phone ? 'uncommon' : 'locked' },
            { icon: Trophy, label: 'Premier but', unlocked: false, rarity: 'legendary' },
            { icon: Flame, label: '5 matchs', unlocked: false, rarity: 'epic' },
          ].map((badge, idx) => {
            const getBadgeStyle = (rarity: string) => {
              if (!badge.unlocked) return 'bg-ut-bg/50 border-ut-border/30 opacity-50';
              switch(rarity) {
                case 'legendary': return 'bg-gradient-to-br from-ut-gold/15 to-amber-500/5 border-ut-gold/40 shadow-ut-gold';
                case 'epic': return 'bg-gradient-to-br from-ut-purple/15 to-purple-500/5 border-ut-purple/40 shadow-ut-purple';
                case 'rare': return 'bg-gradient-to-br from-ut-cyan/15 to-cyan-500/5 border-ut-cyan/40 shadow-glow-sm';
                case 'uncommon': return 'bg-gradient-to-br from-ut-green/15 to-green-500/5 border-ut-green/40';
                default: return 'bg-gradient-to-br from-gray-400/10 to-gray-500/5 border-gray-400/30';
              }
            };
            
            return (
              <div 
                key={idx}
                className={`
                  aspect-square rounded-xl flex flex-col items-center justify-center text-center p-2.5
                  border transition-all duration-300 cursor-default hover:scale-105
                  ${getBadgeStyle(badge.rarity)}
                `}
                title={badge.label}
              >
                <badge.icon className="w-6 h-6 mb-1.5" />
                <span className="text-[9px] leading-tight truncate w-full font-medium">{badge.label}</span>
                
                {!badge.unlocked && (
                  <svg className="w-4 h-4 absolute top-1 right-1 text-ut-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ Section Statistiques détaillées - Style UT ═══ */}
      <div className="ut-card p-6 hover:border-ut-cyan/30">
        <h3 className="font-semibold text-base mb-5 flex items-center gap-2 font-heading">
          <Activity className="w-5 h-5 text-ut-cyan" />
          Statistiques détaillées
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Buts', value: user.total_goals, icon: Trophy, color: 'ut-gold', change: '+12%' },
            { label: 'Matchs Joués', value: user.matches_played, icon: Calendar, color: 'ut-cyan', change: null },
            { label: 'Moyenne/Match', value: user.matches_played > 0 ? (user.total_goals / user.matches_played).toFixed(1) : '0.0', icon: Target, color: 'ut-green', change: '+0.3' },
            { label: 'Forme', value: '↑', icon: Flame, color: 'ut-red', change: 'En feu' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-ut-bg/60 border border-ut-border/40 rounded-xl p-4 text-center hover:border-{stat.color}/40 transition-all group/stat">
                <Icon className={`w-6 h-6 mx-auto mb-2 text-${stat.color} group-hover/stat:scale-110 transition-transform`} />
                <p className={`text-2xl font-extrabold font-heading text-${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] text-ut-text-muted mt-1 uppercase tracking-wider">{stat.label}</p>
                {stat.change && (
                  <span className={`text-[9px] font-bold mt-1 inline-block px-1.5 py-0.5 rounded ${
                    stat.change.startsWith('+') ? 'bg-ut-green/10 text-ut-green' : 'bg-ut-cyan/10 text-ut-cyan'
                  }`}>
                    {stat.change}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Helper component for checkmark
function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg className={className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
  );
}
