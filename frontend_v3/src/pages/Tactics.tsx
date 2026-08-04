import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Sparkles, RefreshCw, LayoutGrid, ShieldAlert, Plus, Check, X, Zap, Gamepad2, Target, Settings, ChevronRight, Lock } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { UserResponse } from '../types/api';

type FormationType = '4-3-3' | '4-4-2' | '3-5-2';

interface TacticalSlot {
  id: string;
  role: string;
  top: string;
  left: string;
  player?: {
    id: number;
    name: string;
    number: number;
    photo?: string;
  };
}

const FORMATIONS: Record<FormationType, TacticalSlot[]> = {
  '4-3-3': [
    { id: 'gk', role: 'G', top: '88%', left: '50%' },
    { id: 'lb', role: 'DG', top: '70%', left: '15%' },
    { id: 'cb1', role: 'DC', top: '72%', left: '38%' },
    { id: 'cb2', role: 'DC', top: '72%', left: '62%' },
    { id: 'rb', role: 'DD', top: '70%', left: '85%' },
    { id: 'cdm', role: 'MDC', top: '50%', left: '50%' },
    { id: 'cm1', role: 'MC', top: '38%', left: '32%' },
    { id: 'cm2', role: 'MC', top: '38%', left: '68%' },
    { id: 'lw', role: 'AG', top: '18%', left: '20%' },
    { id: 'st', role: 'BU', top: '12%', left: '50%' },
    { id: 'rw', role: 'AD', top: '18%', left: '80%' },
  ],
  '4-4-2': [
    { id: 'gk', role: 'G', top: '88%', left: '50%' },
    { id: 'lb', role: 'DG', top: '70%', left: '15%' },
    { id: 'cb1', role: 'DC', top: '72%', left: '38%' },
    { id: 'cb2', role: 'DC', top: '72%', left: '62%' },
    { id: 'rb', role: 'DD', top: '70%', left: '85%' },
    { id: 'lm', role: 'MG', top: '42%', left: '18%' },
    { id: 'cm1', role: 'MC', top: '45%', left: '38%' },
    { id: 'cm2', role: 'MC', top: '45%', left: '62%' },
    { id: 'rm', role: 'MD', top: '42%', left: '82%' },
    { id: 'st1', role: 'BU', top: '15%', left: '35%' },
    { id: 'st2', role: 'BU', top: '15%', left: '65%' },
  ],
  '3-5-2': [
    { id: 'gk', role: 'G', top: '88%', left: '50%' },
    { id: 'cb1', role: 'DC', top: '74%', left: '25%' },
    { id: 'cb2', role: 'DC', top: '76%', left: '50%' },
    { id: 'cb3', role: 'DC', top: '74%', left: '75%' },
    { id: 'lwb', role: 'PG', top: '45%', left: '12%' },
    { id: 'cdm1', role: 'MDC', top: '52%', left: '36%' },
    { id: 'cdm2', role: 'MDC', top: '52%', left: '64%' },
    { id: 'rwb', role: 'PD', top: '45%', left: '88%' },
    { id: 'cam', role: 'MOC', top: '32%', left: '50%' },
    { id: 'st1', role: 'BU', top: '14%', left: '35%' },
    { id: 'st2', role: 'BU', top: '14%', left: '65%' },
  ],
};

export default function Tactics() {
  const { user } = useAuth();
  const clubId = user?.memberships?.[0]?.club_id ?? 1;
  const isAdmin = user?.role === 'admin';

  const { data: clubPlayers } = useQuery({
    queryKey: ['club-players', clubId],
    queryFn: async () => (await api.get<UserResponse[]>(`/players/club/${clubId}`)).data,
  });

  const players = (clubPlayers ?? []).map((p, index) => ({
    id: p.id,
    name: `${p.first_name} ${p.last_name.charAt(0)}.`,
    number: index + 1,
    position: p.position ?? 'Non défini',
  }));

  const [selectedFormation, setSelectedFormation] = useState<FormationType>('4-3-3');
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const slots = FORMATIONS[selectedFormation];

  return (
    <div className="space-y-6 opacity-0 animate-pitch-entry">
      
      {/* ═══ Header - Style UT ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-4 font-heading">
            <span className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <LayoutGrid className="w-7 h-7 text-cyan-400" />
            </span>
            Tableau Noir Tactique
          </h1>
          <p className="text-ut-text-secondary text-sm mt-2">Préparez le schéma de jeu officiel d'avant-match.</p>
        </div>

        {/* Stats formations */}
        <div className="flex items-center gap-3 text-xs text-ut-text-secondary">
          <span className="px-3 py-2 rounded-lg ut-surface border border-ut-border">3 dispositifs</span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            {players.length} joueurs
          </span>
        </div>
      </div>

      {/* ═══ Sélecteur de formation - Style Tabs UT ═══ */}
      <div className="ut-surface/80 border border-ut-border/60 backdrop-blur-md p-1.5 rounded-xl flex gap-1 self-start">
        {(['4-3-3', '4-4-2', '3-5-2'] as FormationType[]).map((fmt) => (
          <button
            key={fmt}
            onClick={() => setSelectedFormation(fmt)}
            className={`
              relative px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide 
              transition-all duration-300 overflow-hidden group
              ${selectedFormation === fmt
                ? 'bg-ut-bg text-ut-cyan border border-ut-border shadow-[0_0_20px_rgba(0,212,255,0.2)]'
                : 'text-ut-text-secondary hover:text-white hover:bg-ut-bg/50'
              }
            `}
          >
            {selectedFormation === fmt && (
              <div className="absolute inset-0 bg-gradient-to-r from-ut-cyan/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
            )}
            {fmt}
            {/* Badge "populaire" pour 4-3-3 */}
            {fmt === '4-3-3' && (
              <span className="ml-2 text-[9px] bg-ut-gold/20 text-ut-gold px-2 py-0.5 rounded font-bold">POP</span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* ═══ TERRAIN TACTIQUE (2 colonnes sur grand écran) - Style UT ═══ */}
        <div className="lg:col-span-2 ut-card/80 border border-ut-border/60 backdrop-blur-md rounded-2xl p-5 sm:p-6 relative overflow-hidden">
          
          {/* Label du terrain */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base flex items-center gap-2 text-cyan-400 font-heading">
              <Sparkles className="w-5 h-5" /> 
              Terrain de Jeu
            </h3>
            <span className="text-[11px] text-ut-text-muted bg-ut-bg px-3 py-1.5 rounded-lg border border-ut-border">
              Formation : <span className="text-ut-cyan font-bold">{selectedFormation}</span>
            </span>
          </div>
          
          {/* Structure visuelle du terrain style UT */}
          <div className="relative w-full max-w-lg aspect-[3/4] sm:aspect-[4/3] bg-slate-950/80 rounded-xl border-2 border-emerald-500/25 overflow-hidden shadow-[inset_0_0_40px_rgba(34,197,94,0.08)]">
            
            {/* Lignes du terrain (CSS overlay) */}
            <div className="absolute inset-0 pointer-events-none opacity-25">
              {/* Ligne médiane */}
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-emerald-400 -translate-y-1/2" />
              {/* Cercle central */}
              <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-emerald-400 rounded-full -translate-x-1/2 -translate-y-1/2" />
              {/* Surface réparation Haut */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-52 h-18 border-b-2 border-x-2 border-emerald-400 rounded-b-lg" />
              {/* Surface réparation Bas */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-52 h-18 border-t-2 border-x-2 border-emerald-400 rounded-t-lg" />
              
              {/* Point de penalty */}
              <div className="absolute top-[22%] left-1/2 w-2 h-2 rounded-full bg-emerald-400 -translate-x-1/2" />
              <div className="absolute bottom-[22%] left-1/2 w-2 h-2 rounded-full bg-emerald-400 -translate-x-1/2" />
              
              {/* Zones colorées subtiles */}
              <div className="absolute top-0 left-0 right-0 h-[18%] bg-emerald-500/5" /> {/* Surface adverse */}
              <div className="absolute bottom-0 left-0 right-0 h-[18%] bg-emerald-500/5" /> {/* Surface domicile */}
            </div>

            {/* Placement des joueurs sur le terrain style UT tokens */}
            {slots.map((slot) => {
              const isSelected = selectedPlayerId !== null; // Simplifié pour la démo
              const isGoalkeeper = slot.role === 'G';
              
              return (
                <div
                  key={slot.id}
                  onClick={() => isAdmin && null /* Toggle sélection */}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-all duration-300 hover:z-10 ${isAdmin ? 'cursor-pointer' : 'cursor-default'}`}
                  style={{ top: slot.top, left: slot.left }}
                >
                  {/* Jeton Joueur / Poste style UT */}
                  <div className={`
                    w-12 h-12 sm:w-13 sm:h-13 rounded-xl bg-slate-900/90 border-2 flex items-center justify-center 
                    text-ut-cyan font-black text-sm shadow-lg transition-all duration-300
                    ${isGoalkeeper ? 'border-red-400 text-red-400' : 'border-ut-cyan'}
                    group-hover:scale-110 group-hover:border-ut-green group-hover:text-ut-green
                    group-hover:shadow-[0_0_20px_rgba(0,255,136,0.5)]
                  `}>
                    {slot.role}
                    
                    {/* Glow au hover */}
                    <div className="absolute inset-0 rounded-xl bg-ut-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />
                  </div>
                  
                  {/* Label du poste */}
                  <span className="mt-1.5 bg-slate-900/95 text-[9px] font-bold px-2 py-1 rounded-md border border-slate-700/80 text-white whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity text-[8px]">
                    {isGoalkeeper ? 'GARDIEN' : slot.role}
                  </span>
                  
                  {/* Tooltip au hover */}
                  <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20 shadow-lg border border-slate-700">
                    {slot.role} • Clique pour assigner
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800 border-r border-b border-slate-700" />
                  </div>
                </div>
              );
            })}
            
            {/* Indicateur de sens (attaque vers le haut) */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[9px] text-emerald-400/60 opacity-50">
              <span>⬆</span> 
              <span className="uppercase tracking-wider text-[8px]">Attaque</span>
            </div>
          </div>
        </div>

        {/* ═══ SIDEBAR : Effectif disponible - Style List UT ═══ */}
        <div className="ut-card border border-ut-border/60 backdrop-blur-md rounded-2xl p-5 space-y-4">
          
          {/* Header sidebar */}
          <div className="flex items-center justify-between pb-4 border-b border-ut-border/60">
            <h3 className="font-bold text-base flex items-center gap-2 font-heading">
              <Users className="w-5 h-5 text-ut-cyan" /> 
              Effectif Disponible
            </h3>
            <span className="text-[11px] bg-ut-cyan/10 text-ut-cyan font-bold px-3 py-1.5 rounded-full border border-ut-cyan/25 font-heading">
              {players.length}
            </span>
          </div>

          <p className="text-xs text-ut-text-secondary leading-relaxed">
            Sélectionnez les joueurs pour compléter votre composition d'équipe.
          </p>

          {/* Liste des joueurs style UT cards */}
          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
            {players.map((player) => (
              <div
                key={player.id}
                onClick={() => isAdmin && setSelectedPlayerId(selectedPlayerId === player.id ? null : player.id)}
                className={`
                  p-3.5 rounded-xl border cursor-pointer transition-all duration-200 group
                  ${selectedPlayerId === player.id
                    ? 'bg-ut-cyan/10 border-ut-cyan/40 shadow-[0_0_20px_rgba(0,212,255,0.2)]'
                    : 'bg-ut-bg/50 border-ut-border/40 hover:border-ut-cyan/40 hover:bg-ut-cyan/5'
                  }
                `}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Numéro du joueur style badge UT */}
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm border
                      ${selectedPlayerId === player.id 
                        ? 'bg-ut-cyan text-white border-ut-cyan shadow-glow-sm' 
                        : 'bg-ut-surface border-ut-border text-ut-text-secondary'
                      }
                      transition-all duration-200 font-heading
                    `}>
                      #{player.number}
                    </div>
                    
                    {/* Info joueur */}
                    <div className="min-w-0">
                      <p className={`font-semibold text-sm truncate transition-colors ${selectedPlayerId === player.id ? 'text-ut-cyan' : ''}`}>
                        {player.name}
                      </p>
                      <p className="text-[10px] text-ut-text-muted truncate">{player.position}</p>
                    </div>
                  </div>
                  
                  {/* Status */}
                  <span className={`
                    text-[10px] font-medium px-2.5 py-1 rounded-md border shrink-0
                    ${selectedPlayerId === player.id
                      ? 'bg-ut-cyan/20 text-ut-cyan border-ut-cyan/30'
                      : 'bg-ut-green/10 text-ut-green border-ut-green/25'
                    }
                  `}>
                    {selectedPlayerId === player.id ? (
                      <><Check className="inline w-3 h-3 mr-1" /> Sélectionné</>
                    ) : (
                      <><Users className="inline w-3 h-3 mr-1" /> Disponible</>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bouton action style UT — réservé à l'admin du club */}
          {isAdmin ? (
            <button className="w-full ut-button-primary group/btn mt-4">
              <Zap className="w-4 h-4 group-hover/btn:animate-pulse" /> 
              Enregistrer la Composition
              <Check className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <div className="w-full flex items-center justify-center gap-2 mt-4 py-3 rounded-xl bg-ut-bg/50 border border-ut-border/50 text-ut-text-muted text-xs font-medium">
              <Lock className="w-3.5 h-3.5" />
              Lecture seule — seul l'admin du club peut modifier la composition
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
