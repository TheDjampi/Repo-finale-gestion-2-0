import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, Mail, Lock, User, Phone, Loader2, Shield, Sparkles, Gamepad2, Trophy, Zap, ArrowRight, ChevronDown } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { PLAYER_POSITIONS } from '../types/api';

export default function Register() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const { login, refreshUser } = useAuth();
  
  const [form, setForm] = useState({ 
    first_name: '', 
    last_name: '', 
    email: '', 
    password: '', 
    position: '', 
    phone: '' 
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [positionOpen, setPositionOpen] = useState(false);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await api.post('/auth/register', {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        position: form.position || null,
        phone: form.phone || null,
      });
      await login(form.email, form.password);
      await api.post(`/clubs/${clubId}/join`);
      await refreshUser();
      navigate('/pending');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Inscription impossible, vérifie tes informations');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-ut-bg text-white flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* ═══ Background Effects - Style UT Immersive ═══ */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(0,212,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.15) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Orbes décoratifs vert/succès (inscription = positif) */}
        <div className="absolute top-1/4 -left-24 w-80 h-80 bg-ut-green/5 rounded-full blur-3xl animate-stadium-glow" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-ut-cyan/5 rounded-full blur-3xl animate-stadium-glow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-56 h-56 bg-ut-purple/5 rounded-full blur-3xl animate-stadium-glow" style={{ animationDelay: '4s' }} />
        
        {/* Particules flottantes */}
        <div className="absolute top-1/3 right-1/4 w-2.5 h-2.5 bg-ut-cyan/30 rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-ut-green/30 rounded-full animate-pulse" style={{ animationDelay: '0.7s' }} />
        <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-ut-gold/20 rounded-full animate-pulse" style={{ animationDelay: '1.4s' }} />
      </div>

      {/* Lien retour */}
      <Link 
        to={`/clubs/${clubId}`} 
        className="relative z-10 absolute top-6 left-6 text-ut-text-secondary hover:text-ut-green flex items-center gap-2 text-xs font-medium transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> 
        Retour
      </Link>

      {/* Card principale - Style Pack Opening UT */}
      <div className="relative z-10 w-full max-w-md">
        {/* Glow effect animé */}
        <div className="absolute -inset-1 bg-gradient-to-r from-ut-green/20 via-ut-cyan/15 to-ut-green/20 rounded-3xl blur-xl opacity-60 animate-stadium-glow" />
        
        <div className="relative glass-effect-strong border border-ut-border rounded-2xl p-8 shadow-2xl shadow-black/40 overflow-hidden">
          
          {/* Décoration coins style UT */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-ut-green/5 rounded-full pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-ut-cyan/5 rounded-full pointer-events-none" />
          
          {/* Pattern subtil */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(0,255,136,0.3) 12px, rgba(0,255,136,0.3) 13px)`
          }} />
          
          {/* Header */}
          <div className="flex flex-col items-center mb-7 text-center relative">
            <div className="relative mb-5">
              {/* Anneau extérieur glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-ut-green to-emerald-500 rounded-2xl blur-lg opacity-30 animate-pulse" />
              
              {/* Icon container */}
              <div className="relative w-16 h-16 bg-ut-green/10 border border-ut-green/25 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(0,255,136,0.2)]">
                <UserPlus className="w-7 h-7 text-ut-green" />
              </div>
              
              {/* Sparkles décoratifs */}
              <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-ut-cyan animate-pulse" />
            </div>
            
            <h1 className="text-2xl font-bold font-heading">Rejoindre le Club</h1>
            <p className="text-xs text-ut-text-secondary mt-2.5 max-w-xs leading-relaxed">
              Ta demande sera soumise à l'admin pour validation
            </p>
            
            {/* Badge info style UT */}
            <div className="inline-flex items-center gap-2 mt-4 text-[11px] font-medium text-ut-cyan/90 bg-ut-cyan/10 px-3 py-1.5 rounded-full border border-ut-cyan/20 backdrop-blur-sm">
              <Zap className="w-3.5 h-3.5" />
              Crée ton profil joueur
              <Gamepad2 className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Formulaire style UT */}
          <form onSubmit={handleSubmit} className="space-y-4.5">
            
            {/* Error alert */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium rounded-xl px-4 py-3.5 flex items-center gap-3 animate-scale-in">
                <Shield className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Nom & Prénom côte à côte */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-[11px] text-ut-text-secondary font-semibold uppercase tracking-wide ml-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-ut-cyan" /> Prénom
                </label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ut-text-muted group-focus-within:text-ut-green transition-colors pointer-events-none" />
                  <input 
                    required placeholder="Prénom" 
                    value={form.first_name} 
                    onChange={(e) => set('first_name', e.target.value)}
                    className="ut-input pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[11px] text-ut-text-secondary font-semibold uppercase tracking-wide ml-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-ut-cyan" /> Nom
                </label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ut-text-muted group-focus-within:text-ut-green transition-colors pointer-events-none" />
                  <input 
                    required placeholder="Nom" 
                    value={form.last_name} 
                    onChange={(e) => set('last_name', e.target.value)}
                    className="ut-input pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-ut-text-secondary font-semibold uppercase tracking-wide ml-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-ut-cyan" /> Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ut-text-muted group-focus-within:text-ut-green transition-colors pointer-events-none" />
                <input 
                  required type="email" 
                  placeholder="ton@email.com" 
                  value={form.email} 
                  onChange={(e) => set('email', e.target.value)}
                  className="ut-input pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-ut-text-secondary font-semibold uppercase tracking-wide ml-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-ut-cyan" /> Mot de passe
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ut-text-muted group-focus-within:text-ut-green transition-colors pointer-events-none" />
                <input 
                  required type={showPassword ? 'text' : 'password'} 
                  minLength={6}
                  placeholder="Minimum 6 caractères" 
                  value={form.password} 
                  onChange={(e) => set('password', e.target.value)}
                  className="ut-input pl-10 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ut-text-muted hover:text-white transition-colors p-0.5"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.868.902a9.97 9.97 0 01-2.523 1.226m0 0a9.97 9.97 0 003.067 0m0 0h.008v-.008zm0 0l.007-.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Poste — dropdown maison (plus de select natif, plus fiable) */}
            <div className="space-y-1.5 relative">
              <label className="text-[11px] text-ut-text-secondary font-semibold uppercase tracking-wide ml-1 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-ut-cyan" /> Poste
              </label>
              <button
                type="button"
                onClick={() => setPositionOpen((v) => !v)}
                className="ut-input flex items-center justify-between text-left cursor-pointer"
              >
                <span className={form.position ? '' : 'text-ut-text-muted'}>
                  {form.position || 'Poste (optionnel)'}
                </span>
                <ChevronDown className={`w-4 h-4 text-ut-text-muted transition-transform ${positionOpen ? 'rotate-180' : ''}`} />
              </button>

              {positionOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setPositionOpen(false)} />
                  <div className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-ut-surface border border-ut-border rounded-xl shadow-2xl max-h-56 overflow-y-auto py-1.5">
                    <button
                      type="button"
                      onClick={() => { set('position', ''); setPositionOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-ut-text-muted hover:bg-ut-surface-light transition-colors"
                    >
                      Poste (optionnel)
                    </button>
                    {PLAYER_POSITIONS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => { set('position', p); setPositionOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-ut-surface-light transition-colors ${form.position === p ? 'text-ut-cyan font-semibold' : 'text-white'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Téléphone */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-ut-text-secondary font-semibold uppercase tracking-wide ml-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-ut-cyan" /> Téléphone
              </label>
              <div className="relative group">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ut-text-muted group-focus-within:text-ut-green transition-colors pointer-events-none" />
                <input 
                  placeholder="+221 XX XXX XX XX" 
                  value={form.phone} 
                  onChange={(e) => set('phone', e.target.value)}
                  className="ut-input pl-10 placeholder:text-ut-text-muted/40"
                />
              </div>
            </div>

            {/* Submit button style UT */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full relative flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold tracking-wide
                transition-all duration-300 overflow-hidden group mt-3
                ${isSubmitting 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-ut-green to-emerald-600 hover:from-ut-green hover:to-emerald-500 ut-text-bg shadow-[0_5_25px_rgba(0,255,136,0.35)] hover:shadow-[0_7_35px_rgba(0,255,136,0.45)] hover:-translate-y-0.5 active:translate-y-0 border border-ut-green/30'
                }
              `}
            >
              {!isSubmitting && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              )}
              
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> 
                  Envoi en cours...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" /> 
                  Envoyer ma demande
                  <Zap className="w-4 h-4 group-hover:animate-pulse" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs text-ut-text-secondary text-center mt-6 pt-5 border-t border-ut-border/30">
            Déjà un compte ?{' '}
            <Link 
              to={`/clubs/${clubId}`} 
              className="text-ut-green font-semibold hover:text-white inline-flex items-center gap-1.5 transition-all group"
            >
              Se connecter ici
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </p>
        </div>
      </div>

      {/* Footer branding */}
      <div className="relative z-10 mt-auto pt-10">
        <div className="flex items-center justify-center gap-3 text-[10px] text-ut-text-muted/35 uppercase tracking-widest">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Powered by</span>
          <span className="font-bold text-ut-text-muted/50">2-0 Platform</span>
          <span>•</span>
          <span>v1.0</span>
        </div>
      </div>
    </div>
  );
}