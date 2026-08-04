import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Trophy, Newspaper, Swords, Calendar, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../lib/api';
import type { ClubList } from '../types/api';
import PublicNavbar from '../components/PublicNavbar';

interface ChallengeHistoryItem {
  id: number;
  challenger_club_name: string;
  target_club_name: string;
  proposed_date: string;
}

export default function ClubSelect() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const { data: clubs, isLoading } = useQuery({
    queryKey: ['clubs'],
    queryFn: async () => (await api.get<ClubList[]>('/clubs/')).data,
  });

  const { data: history } = useQuery({
    queryKey: ['challenge-history'],
    queryFn: async () => (await api.get<ChallengeHistoryItem[]>('/challenges/history')).data,
  });

  const totalPlayers = clubs?.reduce((acc, c) => acc + c.member_count, 0) ?? 0;
  const recentClubs = [...(clubs ?? [])]
    .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  return (
    <>
      <PublicNavbar />

      {/* ═══ HERO ═══ */}
      <section className="relative bg-stadium overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.06]" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold font-heading gradient-text-cyan leading-tight">
            L'univers des 2-0
          </h1>
          <p className="text-ut-text-secondary text-sm sm:text-base mt-5 max-w-xl mx-auto">
            Suis les clubs, les joueurs et les confrontations de la scène amateur 2-0 —
            statistiques, compositions et cotisations, tout au même endroit.
          </p>
          <button
            onClick={() => navigate('/clubs/inscription')}
            className="ut-button-primary animate-glow-pulse inline-flex items-center gap-2 mt-9"
          >
            Inscrire mon club <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">

        {/* ═══ STATS (chevauchement sur le hero) ═══ */}
        <div className="relative z-10 -mt-10 sm:-mt-16 grid grid-cols-2 gap-4 sm:gap-6 max-w-xl mx-auto">
          <div className="ut-card-silver flex items-center gap-3 p-5">
            <Users className="w-7 h-7 text-ut-cyan shrink-0" />
            <div>
              <p className="text-xl font-extrabold font-heading">{totalPlayers}</p>
              <p className="text-[11px] text-ut-text-muted">joueurs</p>
            </div>
          </div>
          <div className="ut-card-silver flex items-center gap-3 p-5">
            <Shield className="w-7 h-7 text-ut-green shrink-0" />
            <div>
              <p className="text-xl font-extrabold font-heading">{clubs?.length ?? 0}</p>
              <p className="text-[11px] text-ut-text-muted">clubs actifs</p>
            </div>
          </div>
        </div>

        {/* ═══ CARROUSEL 3D HORIZONTAL DES CLUBS ═══ */}
        <div className="mt-16">
          <h2 className="text-lg font-bold font-heading mb-6">Clubs enregistrés</h2>

          {isLoading && <p className="text-sm text-ut-text-muted">Chargement...</p>}

          {!isLoading && clubs && clubs.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="relative w-full h-96 flex items-center justify-center" style={{ perspective: '1400px' }}>
                <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
                  {clubs.map((club, i) => {
                    const count = clubs.length;
                    let diff = i - active;
                    if (diff > count / 2) diff -= count;
                    if (diff < -count / 2) diff += count;
                    const isActive = diff === 0;

                    return (
                      <div
                        key={club.id}
                        onClick={() => (isActive ? navigate(`/clubs/${club.id}/vitrine`) : setActive(i))}
                        className="absolute top-1/2 left-1/2 w-64 -mt-44 -ml-32 cursor-pointer transition-all duration-500 ease-out"
                        style={{
                          transform: `translateX(${diff * 230}px) translateZ(${isActive ? 0 : -220}px) scale(${isActive ? 1 : 0.82})`,
                          opacity: Math.abs(diff) > 2 ? 0 : 1 - Math.abs(diff) * 0.3,
                          pointerEvents: Math.abs(diff) > 2 ? 'none' : 'auto',
                          zIndex: 10 - Math.abs(diff),
                        }}
                      >
                        <div className="ut-card-cyan flex flex-col items-center text-center p-6">
                          <div className="w-16 h-16 rounded-2xl bg-ut-cyan/10 border border-ut-cyan/25 flex items-center justify-center mb-4">
                            {club.logo_url ? (
                              <img src={club.logo_url} alt="" className="w-full h-full rounded-2xl object-cover" />
                            ) : (
                              <Shield className="w-8 h-8 text-ut-cyan" />
                            )}
                          </div>
                          <p className="font-bold font-heading">{club.name}</p>
                          {club.motto && <p className="text-xs text-ut-text-muted italic mt-1">"{club.motto}"</p>}

                          <div className="flex items-center gap-2 mt-4">
                            <span className="ut-badge-cyan">{club.member_count} membre{club.member_count > 1 ? 's' : ''}</span>
                            <span className="ut-badge-green flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Actif
                            </span>
                          </div>

                          {isActive && (
                            <button
                              onClick={(e) => { e.stopPropagation(); navigate(`/clubs/${club.id}/vitrine`); }}
                              className="ut-button-primary mt-auto pt-4 w-full justify-center"
                            >
                              Cliquer pour entrer <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {clubs.length > 1 && (
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => setActive((a) => (a - 1 + clubs.length) % clubs.length)}
                    className="w-9 h-9 rounded-lg bg-ut-surface border border-ut-border flex items-center justify-center hover:border-ut-cyan/50 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActive((a) => (a + 1) % clubs.length)}
                    className="w-9 h-9 rounded-lg bg-ut-surface border border-ut-border flex items-center justify-center hover:border-ut-cyan/50 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {!isLoading && clubs?.length === 0 && (
            <p className="text-sm text-ut-text-muted">Aucun club enregistré pour l'instant.</p>
          )}
        </div>

        {/* ═══ ACTUALITÉS + HISTORIQUE ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-16 mb-20">

          {/* Section A — Actualités */}
          <div id="actualites" className="scroll-mt-20">
            <h2 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
              <Newspaper className="w-4.5 h-4.5 text-ut-cyan" /> Dernières Actualités
            </h2>
            <div className="space-y-3">
              {recentClubs.length > 0 ? recentClubs.map((c: any) => (
                <div key={c.id} className="ut-card hover-lift flex items-center gap-3 p-4">
                  <div className="w-9 h-9 rounded-lg bg-ut-cyan/10 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4 text-ut-cyan" />
                  </div>
                  <p className="text-xs text-ut-text-secondary">
                    <span className="font-semibold text-white">{c.name}</span> a rejoint Mon 2-0
                  </p>
                  <Calendar className="w-3.5 h-3.5 text-ut-text-muted ml-auto shrink-0" />
                </div>
              )) : (
                <p className="text-xs text-ut-text-muted">Aucune actualité pour l'instant.</p>
              )}
            </div>
          </div>

          {/* Section B — Historique inter-2-0 */}
          <div id="historique" className="scroll-mt-20">
            <h2 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
              <Swords className="w-4.5 h-4.5 text-ut-purple" /> Historique Inter-2-0
            </h2>
            <div className="ut-card-legendary p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-ut-purple/10 border border-ut-purple/25 flex items-center justify-center shrink-0">
                  <Trophy className="w-7 h-7 text-ut-gold" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold font-heading">{history?.length ?? 0}</p>
                  <p className="text-xs text-ut-text-muted">confrontations enregistrées</p>
                </div>
              </div>

              {history && history.length > 0 && (
                <div className="mt-5 pt-5 border-t border-ut-border/50 text-xs text-ut-text-secondary">
                  Dernière en date : <span className="font-semibold text-white">{history[0].challenger_club_name}</span>
                  {' '}vs{' '}<span className="font-semibold text-white">{history[0].target_club_name}</span>
                </div>
              )}

              <button
                onClick={() => navigate('/historique')}
                className="mt-5 text-xs font-semibold text-ut-cyan hover:underline flex items-center gap-1"
              >
                Voir le palmarès complet <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}