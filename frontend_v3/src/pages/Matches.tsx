import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MatchCard } from '../components/MatchCard';
import type { MatchResponse } from '../types/api';
import { Layers, CalendarCheck, History, Filter, Search, Trophy, Flame, Clock, Gamepad2 } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type TabType = 'all' | 'scheduled' | 'finished';

const TABS: { id: TabType; label: string; icon: typeof Layers; color: string; bgColor: string }[] = [
  { id: 'all', label: 'Tous', icon: Layers, color: '', bgColor: '' },
  { id: 'scheduled', label: 'À venir', icon: CalendarCheck, color: 'text-ut-cyan', bgColor: 'bg-ut-cyan/10' },
  { id: 'finished', label: 'Résultats', icon: History, color: 'text-ut-text-muted', bgColor: '' },
];

export default function Matches() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  const clubId = user?.memberships?.[0]?.club_id ?? 1;

  const { data: matches, isLoading, isError } = useQuery({
    queryKey: ['matches', clubId],
    queryFn: async () => {
      const { data } = await api.get<MatchResponse[]>(`/matches/club/${clubId}`);
      return data;
    },
  });

  const filteredMatches = useMemo<MatchResponse[]>(() => {
    if (!matches) return [];
    let result = matches.filter((match) => {
      if (activeTab === 'scheduled') return match.status === 'scheduled' || match.status === 'live';
      if (activeTab === 'finished') return match.status === 'finished';
      return true;
    });
    
    // Filtre par recherche
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.location?.toLowerCase().includes(q) ||
        m.lineups.some(l => l.player_name?.toLowerCase().includes(q))
      );
    }
    
    return result;
  }, [matches, activeTab, searchQuery]);

  // Stats rapides style UT
  const stats = useMemo(() => {
    if (!matches) return { total: 0, upcoming: 0, finished: 0, live: 0 };
    return {
      total: matches.length,
      upcoming: matches.filter(m => m.status === 'scheduled').length,
      finished: matches.filter(m => m.status === 'finished').length,
      live: matches.filter(m => m.status === 'live').length,
    };
  }, [matches]);

  return (
    <div className="space-y-6 opacity-0 animate-pitch-entry">
      
      {/* ═══ Header - Style UT ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-4 font-heading">
            <span className="w-13 h-13 rounded-xl bg-gradient-to-br from-ut-cyan/20 to-cyan-500/10 border border-ut-cyan/30 flex items-center justify-center shadow-glow-sm">
              <CalendarCheck className="w-6 h-6 text-ut-cyan" />
            </span>
            Matchs & Calendrier
          </h1>
          <p className="text-ut-text-secondary text-sm mt-2">Suivez les feuilles de match officielles et les confrontations programmées.</p>
        </div>

        {/* Stats pills style UT */}
        {!isLoading && (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-4 py-2 rounded-xl bg-ut-surface border border-ut-border text-xs font-medium flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-ut-text-muted" />
              <span className="text-ut-text-muted">Total:</span> 
              <span className="font-bold text-white font-heading">{stats.total}</span>
            </span>
            
            {stats.live > 0 && (
              <span className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/35 text-xs font-medium text-red-400 animate-live-pulse flex items-center gap-2">
                <Flame className="w-3.5 h-3.5" />
                {stats.live} LIVE
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ut-red opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-ut-red"></span>
                </span>
              </span>
            )}
            
            {stats.finished > 0 && (
              <span className="px-4 py-2 rounded-xl bg-ut-surface border border-ut-border text-xs font-medium flex items-center gap-2">
                <Trophy className="w-3.5 h-3.5 text-ut-gold" />
                <span className="text-ut-text-muted">Terminés:</span>
                <span className="font-bold text-ut-gold font-heading">{stats.finished}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ═══ Barre d'outils : Tabs + Recherche - Style UT ═══ */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        
        {/* Tabs stylisés style UT gaming */}
        <div className="bg-ut-surface/80 border border-ut-border/60 backdrop-blur-md p-1.5 rounded-xl flex gap-1 self-start">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count = tab.id === 'all' ? stats.total : tab.id === 'scheduled' ? stats.upcoming + stats.live : stats.finished;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold 
                  transition-all duration-300 hover:scale-[1.02] overflow-hidden
                  ${isActive
                    ? `bg-ut-bg ${tab.color} border border-ut-border shadow-[0_0_15px_rgba(0,212,255,0.12)]`
                    : 'text-ut-text-secondary hover:text-white hover:bg-ut-bg/50'
                  }
                `}
              >
                {isActive && (
                  <div className={`absolute inset-0 ${tab.bgColor || 'bg-ut-cyan/5'} translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500`} />
                )}
                <Icon className={`w-4 h-4 ${isActive ? tab.color : ''}`} /> 
                {tab.label}
                {count > 0 && (
                  <span className={`ml-1 min-w-[20px] text-center px-1.5 py-0.5 rounded-md text-[10px] font-bold font-heading ${
                    isActive ? `${tab.bgColor || 'bg-ut-cyan/20'} ${tab.color || 'text-ut-cyan'}` : 'bg-ut-bg text-ut-text-muted'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Champ recherche style UT */}
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ut-text-muted" />
          <input
            type="text"
            placeholder="Rechercher un match..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ut-input w-full sm:w-72 pl-10 pr-4 py-2.5 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* ═══ Loading State - Style UT ═══ */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-5">
          {/* Spinner stylisé UT */}
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-ut-border/30 rounded-full" />
            <div className="absolute inset-0 border-4 transparent border-t-ut-cyan rounded-full animate-spin" style={{ boxShadow: '0 0 20px rgba(0,212,255,0.3)' }} />
            <div className="absolute inset-2 border-4 transparent border-t-ut-green rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s', boxShadow: '0 0 15px rgba(0,255,136,0.3)' }} />
            <Gamepad2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-ut-cyan" />
          </div>
          <p className="text-ut-text-secondary text-sm font-medium">Chargement des matchs...</p>
          
          {/* Loading skeleton cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-4xl mt-4">
            {[1, 2].map((i) => (
              <div key={i} className="ut-card p-6 h-48 skeleton" />
            ))}
          </div>
        </div>
      )}

      {/* ═══ Error State ═══ */}
      {isError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium rounded-2xl p-6 text-center max-w-md mx-auto ut-card">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-center">
            <Filter className="w-6 h-6" />
          </div>
          Impossible de charger les matchs. Vérifie que le backend tourne bien.
        </div>
      )}

      {/* ═══ Grid des MatchCards ═══ */}
      {!isLoading && !isError && filteredMatches.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMatches.map((match, index) => (
            <div 
              key={match.id} 
              className="opacity-0 animate-pitch-entry"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <MatchCard match={match} />
            </div>
          ))}
        </div>
      )}

      {/* ═══ Empty State - Style UT ═══ */}
      {!isLoading && !isError && filteredMatches.length === 0 && (
        <div className="ut-card border-dashed p-14 text-center max-w-lg mx-auto mt-6">
          
          {/* Icône décorative */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-ut-bg border border-ut-border flex items-center justify-center">
            {searchQuery ? (
              <Search className="w-11 h-11 text-ut-text-muted/40" />
            ) : (
              <CalendarCheck className="w-11 h-11 text-ut-text-muted/40" />
            )}
          </div>
          
          <h3 className="font-bold text-white text-xl mb-3 font-heading">
            {searchQuery ? 'Aucun résultat trouvé' : 'Aucun match trouvé'}
          </h3>
          <p className="text-sm text-ut-text-secondary max-w-xs mx-auto leading-relaxed">
            {searchQuery 
              ? `Aucun match ne correspond à "${searchQuery}" pour ce filtre.`
              : 'Aucune rencontre ne correspond au filtre de sélection actuel.'
            }
          </p>
          
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-5 text-xs text-ut-cyan hover:text-white font-semibold flex items-center gap-1.5 mx-auto transition-colors group"
            >
              Effacer la recherche
              <svg className="w-4 h-4 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
          
          {/* Décoration */}
          <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-ut-text-muted/40 uppercase tracking-widest">
            <Gamepad2 className="w-3 h-3" />
            <span>2-0 Platform</span>
          </div>
        </div>
      )}
    </div>
  );
}
