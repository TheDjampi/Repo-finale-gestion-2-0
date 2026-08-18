import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
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
    <div className="min-h-screen bg-background text-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-surface/95 border border-borderCustom rounded-2xl p-8 shadow-2xl shadow-black/30">
        <h1 className="text-2xl font-bold text-center">Connexion</h1>
        <p className="text-sm text-textMuted text-center mt-2 mb-6">Accède à ton dashboard joueur</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[11px] text-textMuted font-semibold uppercase tracking-wide ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="ton@email.com"
                className="w-full bg-background border border-borderCustom rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-accentBlue focus:ring-2 focus:ring-accentBlue/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] text-textMuted font-semibold uppercase tracking-wide ml-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full bg-background border border-borderCustom rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-accentBlue focus:ring-2 focus:ring-accentBlue/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-accentBlue to-blue-600 text-background disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-xs text-textMuted text-center mt-5">
          Pas encore de session club ? <Link to="/" className="text-accentBlue hover:underline">Choisir un club</Link>
        </p>
      </div>
    </div>
  );
}
