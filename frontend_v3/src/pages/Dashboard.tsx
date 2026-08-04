import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2, XCircle, Calendar, Trophy, Zap, Goal,
  TrendingUp, Flame, Star, ArrowRight, Clock,
  Users, Target, Award, ChevronRight, Gamepad2,
  Activity, Medal, Crown, Sparkles, Play, Hand,
  BarChart3, Circle
} from 'lucide-react';
import type { MatchResponse, ContributionResponse, PlayerStatsResponse, GoalCurvePoint } from '../types/api';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [attendance, setAttendance] = useState<'present' | 'absent' | null>(null);
  const { user } = useAuth();
  const clubId = user?.memberships?.[0]?.club_id ?? 1;

  // ═══ Requêtes de données ═══
  const { data: stats } = useQuery<PlayerStatsResponse>({
    queryKey: ['my-stats'],
    queryFn: async () => (await api.get('/players/me/stats')).data,
  });

  const { data: matches } = useQuery({
    queryKey: ['matches', clubId],
    queryFn: async () => (await api.get<MatchResponse[]>(`/matches/club/${clubId}`)).data,
  });

  const { data: contributions } = useQuery({
    queryKey: ['contributions', clubId],
    queryFn: async () => (await api.get<ContributionResponse[]>(`/contributions/club/${clubId}`)).data,
  });

  // ═══ Données dérivées ═══
  const prochainMatch = matches?.find((m) => m.status === 'scheduled') ?? null;
  const contributionActive = contributions?.find((c) => c.status === 'active') ?? contributions?.[0] ?? null;

  // Progress ring calculations
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const progress = contributionActive?.progress_percentage ?? 0;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  if (!user) return null;

  // Initiales pour avatar
  const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  
  // Calculer niveau et XP style UT
  const userLevel = Math.floor((user.total_goals * 2 + user.matches_played) / 3) || 1;
  const xpToNextLevel = (userLevel + 1) * 3 - (user.total_goals * 2 + user.matches_played);
  const xpProgress = ((user.total_goals * 2 + user.matches_played) % 3) / 3 * 100;

  // Définir la couleur de rareté basée sur le niveau
  const getRarityColor = (level: number) => {
    if (level >= 15) return { border: 'border-ut-gold', bg: 'from-ut-gold/20 to-yellow-500/5', text: 'text-ut-gold', glow: 'shadow-ut-gold', badge: 'LEGENDARY' };
    if (level >= 10) return { border: 'border-ut-purple', bg: 'from-ut-purple/20 to-purple-500/5', text: 'text-ut-purple', glow: 'shadow-ut-purple', badge: 'SPECIAL' };
    if (level >= 5) return { border: 'border-ut-cyan', bg: 'from-ut-cyan/20 to-cyan-500/5', text: 'text-ut-cyan', glow: 'shadow-ut-cyan', badge: 'RARE' };
    return { border: 'border-gray-400', bg: 'from-gray-400/20 to-gray-500/5', text: 'text-gray-400', glow: '', badge: 'COMMON' };
  };

  const rarity = getRarityColor(userLevel);

  const chartPoints = useMemo(() => {
    const curve = stats?.goal_curve ?? [];
    if (!curve.length) return [];

    const maxGoal = Math.max(...curve.map((point) => point.cumulative_goals), 1);
    return curve.map((point, index) => {
      const x = curve.length === 1 ? 50 : (index / (curve.length - 1)) * 100;
      const y = 100 - (point.cumulative_goals / maxGoal) * 100;
      return { x, y, point };
    });
  }, [stats]);

  const chartPath = chartPoints.map((point) => `${point.x},${point.y}`).join(' ');
  const areaPath = chartPoints.length > 1
    ? `M ${chartPoints[0].x} 100 L ${chartPoints.map((point) => `${point.x} ${point.y}`).join(' L ')} L ${chartPoints[chartPoints.length - 1].x} 100 Z`
    : '';

  const latestResult = stats?.recent_form?.[0] ?? 'D';
  const recentFormLabel = latestResult === 'W' ? 'Bonne forme' : latestResult === 'D' ? 'Stabilité' : 'À reprendre';

  return (
    <div className="space-y-6 opacity-0 animate-pitch-entry">
      
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HERO SECTION - Carte Joueur Style Ultimate Team                  */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className={`relative overflow-hidden rounded-2xl ${rarity.bg} bg-gradient-to-br via-ut-surface to-ut-bg ${rarity.border} border-2 p-6 lg:p-8`}>
        
        {/* Background décoratif UT */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-ut-cyan/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-ut-purple/5 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        {/* Pattern subtil */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 25px, rgba(0,212,255,0.3) 25px, rgba(0,212,255,0.3) 26px),
            repeating-linear-gradient(90deg, transparent, transparent 25px, rgba(0,212,255,0.3) 25px, rgba(0,212,255,0.3) 26px)
          `
        }} />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left - Avatar & Info Joueur Style Card UT */}
          <div className="flex items-center gap-5">
            {/* Avatar avec bordure animée style UT */}
            <div className="relative group cursor-pointer w-20 h-20 shrink-0">
              {/* Anneau extérieur rotatif selon rareté */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${
                userLevel >= 15 ? 'from-ut-gold via-yellow-400 to-ut-gold' :
                userLevel >= 10 ? 'from-ut-purple via-purple-400 to-ut-purple' :
                'from-ut-cyan via-cyan-400 to-ut-cyan'
              } p-[3px]`}>
                <div className={`w-full h-full rounded-2xl ut-bg flex items-center justify-center text-xl font-bold text-white shadow-lg overflow-hidden ${rarity.glow}`}>
                  {user.photo_url ? (
                    <img src={user.photo_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
              </div>
              
              {/* Badge niveau style UT */}
              <div className={`absolute -bottom-2 -right-2 px-2.5 py-1 rounded-lg font-black text-xs ut-bg border-2 ${
                userLevel >= 15 ? 'border-ut-gold text-ut-gold shadow-[0_0_15px_rgba(255,215,0,0.4)]' :
                userLevel >= 10 ? 'border-ut-purple text-ut-purple shadow-[0_0_15px_rgba(168,85,247,0.4)]' :
                'border-ut-cyan text-ut-cyan shadow-[0_0_15px_rgba(0,212,255,0.4)]'
              }`}>
                LV.{userLevel}
              </div>
              
              {/* Badge rareté */}
              <div className={`absolute -top-2 -left-2 px-2 py-0.5 rounded text-[8px] font-black tracking-wider ut-bg border ${
                userLevel >= 15 ? 'border-ut-gold text-ut-gold' :
                userLevel >= 10 ? 'border-ut-purple text-ut-purple' :
                'border-ut-cyan text-ut-cyan'
              }`}>
                {rarity.badge}
              </div>
            </div>
            
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight font-heading">
                Bonjour,{' '}
                <span className={`${rarity.text} gradient-text-${userLevel >= 15 ? 'gold' : userLevel >= 10 ? 'purple' : 'cyan'}`}>
                  {user.first_name}
                </span>
                ! 
                <Hand className="inline-block w-6 h-6 ml-2 text-ut-gold animate-wave" />
              </h1>
              <p className="text-ut-text-secondary text-sm mt-1.5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-ut-cyan" />
                Prêt pour les prochaines échéances de ton club
              </p>
              
              {/* Barre d'XP */}
              <div className="mt-3 max-w-[200px]">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-ut-text-muted">XP vers Niv.{userLevel + 1}</span>
                  <span className={rarity.text}>{Math.round(xpProgress)}%</span>
                </div>
                <div className="h-1.5 bg-ut-bg rounded-full overflow-hidden border border-ut-border/50">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 relative ${
                      userLevel >= 15 ? 'bg-gradient-to-r from-ut-gold to-yellow-500' :
                      userLevel >= 10 ? 'bg-gradient-to-r from-ut-purple to-purple-400' :
                      'bg-gradient-to-r from-ut-cyan to-cyan-400'
                    }`}
                    style={{ width: `${xpProgress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Stats rapides en mini cards style attributs UT */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              {/* Streak badge animé */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/30 rounded-xl group hover:bg-red-500/15 transition-colors">
                <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
                <div>
                  <span className="text-lg font-extrabold text-orange-300 font-heading">5</span>
                  <span className="text-[10px] text-ut-text-muted block leading-none">matchs</span>
                </div>
              </div>
              
              {/* Séparateur vertical */}
              <div className="w-px h-12 bg-ut-border/50" />
              
              {/* Mini stat buts style UT attribute */}
              <div className="text-center px-4 py-2.5 rounded-xl bg-ut-bg/60 border border-ut-border/40 hover:border-ut-cyan/40 transition-all group cursor-default">
                <Goal className="w-4 h-4 mx-auto mb-1 text-ut-cyan group-hover:scale-110 transition-transform" />
                <p className="text-xl font-extrabold text-ut-cyan font-heading">{stats?.total_goals ?? user.total_goals ?? 0}</p>
                <p className="text-[9px] text-ut-text-muted uppercase tracking-wider">Buts</p>
              </div>
              
              {/* Mini stat matchs */}
              <div className="text-center px-4 py-2.5 rounded-xl bg-ut-bg/60 border border-ut-border/40 hover:border-ut-green/40 transition-all group cursor-default">
                <Calendar className="w-4 h-4 mx-auto mb-1 text-ut-green group-hover:scale-110 transition-transform" />
                <p className="text-xl font-extrabold text-ut-green font-heading">{stats?.matches_played ?? user.matches_played ?? 0}</p>
                <p className="text-[9px] text-ut-text-muted uppercase tracking-wider">Matchs</p>
              </div>
              
              {/* Mini stat win rate */}
              <div className="text-center px-4 py-2.5 rounded-xl bg-ut-bg/60 border border-ut-border/40 hover:border-ut-gold/40 transition-all group cursor-default">
                <TrendingUp className="w-4 h-4 mx-auto mb-1 text-ut-gold group-hover:scale-110 transition-transform" />
                <p className="text-xl font-extrabold text-ut-gold font-heading">{stats ? `${Math.round(stats.win_rate)}%` : '—'}</p>
                <p className="text-[9px] text-ut-text-muted uppercase tracking-wider">Win%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* STAT DASHBOARD - Courbe de buts + indicateurs joueurs             */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_0.9fr] gap-6">
        <div className="ut-card border border-ut-border/40 overflow-hidden">
          <div className="p-5 border-b border-ut-border/50 bg-gradient-to-r from-ut-cyan/5 via-transparent to-transparent flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-ut-cyan/15 border border-ut-cyan/30 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-ut-cyan" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-ut-text-secondary block">Évolution buts</span>
                <span className="text-[10px] text-ut-text-muted/60">Par match joué</span>
              </div>
            </div>
            <div className="rounded-full bg-ut-cyan/10 px-3 py-1 text-[10px] font-semibold text-ut-cyan border border-ut-cyan/30">
              {stats?.matches_played ?? 0} matchs
            </div>
          </div>

          <div className="p-5">
            {chartPoints.length > 0 ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-ut-border/40 bg-ut-bg/40 p-4">
                  <svg viewBox="0 0 100 100" className="w-full h-72">
                    <defs>
                      <linearGradient id="goalArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(34,211,238,0.45)" />
                        <stop offset="100%" stopColor="rgba(34,211,238,0.04)" />
                      </linearGradient>
                    </defs>
                    {[20, 40, 60, 80].map((line) => (
                      <line key={line} x1="0" y1={line} x2="100" y2={line} stroke="rgba(148,163,184,0.16)" strokeDasharray="2 2" />
                    ))}
                    {areaPath && <path d={areaPath} fill="url(#goalArea)" />}
                    <polyline
                      points={chartPath}
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                    {chartPoints.map((point, index) => (
                      <g key={`${point.point.match_id}-${index}`}>
                        <circle cx={point.x} cy={point.y} r="1.8" fill="#f8fafc" stroke="#22d3ee" strokeWidth="1" />
                        <text x={point.x} y={point.y - 3} textAnchor="middle" fontSize="3.2" fill="#a5f3fc">
                          {point.point.cumulative_goals}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-xl bg-ut-bg/60 border border-ut-border/40 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-ut-text-muted">Buts total</p>
                    <p className="mt-1 text-lg font-bold text-ut-gold">{stats?.total_goals ?? 0}</p>
                  </div>
                  <div className="rounded-xl bg-ut-bg/60 border border-ut-border/40 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-ut-text-muted">Moyenne/match</p>
                    <p className="mt-1 text-lg font-bold text-ut-cyan">{stats ? stats.goals_per_match.toFixed(1) : '0.0'}</p>
                  </div>
                  <div className="rounded-xl bg-ut-bg/60 border border-ut-border/40 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-ut-text-muted">Victoires</p>
                    <p className="mt-1 text-lg font-bold text-ut-green">{stats?.matches_won ?? 0}</p>
                  </div>
                  <div className="rounded-xl bg-ut-bg/60 border border-ut-border/40 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-ut-text-muted">Taux de victoire</p>
                    <p className="mt-1 text-lg font-bold text-ut-purple">{stats ? `${Math.round(stats.win_rate)}%` : '0%'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-ut-border/40 p-8 text-center text-sm text-ut-text-muted">
                Aucune courbe disponible pour le moment. Joue ton premier match pour déclencher le suivi.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="ut-card border border-ut-border/40 p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-ut-text-muted">
              <Activity className="w-4 h-4 text-ut-cyan" />
              Forme récente
            </div>
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              {(stats?.recent_form?.length ? stats.recent_form : ['W', 'D', 'L']).slice(0, 5).map((result, index) => (
                <span
                  key={`${result}-${index}`}
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border text-sm font-bold ${
                    result === 'W'
                      ? 'border-ut-green/40 bg-ut-green/10 text-ut-green'
                      : result === 'D'
                        ? 'border-ut-gold/40 bg-ut-gold/10 text-ut-gold'
                        : 'border-red-400/40 bg-red-400/10 text-red-400'
                  }`}
                >
                  {result}
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm text-textMuted">{recentFormLabel}</p>
          </div>

          <div className="ut-card border border-ut-border/40 p-5">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-ut-text-muted">
              <Target className="w-4 h-4 text-ut-gold" />
              Indicateurs clefs
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-ut-bg/60 border border-ut-border/40 p-3 flex items-center justify-between">
                <span className="text-sm text-ut-text-secondary">Matchs gagnés</span>
                <strong className="text-ut-green">{stats?.matches_won ?? 0}</strong>
              </div>
              <div className="rounded-xl bg-ut-bg/60 border border-ut-border/40 p-3 flex items-center justify-between">
                <span className="text-sm text-ut-text-secondary">Matchs nuls</span>
                <strong className="text-ut-gold">{stats?.matches_drawn ?? 0}</strong>
              </div>
              <div className="rounded-xl bg-ut-bg/60 border border-ut-border/40 p-3 flex items-center justify-between">
                <span className="text-sm text-ut-text-secondary">Matchs perdus</span>
                <strong className="text-red-400">{stats?.matches_lost ?? 0}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* GRILLE PRINCIPALE - Widgets principaux                             */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* ═══ WIDGET 1 : PROCHAIN MATCH - Style Match Day UT ═══ */}
        <div className="xl:col-span-2 group">
          <div className="ut-card-cyan overflow-hidden">
            
            {/* Header du widget style UT */}
            <div className="p-5 border-b border-ut-border/50 bg-gradient-to-r from-ut-cyan/5 via-transparent to-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-ut-cyan/15 border border-ut-cyan/30 flex items-center justify-center shadow-glow-sm">
                  <Calendar className="w-5 h-5 text-ut-cyan" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-ut-text-secondary block">Prochain Match</span>
                  <span className="text-[10px] text-ut-text-muted/60">Ton club est impliqué</span>
                </div>
              </div>
              
              {prochainMatch && (
                <span className="text-xs text-ut-cyan flex items-center gap-1.5 font-semibold bg-ut-cyan/10 px-3 py-1.5 rounded-lg border border-ut-cyan/30">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(prochainMatch.match_date).toLocaleDateString('fr-FR', { 
                    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                  })}
                </span>
              )}
            </div>

            {prochainMatch ? (
              <>
                {/* Contenu du match style FIFA */}
                <div className="p-8 flex flex-col items-center justify-center relative">
                  
                  {/* Background subtil terrain */}
                  <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: `
                      repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0,212,255,0.5) 20px, rgba(0,212,255,0.5) 21px),
                      repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,212,255,0.5) 20px, rgba(0,212,255,0.5) 21px)
                    `
                  }} />
                  
                  <div className="relative z-10 flex items-center justify-center gap-8 w-full max-w-md">
                    
                    {/* Équipe A style card UT */}
                    <div className="flex flex-col items-center text-center flex-1 group/team">
                      <div className="w-18 h-18 sm:w-20 sm:h-20 bg-gradient-to-br from-ut-bg to-ut-surface border-2 border-ut-border rounded-2xl flex items-center justify-center mb-3 text-2xl font-bold text-ut-cyan shadow-lg transition-all duration-300 group-hover/team:scale-110 group-hover/team:border-ut-cyan/60 group-hover/team:shadow-glow-sm">
                        A
                      </div>
                      <span className="font-semibold text-sm tracking-wide">Équipe A</span>
                      <span className="text-[10px] text-ut-text-secondary mt-1">Domicile</span>
                    </div>
                    
                    {/* VS / Score central style FIFA */}
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <div className="text-xs font-black px-5 py-2.5 ut-bg border-2 border-ut-border rounded-xl text-ut-text-secondary tracking-widest shadow-inner font-heading">
                          VS
                        </div>
                        {/* Glow subtil derrière VS */}
                        <div className="absolute inset-0 bg-ut-cyan/10 rounded-xl blur-md -z-10" />
                      </div>
                      <div className="text-[10px] text-ut-text-muted/50 uppercase tracking-wider mt-2">Affrontement</div>
                    </div>
                    
                    {/* Équipe B */}
                    <div className="flex flex-col items-center text-center flex-1 group/team">
                      <div className="w-18 h-18 sm:w-20 sm:h-20 bg-gradient-to-br from-ut-bg to-ut-surface border-2 border-ut-border rounded-2xl flex items-center justify-center mb-3 text-2xl font-bold text-ut-red shadow-lg transition-all duration-300 group-hover/team:scale-110 group-hover/team:border-ut-red/60 group-hover/team:shadow-[0_0_20px_rgba(255,51,102,0.3)]">
                        B
                      </div>
                      <span className="font-semibold text-sm tracking-wide">Équipe B</span>
                      <span className="text-[10px] text-ut-text-secondary mt-1">Extérieur</span>
                    </div>
                  </div>
                  
                  {/* Lieu du match */}
                  {prochainMatch.location && (
                    <p className="relative z-10 text-xs text-ut-text-secondary mt-6 font-medium flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-ut-green" />
                      {prochainMatch.location}
                    </p>
                  )}
                </div>

                {/* Footer - Boutons présence style UT */}
                <div className="p-5 bg-ut-bg/40 border-t border-ut-border/50 grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setAttendance('present')}
                    className={`
                      relative flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold tracking-wide 
                      transition-all duration-300 overflow-hidden group
                      ${attendance === 'present' 
                        ? 'bg-gradient-to-r from-ut-green to-emerald-500 ut-text-bg shadow-[0_0_25px_rgba(0,255,136,0.4)] border border-ut-green/50' 
                        : 'bg-ut-surface border border-ut-border text-white hover:border-ut-green/50 hover:bg-ut-green/5'
                      }
                    `}
                  >
                    {attendance === 'present' && (
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                    )}
                    <CheckCircle2 className={`w-5 h-5 relative z-10 ${attendance === 'present' ? 'animate-bounce-in' : ''}`} /> 
                    <span className="relative z-10">Je serai présent</span>
                  </button>
                  
                  <button
                    onClick={() => setAttendance('absent')}
                    className={`
                      relative flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold tracking-wide 
                      transition-all duration-300 overflow-hidden group
                      ${attendance === 'absent' 
                        ? 'bg-gradient-to-r from-ut-red to-orange-500 text-white shadow-[0_0_25px_rgba(255,51,102,0.4)] border border-ut-red/50' 
                        : 'bg-ut-surface border border-ut-border text-white hover:border-ut-red/50 hover:bg-ut-red/5'
                      }
                    `}
                  >
                    {attendance === 'absent' && (
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                    )}
                    <XCircle className={`w-5 h-5 relative z-10 ${attendance === 'absent' ? 'animate-bounce-in' : ''}`} /> 
                    <span className="relative z-10">Je serai absent</span>
                  </button>
                </div>
              </>
            ) : (
              /* Empty state stylisé */
              <div className="p-16 text-center">
                <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-ut-bg border border-ut-border flex items-center justify-center">
                  <Calendar className="w-9 h-9 text-ut-text-muted" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2 font-heading">Aucun match programmé</h3>
                <p className="text-sm text-ut-text-secondary">Reviens bientôt pour voir les prochains affrontements !</p>
                
                {/* Badge coming soon */}
                <div className="inline-flex items-center gap-2 mt-4 text-[10px] font-semibold text-ut-cyan bg-ut-cyan/10 border border-ut-cyan/20 px-3 py-1.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Les matchs apparaîtront ici
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══ WIDGET 2 : CONTRIBUTIONS - Style Objectif UT ═══ */}
        <div className="group">
          <div className="ut-card h-full flex flex-col p-6 hover:border-ut-purple/40">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-ut-gold/10 border border-ut-gold/30 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-ut-gold" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-ut-text-secondary block">Cotisations</span>
                  <span className="text-[10px] text-ut-text-muted/60">Objectif du club</span>
                </div>
              </div>
              
              {/* Badge progression */}
              {contributionActive && contributionActive.progress_percentage >= 100 && (
                <span className="ut-badge-green">
                  <CheckCircle2 className="w-3 h-3" /> Atteint
                </span>
              )}
            </div>

            {/* Progress Ring SVG style UT */}
            <div className="relative flex items-center justify-center w-44 h-44 mx-auto my-4">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-ut-cyan/10 blur-2xl opacity-60" />
              
              <svg className="w-full h-full transform -rotate-90 relative z-10">
                {/* Background circle */}
                <circle 
                  cx="88" cy="88" r={radius} 
                  strokeWidth={strokeWidth} 
                  stroke="#111827" 
                  fill="transparent" 
                  className="opacity-70"
                />
                {/* Progress circle with gradient UT */}
                <defs>
                  <linearGradient id="progressGradientUT" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00D4FF" />
                    <stop offset="50%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#FFD700" />
                  </linearGradient>
                </defs>
                <circle
                  cx="88" cy="88" r={radius} 
                  strokeWidth={strokeWidth} 
                  fill="transparent"
                  stroke="url(#progressGradientUT)"
                  strokeDasharray={circumference} 
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  style={{ filter: 'drop-shadow(0 0 10px rgba(0,212,255,0.5))' }}
                />
              </svg>
              
              {/* Center content style UT */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-ut-cyan via-ut-purple to-ut-gold bg-clip-text text-transparent font-heading">
                  {Math.round(progress)}%
                </span>
                <span className="text-[11px] font-bold text-ut-green uppercase mt-1.5 tracking-wider flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" /> Réglés
                </span>
              </div>
            </div>

            {/* Détails contribution */}
            {contributionActive ? (
              <div className="mt-auto space-y-4">
                <div className="text-center p-4 rounded-xl bg-ut-bg/60 border border-ut-border/40">
                  <p className="text-2xl font-bold font-heading">
                    <span className="text-ut-cyan">{contributionActive.amount_collected}€</span>
                    <span className="text-ut-text-secondary text-base font-normal"> / {contributionActive.amount_total}€</span>
                  </p>
                  <p className="text-[11px] text-ut-text-secondary mt-2 line-clamp-1">{contributionActive.title}</p>
                </div>
                
                {/* Participants count */}
                <div className="flex items-center justify-between text-xs text-ut-text-secondary px-2">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {contributionActive.participant_count} participant{contributionActive.participant_count > 1 ? 's' : ''}
                  </span>
                  <span className="text-ut-green font-semibold">
                    Reste: {contributionActive.remaining_amount?.toFixed(0)}€
                  </span>
                </div>

                {/* Bouton action style UT */}
                <button className="w-full ut-button-primary group/btn">
                  <Zap className="w-4 h-4 group-hover/btn:animate-pulse" />
                  Régler le solde
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="mt-auto text-center py-4">
                <p className="text-xs text-ut-text-secondary">Aucune cotisation en cours.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* DEUXIÈME LIGNE DE WIDGETS                                        */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* ═══ WIDGET 3 : AGENDA DU CLUB (placeholder amélioré) ═══ */}
        <div className="xl:col-span-2 ut-card overflow-hidden hover:border-ut-border-bright">
          <div className="p-6 border-b border-ut-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-ut-purple/10 border border-ut-purple/30 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-ut-purple" />
              </div>
              <div>
                <h2 className="text-sm uppercase tracking-wider font-bold font-heading">Agenda du Club</h2>
                <span className="text-[10px] text-ut-text-muted/60">Prochains événements</span>
              </div>
            </div>
            
            <button className="text-xs text-ut-cyan hover:text-white flex items-center gap-1 font-semibold opacity-70 hover:opacity-100 transition-opacity">
              Voir tout <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="p-10 text-center">
            {/* Icône décorative */}
            <div className="w-22 h-22 mx-auto mb-5 rounded-2xl bg-ut-bg border border-dashed border-ut-border flex items-center justify-center">
              <Calendar className="w-10 h-10 text-ut-text-muted/40" />
            </div>
            <h3 className="font-bold text-white text-lg mb-2 font-heading">Module Événements</h3>
            <p className="text-sm text-ut-text-secondary max-w-sm mx-auto">
              L'agenda détaillé (entraînements, réunions, événements spéciaux) arrivera bientôt avec le module Événements.
            </p>
            
            {/* Indicateur "Coming soon" style UT */}
            <div className="inline-flex items-center gap-2 mt-5 text-[10px] font-semibold text-ut-purple bg-ut-purple/10 border border-ut-purple/20 px-3.5 py-1.5 rounded-full">
              <Star className="w-3 h-3" />
              Bientôt disponible
            </div>
          </div>
        </div>

        {/* ═══ WIDGET 4 : MON PROFIL & STATS RAPIDES - Style Mini Card UT ═══ */}
        <div className="ut-card p-6 flex flex-col hover:border-ut-cyan/40">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm uppercase tracking-wider font-bold text-ut-text-secondary flex items-center gap-2 font-heading">
              <Award className="w-4 h-4 text-ut-gold" />
              Mon Profil
            </h2>
            <button 
              onClick={() => navigate('/profile')}
              className="text-[10px] text-ut-cyan hover:text-white font-semibold flex items-center gap-1 transition-colors"
            >
              Modifier <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Carte profil miniature style UT */}
          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-gradient-to-br from-ut-bg/80 to-ut-surface border border-ut-border/40 mb-5 group cursor-pointer hover:border-ut-cyan/40 transition-all hover:shadow-glow-sm">
            <div className="relative">
              <div className={`w-13 h-13 rounded-xl bg-gradient-to-br ${
                userLevel >= 10 ? 'from-ut-gold/20 to-amber-500/10' :
                'from-ut-cyan/20 to-purple-500/10'
              } border ${
                userLevel >= 10 ? 'border-ut-gold/30' : 'border-ut-cyan/30'
              } flex items-center justify-center ${
                userLevel >= 10 ? 'text-ut-gold' : 'text-ut-cyan'
              } font-bold text-lg shadow-lg group-hover:scale-105 transition-transform`}>
                {initials}
              </div>
              {/* Status dot */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-ut-green rounded-full border-2 border-ut-surface" style={{ boxShadow: '0 0 8px rgba(0,255,136,0.6)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate group-hover:text-ut-cyan transition-colors">{user.first_name}</p>
              <p className="text-xs text-ut-cyan font-medium mt-0.5 flex items-center gap-1.5">
                <Goal className="w-3 h-3" />
                {user.position ?? 'Poste non défini'}
              </p>
            </div>
            
            {/* Niveau badge style UT */}
            <div className="text-right">
              <div className={`text-xl font-extrabold font-heading ${
                userLevel >= 10 ? 'text-ut-gold' : 'text-ut-cyan'
              }`}>{userLevel}</div>
              <div className="text-[9px] text-ut-text-muted uppercase">Level</div>
            </div>
          </div>

          {/* Stats grid style attributs UT */}
          <div className="grid grid-cols-3 gap-3 mt-auto">
            {[
              { label: 'Matchs Joués', value: stats?.matches_played ?? user.matches_played ?? 0, icon: Calendar, color: 'from-blue-500 to-cyan-500', textColor: 'text-ut-cyan', bgColor: 'hover:bg-ut-cyan/5' },
              { label: 'Buts', value: stats?.total_goals ?? user.total_goals ?? 0, icon: Trophy, color: 'from-yellow-500 to-amber-500', textColor: 'text-ut-gold', bgColor: 'hover:bg-ut-gold/5' },
              { label: 'Win Rate', value: stats ? `${Math.round(stats.win_rate)}%` : '—', icon: TrendingUp, color: 'from-green-500 to-emerald-500', textColor: 'text-ut-green', bgColor: 'hover:bg-ut-green/5' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={idx} 
                  className={`bg-ut-bg/60 border border-ut-border/40 rounded-xl p-3.5 text-center flex flex-col justify-between items-center min-h-[95px] hover:border-current transition-all duration-200 group/stat cursor-default ${stat.bgColor}`}
                >
                  <Icon className={`w-5 h-5 ${stat.textColor} opacity-80 group-hover/stat:scale-110 transition-transform`} />
                  <span className={`text-xl font-extrabold tracking-tight mt-1.5 font-heading ${stat.textColor}`}>{stat.value}</span>
                  <span className="text-[10px] text-ut-text-muted font-medium block mt-1 leading-tight">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}

// Helper function for navigation (since we can't use useNavigate outside router context)
function navigate(path: string) {
  // This is a workaround - in real implementation, use useNavigate hook
  window.location.href = path;
}
