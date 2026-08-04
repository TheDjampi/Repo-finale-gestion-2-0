import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, XCircle, ShieldAlert, UserPlus, Clock, Users, AlertTriangle, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

interface PendingPlayer {
  membership_id: number;
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  position: string | null;
}

export default function AdminPanel() {
  const queryClient = useQueryClient();

  const { data: pending, isLoading } = useQuery({
    queryKey: ['pending-players'],
    queryFn: async () => (await api.get<PendingPlayer[]>('/admin/pending-players')).data,
  });

  const validate = useMutation({
    mutationFn: async ({ membershipId, action }: { membershipId: number; action: 'approve' | 'reject' }) =>
      api.post(`/admin/validate/${membershipId}?action=${action}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pending-players'] }),
  });

  return (
    <div className="space-y-6 opacity-0 animate-pitch-entry">
      
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
            <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/10 border border-orange-500/30 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-orange-400" />
            </span>
            Panneau Admin
          </h1>
          <p className="text-textMuted text-xs mt-2">Validez ou refusez les demandes d'inscription.</p>
        </div>

        {/* Compteur de demandes en attente */}
        {!isLoading && pending && pending.length > 0 && (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-sm font-medium text-red-400">
            <AlertTriangle className="w-4 h-4" />
            {pending.length} demande{pending.length > 1 ? 's' : ''} en attente
          </span>
        )}
      </div>

      {/* ═══ Loading State ═══ */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-borderCustom/30 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-orange-500 rounded-full animate-spin" />
          </div>
          <p className="text-textMuted text-sm font-medium">Chargement des demandes...</p>
        </div>
      )}

      {/* ═══ Liste des demandes ═══ */}
      {!isLoading && pending && pending.length > 0 && (
        <div className="bg-surface border border-borderCustom rounded-2xl overflow-hidden divide-y divide-borderCustom/40">
          
          {/* Header du tableau */}
          <div className="hidden sm:grid grid-cols-[1fr_80px_120px] gap-4 px-5 py-3 bg-background/50 text-[11px] uppercase tracking-wider text-textMuted font-semibold border-b border-borderCustom/40">
            <span>Joueur</span>
            <span className="text-center">Poste</span>
            <span className="text-center">Actions</span>
          </div>

          {/* Rows */}
          {pending.map((p: PendingPlayer) => (
            <div 
              key={p.id} 
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 gap-4 hover:bg-background/30 transition-colors duration-200 group"
            >
              
              {/* Info joueur */}
              <div className="flex items-center gap-3 min-w-0 sm:flex-1">
                {/* Avatar initials */}
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accentBlue/10 to-purple-500/10 border border-accentBlue/25 flex items-center justify-center text-accentBlue font-bold text-sm shrink-0 group-hover:scale-110 transition-transform">
                  {(p.first_name?.[0] || '')}{(p.last_name?.[0] || '')}
                </div>
                
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate group-hover:text-accentBlue transition-colors">
                    {p.first_name} {p.last_name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-textMuted truncate">{p.email}</p>
                    {p.position && (
                      <>
                        <span className="text-borderCustom">·</span>
                        <span className="text-xs text-textMuted">{p.position}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Poste (desktop only) */}
              <div className="hidden sm:flex items-center justify-center">
                {p.position ? (
                  <span className="px-3 py-1.5 rounded-lg bg-background border border-borderCustom text-xs font-medium text-textMuted">
                    {p.position}
                  </span>
                ) : (
                  <span className="text-xs text-textMuted/50 italic">Non défini</span>
                )}
              </div>

              {/* Boutons d'action */}
              <div className="flex items-center gap-2 sm:flex-shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => validate.mutate({ membershipId: p.membership_id, action: 'approve' })}
                  disabled={validate.isPending}
                  className={`
                    flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 
                    rounded-xl text-xs font-semibold transition-all duration-200 group
                    ${validate.isPending
                      ? 'bg-green-500/20 cursor-not-allowed text-green-400/60'
                      : 'bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 hover:text-green-300 hover:border-green-500/50 active:scale-95'
                    }
                  `}
                >
                  {validate.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Valider
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => validate.mutate({ membershipId: p.membership_id, action: 'reject' })}
                  disabled={validate.isPending}
                  className={`
                    flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 
                    rounded-xl text-xs font-semibold transition-all duration-200 group
                    ${validate.isPending
                      ? 'bg-red-500/20 cursor-not-allowed text-red-400/60'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50 active:scale-95'
                    }
                  `}
                >
                  {validate.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" /> Refuser
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══ Empty State ═══ */}
      {!isLoading && pending && pending.length === 0 && (
        <div className="bg-surface border border-dashed border-borderCustom rounded-2xl p-12 text-center max-w-md mx-auto">
          
          {/* Icône décorative animée */}
          <div className="relative w-20 h-20 mx-auto mb-5">
            <div className="absolute inset-0 bg-green-500/10 rounded-full animate-pulse" />
            <div className="relative w-full h-full rounded-2xl bg-surface border border-borderCustom flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <h3 className="font-semibold text-white text-lg mb-2">Tout est en ordre !</h3>
          <p className="text-sm text-textMuted max-w-xs mx-auto">
            Aucune nouvelle demande en attente. Tous les joueurs ont été traités.
          </p>

          {/* Stats optionnelles */}
          <div className="mt-6 pt-5 border-t border-borderCustom/30 flex items-center justify-center gap-6 text-xs text-textMuted">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-accentBlue" />
              <span>Tous validés</span>
            </div>
            <div className="w-px h-4 bg-borderCustom/30" />
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-accentGreen" />
              <span>À jour</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
