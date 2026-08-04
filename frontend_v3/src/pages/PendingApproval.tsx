import { useEffect, useMemo } from 'react';
import { Clock, LogOut, ShieldCheck, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function PendingApproval() {
  const { logout, user, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    void refreshUser();

    const interval = window.setInterval(() => {
      void refreshUser();
    }, 4000);

    return () => window.clearInterval(interval);
  }, [refreshUser]);

  const membership = useMemo(() => user?.memberships?.[0], [user]);
  const status = membership?.status?.toLowerCase() ?? 'pending';

  useEffect(() => {
    if (status === 'active') {
      const timeout = window.setTimeout(() => navigate('/dashboard'), 1300);
      return () => window.clearTimeout(timeout);
    }
  }, [status, navigate]);

  const isPending = status === 'pending';
  const isApproved = status === 'active';
  const isRejected = status === 'rejected';

  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(56,189,248,0.2) 0%, transparent 70%)`
          }}
        />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-accentBlue/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 rounded-full bg-accentBlue/20 blur-xl animate-stadium-glow" />
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-accentBlue/10 to-purple-500/10 border border-accentBlue/25 flex items-center justify-center shadow-2xl">
            {isApproved ? (
              <CheckCircle2 className="w-11 h-11 text-accentGreen animate-pulse-slow" />
            ) : isRejected ? (
              <XCircle className="w-11 h-11 text-red-400 animate-pulse-slow" />
            ) : (
              <Clock className="w-11 h-11 text-accentBlue animate-pulse-slow" />
            )}
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accentGold/20 border border-accentGold/30 flex items-center justify-center animate-spin-slow">
            <span className="text-xs">{isApproved ? '✓' : isRejected ? '!' : '⏳'}</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
          {isApproved ? 'Adhésion validée' : isRejected ? 'Demande refusée' : 'Demande envoyée'}
          {user && (
            <span className="bg-gradient-to-r from-accentBlue to-purple-400 bg-clip-text text-transparent">, {user.first_name}</span>
          )}
          !
        </h1>

        <p className="text-textMuted text-base mt-4 max-w-lg mx-auto leading-relaxed">
          {isApproved
            ? 'Ton accès au club vient d’être ouvert. Tu seras redirigé vers le tableau de bord.'
            : isRejected
              ? 'La demande a été refusée par l’admin du club. Tu peux réessayer avec un autre club ou contacter l’organisation.'
              : 'Ton inscription est en attente de validation par l’administrateur du club.'}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3 text-left">
          <div className="p-4 rounded-2xl bg-surface/60 backdrop-blur border border-borderCustom/50">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-textMuted">
              <ShieldCheck className="w-4 h-4 text-accentBlue" />
              Statut
            </div>
            <p className="mt-3 text-sm font-semibold text-white">
              {isApproved ? 'Activé' : isRejected ? 'Refusée' : 'En attente'}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-surface/60 backdrop-blur border border-borderCustom/50">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-textMuted">
              <Loader2 className="w-4 h-4 text-accentBlue" />
              Suivi
            </div>
            <p className="mt-3 text-sm font-semibold text-white">
              {isApproved ? 'Ouvert' : isRejected ? 'A revoir' : 'Validation admin'}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-surface/60 backdrop-blur border border-borderCustom/50">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-textMuted">
              <Clock className="w-4 h-4 text-accentBlue" />
              Attente
            </div>
            <p className="mt-3 text-sm font-semibold text-white">
              {isApproved ? 'Terminé' : isRejected ? 'Terminé' : 'Quelques minutes'}
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-surface/60 backdrop-blur border border-borderCustom/50 text-left max-w-2xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-accentBlue/10 border border-accentBlue/20 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-accentBlue" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Que se passe-t-il maintenant ?</h3>
              <ul className="space-y-2 text-xs text-textMuted">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accentBlue flex-shrink-0" />
                  L’admin reçoit ta demande de rejoindre le club
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accentGreen flex-shrink-0" />
                  Il examine ton profil et valide ou refuse la demande
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                  La page se met à jour automatiquement dès que le statut change
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accentGold flex-shrink-0" />
                  Tu peux alors te connecter au club et accéder au tableau de bord
                </li>
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={() => { logout(); navigate('/'); }}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-textMuted hover:text-white hover:bg-surface rounded-xl border border-transparent hover:border-borderCustom transition-all duration-200 group"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Se déconnecter
        </button>

        <p className="mt-6 text-[10px] text-textMuted/40 uppercase tracking-wider">
          Merci de ta patience
        </p>
      </div>
    </div>
  );
}
