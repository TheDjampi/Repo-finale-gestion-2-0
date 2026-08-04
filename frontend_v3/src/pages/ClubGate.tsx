import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Mail, Lock, LogIn, Shield, ArrowLeft, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { ClubList } from '../types/api';

export default function ClubGate() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: club } = useQuery({
    queryKey: ['club', clubId],
    queryFn: async () => (await api.get<ClubList>(`/clubs/${clubId}`)).data,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Email ou mot de passe incorrect');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* ═══ Background Effects ═══ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gradient radial basé sur la couleur du club si disponible */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(ellipse at center, ${club?.primary_color || '#38BDF8'}15 0%, transparent 70%)`
          }}
        />
        
        {/* Grid subtil */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Orbe décoratif */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-accentBlue/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Lien retour */}
      <Link 
        to="/" 
        className="relative z-10 top-6 left-6 absolute text-textMuted hover:text-accentBlue flex items-center gap-1.5 text-xs font-medium transition-colors group"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" /> 
        Changer de club
      </Link>

      {/* Card principale */}
      <div className="relative z-10 w-full max-w-md">
        {/* Glow effect behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-accentBlue/20 via-purple-500/20 to-accentBlue/20 rounded-3xl blur-xl opacity-50" />
        
        <div className="relative bg-surface/95 backdrop-blur-xl border border-borderCustom rounded-2xl p-8 shadow-2xl shadow-black/30 overflow-hidden">
          
          {/* Décoration coin supérieur */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accentBlue/5 to-transparent rounded-bl-full pointer-events-none" />
          
          {/* Header du card */}
          <div className="flex flex-col items-center mb-8 text-center relative">
            {/* Icône shield avec animation */}
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-accentBlue to-purple-500 rounded-2xl blur-lg opacity-40 animate-pulse" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-accentBlue/10 to-purple-500/10 border border-accentBlue/25 rounded-2xl flex items-center justify-center">
                <Shield className={`w-7 h-7 ${club?.primary_color ? '' : 'text-accentBlue'}`} 
                  style={{ color: club?.primary_color || '#38BDF8' }} 
                />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold tracking-tight">{club?.name ?? '...'}</h1>
            {club?.motto && (
              <p className="text-sm text-textMuted italic mt-2 max-w-xs">"{club.motto}"</p>
            )}
            
            {/* Séparateur décoratif */}
            <div className="flex items-center gap-3 mt-4">
              <div className="h-px flex-1 bg-borderCustom/50" />
              <div className="w-2 h-2 rounded-full bg-accentBlue/50" />
              <div className="h-px flex-1 bg-borderCustom/50" />
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Error message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium rounded-xl px-4 py-3 flex items-center gap-2 animate-shake">
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">!</div>
                {error}
              </div>
            )}

            {/* Input Email */}
            <div className="space-y-2">
              <label className="text-[11px] text-textMuted font-semibold uppercase tracking-wide ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted group-focus-within:text-accentBlue transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton@email.com"
                  className="w-full bg-background border border-borderCustom rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-accentBlue focus:ring-2 focus:ring-accentBlue/20 transition-all placeholder:text-textMuted/50"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <label className="text-[11px] text-textMuted font-semibold uppercase tracking-wide ml-1">Mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted group-focus-within:text-accentBlue transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-background border border-borderCustom rounded-xl pl-11 pr-12 py-3.5 text-sm focus:outline-none focus:border-accentBlue focus:ring-2 focus:ring-accentBlue/20 transition-all placeholder:text-textMuted/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-textMuted hover:text-white transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Bouton submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full relative flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold tracking-wide
                transition-all duration-300 overflow-hidden group
                ${isSubmitting 
                  ? 'bg-accentBlue/50 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-accentBlue to-blue-600 hover:from-accentBlue hover:to-blue-500 text-background shadow-[0_4px_20px_rgba(56,189,248,0.3)] hover:shadow-[0_6px_25px_rgba(56,189,248,0.4)] hover:-translate-y-0.5 active:translate-y-0'
                }
              `}
            >
              {/* Shimmer effect au hover */}
              {!isSubmitting && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              )}
              
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> 
                  Connexion...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> 
                  Se connecter
                </>
              )}
            </button>
          </form>

          {/* Lien vers register */}
          <p className="text-xs text-textMuted text-center mt-6 pt-5 border-t border-borderCustom/30">
            Pas encore membre ?{' '}
            <Link 
              to={`/clubs/${clubId}/register`} 
              className="text-accentBlue font-semibold hover:text-white hover:underline inline-flex items-center gap-1 transition-all"
            >
              Rejoindre ce club
              <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
