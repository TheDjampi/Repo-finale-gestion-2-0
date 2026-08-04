import React, { useState } from 'react';
import { Calendar, MapPin, ChevronDown, ChevronUp, Trophy, Clock, Users, Play, Flame } from 'lucide-react';
import type { MatchResponse } from '../types/api';

interface MatchCardProps {
  match: MatchResponse;
}

export const MatchCard: React.FC<MatchCardProps> = React.memo(({ match }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const formattedDate = new Date(match.match_date).toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';
  const isScheduled = match.status === 'scheduled';

  const joueursEquipeA = match.lineups.filter((l) => l.team === 'team_a');
  const joueursEquipeB = match.lineups.filter((l) => l.team === 'team_b');

  // Déterminer le style de bordure selon le statut
  const getCardStyle = () => {
    if (isLive) return 'border-ut-red/60 shadow-[0_0_30px_rgba(255,51,102,0.15)] animate-border-glow';
    if (isFinished) return 'border-ut-border hover:border-ut-border-bright hover:shadow-lg';
    return 'border-ut-border/60 hover:border-ut-cyan/40 hover:shadow-glow-sm';
  };

  return (
    <div className={`
      group relative ut-card overflow-hidden
      transition-all duration-300
      ${getCardStyle()}
    `}>
      
      {/* ═══ Header avec date et status - Style UT ═══ */}
      <div className={`p-4 flex items-center justify-between text-xs ${
        isLive ? 'bg-red-500/10 border-b border-red-500/20' :
        isFinished ? 'bg-ut-bg/40 border-b border-ut-border/30' :
        'bg-ut-bg/25 border-b border-ut-border/25'
      }`}>
        <span className="flex items-center gap-1.5 font-medium text-ut-text-secondary">
          <Calendar className={`w-3.5 h-3.5 ${isLive ? 'text-ut-red' : 'text-ut-cyan'}`} />
          {formattedDate}
        </span>

        {/* Status badges style UT */}
        {isLive && (
          <span className="flex items-center gap-1.5 bg-red-500/15 border border-red-500/35 px-3 py-1.5 rounded-full text-[10px] font-black text-ut-red tracking-wider animate-live-pulse">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ut-red opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-ut-red"></span>
            </span>
            LIVE
            <Play className="w-3 h-3" />
          </span>
        )}
        {isFinished && (
          <span className="bg-ut-surface-light text-ut-text-secondary px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-ut-border">
            <Clock className="w-3 h-3" /> Terminé
          </span>
        )}
        {isScheduled && (
          <span className="bg-ut-cyan/10 text-ut-cyan border border-ut-cyan/25 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3 h-3" /> Programmé
          </span>
        )}
        {match.status === 'postponed' && (
          <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/25 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Reporté
          </span>
        )}
      </div>

      {/* ═══ Contenu principal - Score style FIFA UT ═══ */}
      <div className="p-6 flex items-center justify-between gap-4">
        
        {/* Équipe A - Style card UT */}
        <div className="flex flex-col items-center text-center flex-1 min-w-0 group/team-a">
          <div className={`
            w-16 h-16 sm:w-18 sm:h-18 rounded-xl flex items-center justify-center text-lg sm:text-xl font-black shadow-lg mb-2.5
            transition-all duration-300 border-2
            ${isFinished && match.winner === 'team_a' 
              ? 'bg-gradient-to-br from-ut-cyan to-blue-600 text-white border-ut-cyan scale-110 shadow-[0_0_25px_rgba(0,212,255,0.4)]' 
              : 'bg-gradient-to-br from-ut-bg to-ut-surface border-ut-border text-ut-text-secondary group-hover/team-a:border-ut-cyan/50 group-hover/team-a:text-white group-hover/team-a:scale-105'
            }
          `}>
            A
          </div>
          <span className={`text-xs sm:text-sm font-semibold truncate w-full transition-colors ${
            isFinished && match.winner === 'team_a' ? 'text-ut-cyan font-heading' : 'text-white'
          }`}>
            Équipe A
          </span>
          {isFinished && match.winner === 'team_a' && (
            <Trophy className="w-5 h-5 text-ut-gold mt-1.5 animate-bounce-in" />
          )}
        </div>

        {/* Score / VS - Central style FIFA */}
        <div className="flex flex-col items-center justify-center px-4">
          {(isFinished || isLive) ? (
            <div className={`
              flex items-center gap-2 sm:gap-3 font-mono text-2xl sm:text-4xl font-black tracking-tighter
              px-5 sm:px-7 py-3 rounded-xl border-2 transition-all duration-300
              ${isLive 
                ? 'bg-red-500/10 border-red-500/35 text-white shadow-[inset_0_0_20px_rgba(255,51,102,0.1)]' 
                : 'bg-ut-bg/80 border-ut-border/50'
              }
            `}>
              <span className={`
                min-w-[2.5ch] sm:min-w-[3ch] text-center font-heading
                ${isFinished && match.winner === 'team_a' ? 'text-ut-cyan' : ''}
              `}>{match.score_team_a}</span>
              <span className="text-ut-border text-xl sm:text-2xl">:</span>
              <span className={`
                min-w-[2.5ch] sm:min-w-[3ch] text-center font-heading
                ${isFinished && match.winner === 'team_b' ? 'text-ut-cyan' : ''}
              `}>{match.score_team_b}</span>
            </div>
          ) : (
            <div className="text-sm font-black px-5 py-2.5 ut-bg border-2 border-ut-border rounded-xl text-ut-text-secondary tracking-widest uppercase font-heading">
              VS
            </div>
          )}
          
          {/* Indicateur de durée si live */}
          {isLive && (
            <span className="text-[9px] text-ut-red mt-2 animate-pulse font-bold uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3 h-3" /> En cours
            </span>
          )}
          
          {/* Score label */}
          {(isFinished || isLive) && (
            <span className="text-[9px] text-ut-text-muted mt-1.5 uppercase tracking-wider">Score</span>
          )}
        </div>

        {/* Équipe B */}
        <div className="flex flex-col items-center text-center flex-1 min-w-0 group/team-b">
          <div className={`
            w-16 h-16 sm:w-18 sm:h-18 rounded-xl flex items-center justify-center text-lg sm:text-xl font-black shadow-lg mb-2.5
            transition-all duration-300 border-2
            ${isFinished && match.winner === 'team_b' 
              ? 'bg-gradient-to-br from-ut-cyan to-blue-600 text-white border-ut-cyan scale-110 shadow-[0_0_25px_rgba(0,212,255,0.4)]' 
              : 'bg-gradient-to-br from-ut-bg to-ut-surface border-ut-border text-ut-text-secondary group-hover/team-b:border-ut-red/50 group-hover/team-b:text-white group-hover/team-b:scale-105'
            }
          `}>
            B
          </div>
          <span className={`text-xs sm:text-sm font-semibold truncate w-full transition-colors ${
            isFinished && match.winner === 'team_b' ? 'text-ut-cyan font-heading' : 'text-white'
          }`}>
            Équipe B
          </span>
          {isFinished && match.winner === 'team_b' && (
            <Trophy className="w-5 h-5 text-ut-gold mt-1.5 animate-bounce-in" />
          )}
        </div>
      </div>

      {/* ═══ Lieu du match ═══ */}
      {match.location && (
        <div className="px-6 pb-4 flex items-center gap-1.5 text-[11px] text-ut-text-secondary font-medium">
          <MapPin className="w-3.5 h-3.5 text-ut-green flex-shrink-0" />
          <span className="truncate">{match.location}</span>
        </div>
      )}

      {/* ═══ Section extensible - Composition & Buts style UT ═══ */}
      {(match.lineups.length > 0 || match.goals.length > 0) && (
        <div className="border-t border-ut-border/20">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-6 py-3.5 bg-ut-bg/20 hover:bg-ut-bg/40 flex items-center justify-center gap-2 text-[11px] font-bold text-ut-text-secondary uppercase tracking-wider transition-all duration-200 group"
          >
            {isExpanded ? (
              <>
                Masquer les détails <ChevronUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
              </>
            ) : (
              <>
                Voir la composition 
                {match.goals.length > 0 && (
                  <span className="ml-1 text-ut-cyan">({match.goals.length} but{match.goals.length > 1 ? 's' : ''})</span>
                )}
                <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
              </>
            )}
          </button>

          {isExpanded && (
            <div className="bg-ut-bg/40 px-6 py-5 border-t border-ut-border/20 space-y-5 animate-scale-in">
              
              {/* Composition des équipes */}
              {match.lineups.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {/* Équipe A */}
                  <div>
                    <p className="font-bold text-ut-cyan text-[11px] uppercase tracking-wider mb-2.5 flex items-center gap-2 font-heading">
                      <Users className="w-4 h-4" />
                      Équipe A
                      <span className="text-ut-text-muted font-normal normal-case">{joueursEquipeA.length} joueurs</span>
                    </p>
                    <div className="space-y-1.5">
                      {joueursEquipeA.map((j) => (
                        <div key={j.player_id} className="flex items-center gap-2.5 text-xs text-white/90 hover:text-white transition-colors py-1.5 px-2.5 rounded-lg hover:bg-ut-surface/50 group/player">
                          <div className="w-7 h-7 rounded-md bg-ut-cyan/10 border border-ut-cyan/25 flex items-center justify-center text-[9px] font-bold text-ut-cyan group-hover/player:bg-ut-cyan/20 transition-colors">
                            {(j.player_name || '?')[0]}
                          </div>
                          <span className="truncate font-medium">{j.player_name}</span>
                          {j.player_photo && (
                            <img src={j.player_photo} alt="" className="w-5 h-5 rounded-md object-cover ml-auto opacity-70" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Équipe B */}
                  <div>
                    <p className="font-bold text-ut-red text-[11px] uppercase tracking-wider mb-2.5 flex items-center gap-2 font-heading">
                      <Users className="w-4 h-4" />
                      Équipe B
                      <span className="text-ut-text-muted font-normal normal-case">{joueursEquipeB.length} joueurs</span>
                    </p>
                    <div className="space-y-1.5">
                      {joueursEquipeB.map((j) => (
                        <div key={j.player_id} className="flex items-center gap-2.5 text-xs text-white/90 hover:text-white transition-colors py-1.5 px-2.5 rounded-lg hover:bg-ut-surface/50 group/player">
                          <div className="w-7 h-7 rounded-md bg-ut-red/10 border border-ut-red/25 flex items-center justify-center text-[9px] font-bold text-ut-red group-hover/player:bg-ut-red/20 transition-colors">
                            {(j.player_name || '?')[0]}
                          </div>
                          <span className="truncate font-medium">{j.player_name}</span>
                          {j.player_photo && (
                            <img src={j.player_photo} alt="" className="w-5 h-5 rounded-md object-cover ml-auto opacity-70" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Buts détaillés - Style Timeline UT */}
              {match.goals.length > 0 && (
                <div className="pt-4 border-t border-ut-border/20">
                  <p className="font-bold text-ut-gold text-[11px] uppercase tracking-wider mb-3.5 flex items-center gap-2 font-heading">
                    <Trophy className="w-4 h-4" />
                    Buts du match ({match.goals.length})
                  </p>
                  
                  <div className="space-y-2">
                    {match.goals.map((goal) => (
                      <div key={goal.id} className="flex items-center gap-3 text-xs p-2.5 rounded-xl hover:bg-ut-surface/50 transition-all duration-200 group/goal border border-transparent hover:border-ut-border/40">
                        
                        {/* Minute style badge UT */}
                        <div className="font-mono font-bold bg-ut-cyan/10 border border-ut-cyan/25 text-ut-cyan w-10 py-1.5 rounded-lg text-center shrink-0 font-heading">
                          {goal.minute}'
                        </div>
                        
                        {/* Icône but */}
                        <Trophy className="w-4 h-4 text-ut-gold shrink-0" />
                        
                        {/* Buteur & Passeur */}
                        <div className="flex-1 min-w-0 flex items-center gap-2">
                          <span className="font-semibold text-white truncate group-hover/goal:text-ut-cyan transition-colors">
                            {goal.scorer_name}
                          </span>
                          
                          {goal.assist_name && (
                            <span className="text-ut-text-muted text-[11px] truncate">
                              (passe de <span className="text-ut-text-secondary font-medium">{goal.assist_name}</span>)
                            </span>
                          )}
                        </div>
                        
                        {/* Type de but badge */}
                        {goal.goal_type !== 'normal' && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-red-500/10 text-ut-red border border-red-500/25 px-2 py-1 rounded-md shrink-0">
                            {goal.goal_type}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Décoration coin pour card LIVE */}
      {isLive && (
        <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-28 h-28 bg-ut-red/20 rounded-full blur-2xl animate-pulse" />
        </div>
      )}

      {/* Shine effect overlay */}
      <div className="absolute inset-0 pointer-events-none ut-card-shine opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundSize: '200% 100%' }} />
    </div>
  );
});

MatchCard.displayName = 'MatchCard';
