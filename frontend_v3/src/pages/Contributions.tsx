import { useQuery } from '@tanstack/react-query';
import { Wallet, TrendingUp, Users, ArrowRight, CheckCircle2, Clock, Zap, Target, Trophy, Gamepad2, Coins, AlertTriangle } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { ContributionResponse } from '../types/api';

export default function Contributions() {
  const { user } = useAuth();
  const clubId = user?.memberships?.[0]?.club_id ?? 1;

  const { data: contributions, isLoading } = useQuery({
    queryKey: ['contributions', clubId],
    queryFn: async () => (await api.get<ContributionResponse[]>(`/contributions/club/${clubId}`)).data,
  });

  return (
    <div className="space-y-6 opacity-0 animate-pitch-entry">
      
      {/* ═══ Header - Style UT ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-4 font-heading">
            <span className="w-14 h-14 rounded-xl bg-gradient-to-br from-ut-green/20 to-emerald-500/10 border border-ut-green/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.2)]">
              <Wallet className="w-7 h-7 text-ut-green" />
            </span>
            Cotisations du Club
          </h1>
          <p className="text-ut-text-secondary text-sm mt-2">Suivez l'avancement des collectes en cours.</p>
        </div>

        {/* Stats globales style UT */}
        {!isLoading && contributions && contributions.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-4 py-2 rounded-xl ut-surface border border-ut-border text-xs font-medium flex items-center gap-2">
              <Wallet className="w-4 h-4 text-ut-green" />
              <span className="text-ut-text-secondary">Actives:</span> 
              <span className="font-bold text-white font-heading">{contributions.length}</span>
            </span>
            <span className="px-4 py-2 rounded-xl ut-surface border border-ut-border text-xs font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-ut-cyan" />
              <span className="text-ut-text-secondary">Moyenne:</span> 
              <span className="font-bold text-ut-cyan font-heading">{Math.round(contributions.reduce((acc, c) => acc + c.progress_percentage, 0) / contributions.length)}%</span>
            </span>
          </div>
        )}
      </div>

      {/* ═══ Loading State - Style UT ═══ */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-5">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-ut-border/30 rounded-full" />
            <div className="absolute inset-0 border-4 transparent border-t-ut-green rounded-full animate-spin" style={{ boxShadow: '0 0 25px rgba(0,255,136,0.3)' }} />
            <Coins className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-ut-green" />
          </div>
          <p className="text-ut-text-secondary text-sm font-medium">Chargement des cotisations...</p>
          
          {/* Skeleton cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-5xl mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="ut-card p-6 h-48 skeleton" />
            ))}
          </div>
        </div>
      )}

      {/* ═══ Grid des Contributions - Style Cards Objectifs UT ═══ */}
      {!isLoading && (contributions?.length ?? 0) > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {contributions!.map((c, index) => (
            <div 
              key={c.id} 
              className={`group ut-card overflow-hidden hover:-translate-y-1 opacity-0 animate-pitch-entry`}
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              
              {/* Header de la card style UT */}
              <div className="flex items-start justify-between mb-5 p-5 pb-0">
                <div className="flex-1 min-w-0 pr-3">
                  <h3 className="font-semibold text-sm truncate group-hover:text-ut-cyan transition-colors font-heading">{c.title}</h3>
                  {c.description && (
                    <p className="text-xs text-ut-text-secondary mt-1.5 line-clamp-2 leading-relaxed">{c.description}</p>
                  )}
                </div>
                
                {/* Icône wallet avec glow */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ut-cyan/15 to-purple-500/10 border border-ut-cyan/25 flex items-center justify-center flex-shrink-0 group-hover:bg-ut-cyan/20 group-hover:scale-110 group-hover:border-ut-cyan/50 transition-all duration-300 shadow-glow-sm">
                  <Wallet className="w-6 h-6 text-ut-cyan" />
                </div>
              </div>

              {/* Progress bar principale style UT */}
              <div className="px-5 mb-4">
                <div className="relative w-full h-3 ut-bg rounded-full overflow-hidden border border-ut-border/40">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out relative"
                    style={{ 
                      width: `${Math.min(c.progress_percentage, 100)}%`,
                      background: c.progress_percentage >= 100 
                        ? 'linear-gradient(90deg, #00FF88, #059669)' 
                        : 'linear-gradient(90deg, #00D4FF, #A855F7)',
                      boxShadow: c.progress_percentage >= 100 
                        ? '0 0 15px rgba(0,255,136,0.4)' 
                        : '0 0 15px rgba(0,212,255,0.4)'
                    }}
                  >
                    {/* Glow effect sur la barre */}
                    <div className="absolute inset-0 bg-white/20 blur-sm" />
                    
                    {/* Shine effect animé */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    
                    {/* Animated particles on progress */}
                    {c.progress_percentage >= 100 && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white animate-pulse" />
                    )}
                  </div>
                </div>
              </div>

              {/* Info sous la barre */}
              <div className="px-5 flex items-center justify-between text-xs mb-4">
                <span className={`font-bold font-heading ${c.progress_percentage >= 100 ? 'text-ut-green' : 'text-ut-cyan'}`}>
                  {Math.round(c.progress_percentage)}%
                  {c.progress_percentage >= 100 && (
                    <CheckCircle2 className="inline w-4 h-4 ml-1.5 animate-bounce-in" />
                  )}
                </span>
                <span className="text-ut-text-secondary">
                  <span className="font-semibold text-white/90 font-heading">{c.amount_collected}€</span>
                  <span className="mx-1.5 text-ut-border">/</span>
                  <span>{c.amount_total}€</span>
                </span>
              </div>

              {/* Participants + Status */}
              <div className="px-5 pb-4 pt-3 border-t border-ut-border/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] text-ut-text-secondary">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">{c.participant_count} participant{c.participant_count > 1 ? 's' : ''}</span>
                </div>
                
                {/* Badge status style UT */}
                <span className={`
                  px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                  ${c.status === 'completed' ? 'bg-ut-green/10 text-ut-green border border-ut-green/25 shadow-[0_0_10px_rgba(0,255,136,0.15)]' :
                    c.status === 'active' ? 'bg-ut-cyan/10 text-ut-cyan border border-ut-cyan/25' :
                    c.status === 'overdue' ? 'bg-ut-red/10 text-ut-red border border-ut-red/25' :
                    'bg-gray-500/10 text-gray-400 border border-gray-500/25'
                  }
                `}>
                  {c.status === 'completed' ? (
                    <><CheckCircle2 className="inline w-3 h-3 mr-1" /> Terminé</>
                  ) : c.status === 'active' ? (
                    <><span className="inline-block w-1.5 h-1.5 rounded-full bg-ut-cyan mr-1.5 animate-pulse" /> En cours</>
                  ) : c.status === 'overdue' ? (
                    <><AlertTriangle className="w-3 h-3 inline mr-1" />Retard</>
                  ) : (
                    c.status
                  )}
                </span>
              </div>

              {/* CTA optionnel si pas terminé */}
              {c.status !== 'completed' && (
                <button className="mx-5 mb-5 ut-button-primary group/btn">
                  <Zap className="w-4 h-4 group-hover/btn:animate-pulse" />
                  Contribuer
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ═══ Empty State - Style UT ═══ */}
      {!isLoading && contributions?.length === 0 && (
        <div className="ut-card border-dashed p-16 text-center max-w-md mx-auto">
          <div className="w-22 h-22 mx-auto mb-6 rounded-2xl ut-bg border border-ut-border flex items-center justify-center">
            <Wallet className="w-11 h-11 text-ut-text-muted/40" />
          </div>
          <h3 className="font-bold text-white text-xl mb-3 font-heading">Aucune cotisation en cours</h3>
          <p className="text-sm text-ut-text-secondary leading-relaxed">
            Aucune contribution active pour ce club actuellement.
          </p>
          
          {/* Décoration */}
          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-ut-text-muted/40 uppercase tracking-widest">
            <Gamepad2 className="w-3 h-3" />
            <span>Vide pour le moment</span>
          </div>
        </div>
      )}
    </div>
  );
}
