import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Target, Handshake, TrendingUp, Crown, Medal, Award, Star, Users, ChevronUp, ChevronDown, Minus, Flame, Gamepad2 } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { LeaderboardEntry } from '../types/api';

type TabType = 'buteurs' | 'passeurs' | 'forme';

const TABS: { id: TabType; label: string; icon: typeof Target; color: string; bgColor: string }[] = [
  { id: 'buteurs', label: 'Buteurs', icon: Target, color: 'text-ut-cyan', bgColor: 'bg-ut-cyan/10' },
  { id: 'passeurs', label: 'Passeurs', icon: Handshake, color: 'text-ut-green', bgColor: 'bg-ut-green/10' },
  { id: 'forme', label: 'Forme', icon: TrendingUp, color: 'text-ut-gold', bgColor: 'bg-ut-gold/10' },
];

// Styles du podium style FIFA UT
const PODIUM_STYLES = [
  { 
    rank: 1, 
    icon: Crown, 
    gradient: 'from-ut-gold via-yellow-400 to-ut-gold',
    textColor: 'text-ut-gold',
    bgGradient: 'from-ut-gold/15 to-amber-500/5',
    borderColor: 'border-ut-gold/40',
    glow: 'shadow-[0_0_40px_rgba(255,215,0,0.25)]',
    badge: null,
    order: 'order-2 sm:-translate-y-4',
    scale: 'scale-110'
  },
  { 
    rank: 2, 
    icon: Medal, 
    gradient: 'from-gray-300 to-gray-400',
    textColor: 'text-gray-300',
    bgGradient: 'from-gray-400/10 to-gray-500/5',
    borderColor: 'border-gray-400/30',
    glow: 'shadow-[0_0_25px_rgba(156,163,184,0.15)]',
    badge: null,
    order: 'order-1',
    scale: ''
  },
  { 
    rank: 3, 
    icon: Award, 
    gradient: 'from-orange-400 to-orange-600',
    textColor: 'text-orange-400',
    bgGradient: 'from-orange-500/10 to-orange-600/5',
    borderColor: 'border-orange-500/30',
    glow: 'shadow-[0_0_25px_rgba(249,115,22,0.15)]',
    badge: null,
    order: 'order-3',
    scale: ''
  },
];

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState<TabType>('buteurs');
  const { user } = useAuth();
  const clubId = user?.memberships?.[0]?.club_id ?? 1;

  const { data: entries, isLoading } = useQuery({
    queryKey: ['leaderboard', clubId],
    queryFn: async () => (await api.get<LeaderboardEntry[]>(`/stats/leaderboard/club/${clubId}`)).data,
  });

  const sorted = useMemo<LeaderboardEntry[]>(() => {
    if (!entries) return [];
    const copy = [...entries];
    if (activeTab === 'buteurs') copy.sort((a, b) => b.goals - a.goals);
    if (activeTab === 'passeurs') copy.sort((a, b) => b.assists - a.assists);
    if (activeTab === 'forme') copy.sort((a, b) => b.points - a.points);
    return copy.map((e, i) => ({ ...e, rank: i + 1 }));
  }, [entries, activeTab]);

  const podium = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  function initials(name: string) {
    return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  }

  function statValue(entry: LeaderboardEntry) {
    if (activeTab === 'buteurs') return entry.goals;
    if (activeTab === 'passeurs') return entry.assists;
    return entry.points;
  }

  function statLabel() {
    if (activeTab === 'buteurs') return 'buts';
    if (activeTab === 'passeurs') return 'passes';
    return 'pts';
  }

  // Trouver le rang de l'utilisateur courant
  const currentUserRank = sorted.findIndex(e => e.player_id === user?.id) + 1;

  // Déterminer la tendance (simulée)
  const getTrend = (index: number) => {
    if (index % 3 === 0) return 'up';
    if (index % 3 === 1) return 'down';
    return 'same';
  };

  return (
    <div className="space-y-8 opacity-0 animate-pitch-entry">
      
      {/* ═══ Header - Style UT ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-4 font-heading">
            <span className="w-14 h-14 rounded-xl bg-gradient-to-br from-ut-gold/20 to-amber-500/10 border border-ut-gold/30 flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.2)]">
              <Trophy className="w-7 h-7 text-ut-gold" />
            </span>
            Classement du Club
          </h1>
          <p className="text-ut-text-secondary text-sm mt-2">Qui domine la saison, statistique par statistique.</p>
        </div>

        {/* Rang utilisateur actuel style UT */}
        {!isLoading && currentUserRank > 0 && currentUserRank <= 10 && (
          <div className="flex items-center gap-3 px-5 py-3 rounded-xl ut-surface border border-ut-border hover:border-ut-cyan/40 transition-all group">
            <Star className="w-5 h-5 text-ut-gold group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-medium text-ut-text-secondary">Ton rang:</span>
            <span className="text-2xl font-extrabold text-ut-cyan font-heading">#{currentUserRank}</span>
          </div>
        )}
      </div>

      {/* ═══ Tabs de filtrage - Style Gaming UT ═══ */}
      <div className="bg-ut-surface/80 border border-ut-border/60 backdrop-blur-md p-1.5 rounded-xl flex gap-1 self-start">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold
                transition-all duration-300 hover:scale-[1.02] overflow-hidden
                ${isActive
                  ? `bg-ut-bg ${tab.color} border border-ut-border shadow-[0_0_15px_rgba(0,212,255,0.12)]`
                  : 'text-ut-text-secondary hover:text-white hover:bg-ut-bg/50'
                }
              `}
            >
              {isActive && (
                <div className={`absolute inset-0 ${tab.bgColor} translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500`} />
              )}
              <Icon className={`w-4 h-4`} /> 
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ═══ Loading State - Style UT ═══ */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-5">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-ut-border/30 rounded-full" />
            <div className="absolute inset-0 border-4 transparent border-t-ut-gold rounded-full animate-spin" style={{ boxShadow: '0 0 25px rgba(255,215,0,0.4)' }} />
            <Trophy className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-ut-gold" />
          </div>
          <p className="text-ut-text-secondary text-sm font-medium">Chargement du classement...</p>
        </div>
      )}

      {/* ═══ PODIUM TOP 3 - Style FIFA UT Podium ═══ */}
      {!isLoading && podium.length > 0 && (
        <div className="grid grid-cols-3 gap-4 sm:gap-6 items-end max-w-3xl mx-auto">
          {podium.map((entry) => {
            const style = PODIUM_STYLES.find((s) => s.rank === entry.rank) ?? PODIUM_STYLES[1];
            const Icon = style.icon;
            
            return (
              <div
                key={entry.player_id}
                className={`${style.order} ut-card ${style.borderColor} backdrop-blur-md rounded-2xl p-4 sm:p-6 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02] ${style.glow}`}
              >
                
                {/* Badge rang */}
                <div className={`mb-4 w-14 h-14 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center shadow-lg ${style.scale} transition-transform`}>
                  {style.rank === 1 ? (
                    <Crown className="w-7 h-7 text-ut-bg" />
                  ) : (
                    <span className="text-2xl font-black text-ut-bg font-heading">{style.rank}</span>
                  )}
                </div>
                
                {/* Avatar du joueur style UT */}
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${style.bgGradient} ring-2 ring-offset-2 ring-offset-ut-bg flex items-center justify-center font-black text-lg overflow-hidden mb-4 border ${style.borderColor} ${style.scale} transition-all duration-300 group/avatar`}>
                  {entry.player_photo ? (
                    <img src={entry.player_photo} alt="" className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-300" />
                  ) : (
                    <span className="group-hover/avatar:scale-110 transition-transform">{initials(entry.player_name)}</span>
                  )}
                  
                  {/* Badge spécial pour #1 */}
                  {entry.rank === 1 && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-ut-gold to-amber-500 flex items-center justify-center shadow-lg border-2 border-ut-bg animate-bounce-in">
                      <span className="text-ut-bg text-[11px] font-black">#1</span>
                    </div>
                  )}
                </div>
                
                {/* Nom et poste */}
                <p className="font-bold text-sm truncate w-full group-hover:text-ut-cyan transition-colors">{entry.player_name}</p>
                <p className="text-[11px] text-ut-text-secondary mt-1 truncate w-full">{entry.position || '—'}</p>
                
                {/* Valeur statistique principale style UT */}
                <div className={`mt-4 pt-4 border-t border-ut-border/40 w-full`}>
                  <div className={`font-mono text-4xl sm:text-5xl font-black ${style.textColor} font-heading`}>
                    {statValue(entry)}
                  </div>
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <span className="text-[10px] font-semibold text-ut-text-muted uppercase tracking-wider">{statLabel()}</span>
                    
                    {/* Trend indicator */}
                    {getTrend(entry.rank - 1) === 'up' && (
                      <ChevronUp className="w-3.5 h-3.5 text-ut-green" />
                    )}
                    {getTrend(entry.rank - 1) === 'down' && (
                      <ChevronDown className="w-3.5 h-3.5 text-ut-red" />
                    )}
                    {getTrend(entry.rank - 1) === 'same' && (
                      <Minus className="w-3.5 h-3.5 text-ut-text-muted" />
                    )}
                  </div>
                </div>

                {/* Badge trophy pour le leader */}
                {entry.rank === 1 && (
                  <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold text-ut-gold bg-ut-gold/10 border border-ut-gold/30 px-2.5 py-1 rounded-full">
                    <Flame className="w-3 h-3 animate-pulse" />
                    Leader
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ TABLEAU DU RESTE DU CLASSEMENT - Style UT ═══ */}
      {!isLoading && rest.length > 0 && (
        <div className="ut-card overflow-hidden">
          
          {/* Header tableau */}
          <div className="hidden sm:grid grid-cols-[70px_1fr_90px_80px_100px_80px] gap-4 px-6 py-4 bg-ut-bg/60 border-b border-ut-border/60 text-[11px] uppercase tracking-wider text-ut-text-secondary font-semibold">
            <span>#</span>
            <span>Joueur</span>
            <span className="text-center">Matchs</span>
            <span className="text-center text-ut-cyan">Buts</span>
            <span className="text-center text-ut-green">Passes</span>
            <span className="text-right text-ut-gold">Points</span>
          </div>
          
          {/* Rows */}
          <div className="divide-y divide-ut-border/25">
            {rest.map((entry, idx) => {
              const isCurrentUser = entry.player_id === user?.id;
              const trend = getTrend(idx + 3);
              
              return (
                <div
                  key={entry.player_id}
                  className={`
                    group grid grid-cols-1 sm:grid-cols-[70px_1fr_90px_80px_100px_80px] gap-2 sm:gap-4 px-4 sm:px-6 py-4 items-center hover:bg-ut-bg/70 transition-all duration-200 cursor-default
                    ${idx % 2 === 1 ? 'bg-ut-bg/20' : ''}
                    ${isCurrentUser ? 'bg-ut-cyan/5 border-l-2 border-l-ut-cyan' : ''}
                  `}
                >
                  {/* Rang */}
                  <span className="font-mono font-bold text-ut-text-secondary text-sm font-heading">
                    {entry.rank}
                    {trend === 'up' && <ChevronUp className="inline w-3 h-3 ml-1 text-ut-green" />}
                    {trend === 'down' && <ChevronDown className="inline w-3 h-3 ml-1 text-ut-red" />}
                  </span>
                  
                  {/* Joueur */}
                  <div className="flex items-center gap-3 min-w-0 col-span-1 sm:col-auto">
                    <div className={`w-10 h-10 rounded-xl ut-bg border flex items-center justify-center text-[11px] font-bold overflow-hidden shrink-0 transition-all duration-200 group-hover:scale-110 ${
                      entry.player_photo ? '' : `${isCurrentUser ? 'bg-ut-cyan/15 border-ut-cyan/30 text-ut-cyan' : 'bg-ut-surface-light border-ut-border text-ut-text-muted'}`
                    }`}>
                      {entry.player_photo ? (
                        <img src={entry.player_photo} alt="" className="w-full h-full object-cover" />
                      ) : (
                        initials(entry.player_name)
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className={`font-semibold text-sm truncate group-hover:text-ut-cyan transition-colors ${isCurrentUser ? 'text-ut-cyan' : ''}`}>
                        {entry.player_name}
                        {isCurrentUser && <span className="ml-2 text-[9px] text-ut-cyan bg-ut-cyan/10 px-1.5 py-0.5 rounded">(Toi)</span>}
                      </p>
                      <p className="text-[11px] text-ut-text-secondary truncate">{entry.position || '—'}</p>
                    </div>
                  </div>
                  
                  {/* Matchs */}
                  <span className="text-center text-ut-text-secondary text-sm hidden sm:block font-heading">{entry.matches}</span>
                  
                  {/* Buts */}
                  <span className="text-center font-bold text-ut-cyan text-sm font-heading">{entry.goals}</span>
                  
                  {/* Passes */}
                  <span className="text-center text-ut-text-secondary text-sm hidden sm:block font-heading">{entry.assists}</span>
                  
                  {/* Points */}
                  <span className="text-right font-mono font-bold text-sm font-heading">{entry.points}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ Empty State - Style UT ═══ */}
      {!isLoading && sorted.length === 0 && (
        <div className="ut-card border-dashed p-16 text-center max-w-md mx-auto">
          <Trophy className="w-16 h-16 text-ut-text-muted mx-auto mb-5 opacity-40" />
          <h3 className="font-bold text-white text-xl mb-3 font-heading">Aucune statistique disponible</h3>
          <p className="text-sm text-ut-text-secondary leading-relaxed">
            Les classements apparaîtront après les premiers matchs enregistrés.
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
