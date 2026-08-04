import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Calendar, Wallet, User as UserIcon, 
  ShieldCheck, LogOut, Bell, Menu, X, Trophy, Sun, Moon, 
  Zap, Home, Settings, Gamepad2, Target, Crown,
  ChevronRight, Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Gérer le scroll pour l'effet glass sur le header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items avec métadonnées enrichies style UT
  const navigation = [
    { 
      path: '/dashboard', 
      name: 'Tableau de bord', 
      icon: LayoutDashboard,
      badge: null,
      color: 'text-ut-cyan',
      bgColor: 'bg-ut-cyan/10',
      borderColor: 'border-ut-cyan/30',
      glowColor: 'hover:shadow-glow-sm'
    },
    { 
      path: '/matches', 
      name: 'Matchs', 
      icon: Calendar,
      badge: null,
      color: 'text-ut-green',
      bgColor: 'bg-ut-green/10',
      borderColor: 'border-ut-green/30',
      glowColor: 'hover:shadow-[0_0_15px_rgba(0,255,136,0.2)]'
    },
    { 
      path: '/leaderboard', 
      name: 'Classement', 
      icon: Trophy,
      badge: null,
      color: 'text-ut-gold',
      bgColor: 'bg-ut-gold/10',
      borderColor: 'border-ut-gold/30',
      glowColor: 'hover:shadow-[0_0_15px_rgba(255,215,0,0.2)]'
    },
    { 
      path: '/contributions', 
      name: 'Cotisations', 
      icon: Wallet,
      badge: null,
      color: 'text-ut-purple',
      bgColor: 'bg-ut-purple/10',
      borderColor: 'border-ut-purple/30',
      glowColor: 'hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]'
    },
    { 
      path: '/profile', 
      name: 'Mon Profil', 
      icon: UserIcon,
      badge: null,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/30',
      glowColor: 'hover:shadow-[0_0_15px_rgba(236,72,153,0.2)]'
    },
    { 
      path: '/tactics', 
      name: 'Tactiques', 
      icon: Target,
      badge: null,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      glowColor: 'hover:shadow-[0_0_15px_rgba(249,115,22,0.2)]'
    },
  ];

  // Ajouter lien admin si rôle admin
  if (user?.role === 'admin') {
    navigation.push({ 
      path: '/admin', 
      name: 'Administration', 
      icon: ShieldCheck,
      badge: null,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      glowColor: 'hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]'
    });
  }

  function handleLogout() {
    logout();
    navigate('/');
  }

  if (!user) return null;

  // Extraire les initiales pour l'avatar
  const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  
  // Calculer un niveau fictif basé sur les buts et matchs
  const userLevel = Math.floor((user.total_goals * 2 + user.matches_played) / 3) || 1;
  const xpProgress = ((user.total_goals * 2 + user.matches_played) % 3) / 3 * 100;

  return (
    <div className="min-h-screen bg-ut-bg text-white font-sans antialiased">
      
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SIDEBAR DESKTOP - Navigation latérale style UT Gaming           */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[280px] 
        glass-effect-strong
        transform lg:transform-none 
        transition-all duration-300 ease-out
        ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full lg:translate-x-0 opacity-100'}
        flex flex-col
        shadow-2xl shadow-black/40
      `}>
        
        {/* ═══ Logo & Branding - Style UT ═══ */}
        <div className="flex items-center justify-between p-5 pb-4 border-b border-ut-border/50">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/dashboard')}>
            {/* Logo avec glow animé style UT */}
            <div className="relative">
              {/* Anneau extérieur rotatif */}
              <div className="absolute inset-0 bg-gradient-to-r from-ut-cyan via-ut-purple to-ut-gold rounded-xl blur-md opacity-60 group-hover:opacity-80 transition-opacity animate-spin-slow" />
              
              {/* Container logo */}
              <div className="relative w-11 h-11 bg-gradient-to-br from-ut-surface to-ut-bg border border-ut-cyan/30 rounded-xl flex items-center justify-center font-black text-lg text-ut-cyan shadow-glow-sm overflow-hidden">
                <Gamepad2 className="w-5 h-5" />
                {/* Pattern subtil */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(0,212,255,0.3) 8px, rgba(0,212,255,0.3) 9px)`
                }} />
              </div>
            </div>
            
            <div>
              <span className="font-bold text-lg tracking-tight block leading-none font-heading">Mon 2-0</span>
              <span className="text-[10px] font-semibold text-ut-cyan tracking-widest uppercase">Platform</span>
            </div>
          </div>

          {/* Bouton fermeture mobile */}
          <button 
            className="lg:hidden text-ut-text-secondary hover:text-white hover:bg-ut-surface-light rounded-lg p-2 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ═══ Section Utilisateur Mini - Style Card UT ═══ */}
        <div className="mx-3 mb-3 p-3 rounded-xl bg-gradient-to-br from-ut-surface to-ut-bg border border-ut-border/50 relative overflow-hidden group">
          {/* Background décoratif */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-ut-cyan/5 rounded-full blur-2xl group-hover:bg-ut-cyan/10 transition-colors" />
          
          <div className="relative flex items-center gap-3">
            {/* Avatar avec anneau de niveau style UT */}
            <div className="relative w-11 h-11 shrink-0">
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r p-[2px] ${
                userLevel >= 10 ? 'from-ut-gold via-yellow-400 to-ut-gold' :
                userLevel >= 5 ? 'from-ut-purple via-purple-400 to-ut-purple' :
                'from-ut-cyan via-cyan-400 to-ut-cyan'
              }`}>
                <div className="w-full h-full rounded-xl bg-ut-bg flex items-center justify-center text-sm font-bold text-white shadow-lg overflow-hidden">
                  {user.photo_url ? (
                    <img src={user.photo_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
              </div>
              {/* Indicateur en ligne */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-ut-green rounded-full border-2 border-ut-surface shadow-[0_0_8px_rgba(0,255,136,0.6)]" />
              
              {/* Badge niveau */}
              <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black text-ut-bg border-2 border-ut-surface ${
                userLevel >= 10 ? 'bg-ut-gold' :
                userLevel >= 5 ? 'bg-ut-purple' :
                'bg-ut-cyan'
              }`}>
                {userLevel}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate group-hover:text-ut-cyan transition-colors">{user.first_name}</p>
              <p className="text-[10px] text-ut-text-secondary capitalize">{user.position || 'Joueur'}</p>
            </div>
          </div>
          
          {/* Barre XP mini style UT */}
          <div className="mt-2.5 h-1 bg-ut-bg rounded-full overflow-hidden border border-ut-border/30">
            <div 
              className="h-full rounded-full transition-all duration-1000 relative"
              style={{ 
                width: `${xpProgress}%`,
                background: `linear-gradient(90deg, ${userLevel >= 10 ? '#FFD700' : userLevel >= 5 ? '#A855F7' : '#00D4FF'}, ${userLevel >= 10 ? '#FFA500' : userLevel >= 5 ? '#7C3AED' : '#0099CC'})`,
                boxShadow: `0 0 8px ${userLevel >= 10 ? 'rgba(255,215,0,0.5)' : userLevel >= 5 ? 'rgba(168,85,247,0.5)' : 'rgba(0,212,255,0.5)'}`
              }}
            >
              <div className="absolute inset-0 bg-white/20 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
            </div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[8px] text-ut-text-muted uppercase tracking-wider">Niv. {userLevel}</span>
            <span className="text-[8px] text-ut-cyan font-medium">{Math.round(xpProgress)}% XP</span>
          </div>
        </div>

        {/* ═══ Navigation Links - Style Gaming Menu ═══ */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto overflow-x-hidden">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group overflow-hidden
                  ${isActive 
                    ? `${item.bgColor} ${item.color} ${item.borderColor} border shadow-lg` 
                    : 'text-ut-text-secondary hover:text-white hover:bg-white/[0.03] border border-transparent'
                  }
                  ${item.glowColor}
                `}
              >
                {/* Background glow au hover pour inactif */}
                {!isActive && (
                  <div className={`absolute inset-0 ${item.bgColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                )}
                
                {/* Indicateur actif - barre gauche animée style UT */}
                {isActive && (
                  <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full ${
                    item.color === 'text-ut-cyan' ? 'bg-ut-cyan shadow-[0_0_8px_rgba(0,212,255,0.6)]' :
                    item.color === 'text-ut-gold' ? 'bg-ut-gold shadow-[0_0_8px_rgba(255,215,0,0.6)]' :
                    item.color === 'text-ut-green' ? 'bg-ut-green shadow-[0_0_8px_rgba(0,255,136,0.6)]' :
                    item.color === 'text-ut-purple' ? 'bg-ut-purple shadow-[0_0_8px_rgba(168,85,247,0.6)]' :
                    'bg-current shadow-[0_0_8px_rgba(currentColor,0.6)]'
                  }`} />
                )}
                
                <Icon className={`w-5 h-5 relative z-10 transition-transform duration-200 group-hover:scale-110 ${isActive ? item.color : ''}`} />
                
                <span className="relative z-10">{item.name}</span>
                
                {/* Badge optionnel */}
                {item.badge && (
                  <span className="ml-auto relative z-10 text-xs">{item.badge}</span>
                )}
                
                {/* Flèche si actif */}
                {isActive && (
                  <ChevronRight className={`ml-auto relative z-10 w-4 h-4 ${item.color} opacity-60`} />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* ═══ Footer Sidebar - Logout & Stats ═══ */}
        <div className="p-3 border-t border-ut-border/50">
          {/* Mini stats club */}
          <div className="mb-3 p-2.5 rounded-lg bg-ut-bg/50 border border-ut-border/30">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-ut-text-muted flex items-center gap-1.5">
                <Activity className="w-3 h-3" /> Saison active
              </span>
              <span className="text-ut-gold font-bold">2026-27</span>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-ut-red/80 hover:text-ut-red hover:bg-red-500/5 rounded-xl transition-all duration-200 group border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT AREA                                              */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 lg:pl-[280px] flex flex-col min-w-0">
        
        {/* ═══ HEADER STICKY - Style UT ═══ */}
        <header className={`
          sticky top-0 z-40 h-16 lg:h-18 px-4 lg:px-6 
          flex items-center justify-between
          transition-all duration-300
          ${scrolled 
            ? 'glass-effect-strong border-b border-ut-border/50 shadow-lg shadow-black/20' 
            : 'glass-effect border-b border-ut-border/30'
          }
        `}>
          
          {/* Left section - Burger mobile + Badge saison */}
          <div className="flex items-center gap-4">
            {/* Burger menu mobile */}
            <button 
              className="lg:hidden text-ut-text-secondary hover:text-white hover:bg-ut-surface-light rounded-xl p-2.5 transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Badge Saison - Style Gaming UT */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-semibold text-ut-cyan bg-ut-cyan/10 px-3.5 py-1.5 rounded-full border border-ut-cyan/20 backdrop-blur-sm">
              <Zap className="w-3.5 h-3.5" /> 
              <span>Saison 2026-27</span>
              
              {/* Dot pulse en ligne */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ut-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-ut-green"></span>
              </span>
            </div>
          </div>

          {/* Right section - Actions utilisateur */}
          <div className="flex items-center gap-2 lg:gap-4">

            {/* Bascule thème clair/sombre */}
            <button
              onClick={toggleTheme}
              className="relative p-2.5 text-ut-text-secondary hover:text-white hover:bg-ut-surface-light rounded-xl border border-transparent hover:border-ut-border transition-all duration-200"
              aria-label="Changer de thème"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Bouton Notifications avec badge style UT */}
            <button className="relative p-2.5 text-ut-text-secondary hover:text-white hover:bg-ut-surface-light rounded-xl border border-transparent hover:border-ut-border transition-all duration-200 group">
              <Bell className="w-5 h-5 transition-transform group-hover:scale-110" />
              
              {/* Badge notification pulsant */}
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-ut-red rounded-full animate-pulse ring-2 ring-ut-surface" style={{ boxShadow: '0 0 8px rgba(255,51,102,0.6)' }} />
              
              {/* Count badge optionnel */}
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-ut-red text-[9px] font-bold text-white rounded-full px-1 shadow-[0_0_10px_rgba(255,51,102,0.4)]">
                3
              </span>
            </button>

            {/* Séparateur */}
            <div className="hidden sm:block w-px h-8 bg-ut-border/50" />

            {/* User Profile Summary - Style Mini Card UT */}
            <div className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl hover:bg-ut-surface/50 transition-all cursor-pointer group border border-transparent hover:border-ut-border/50">
              
              {/* Info texte (desktop only) */}
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold leading-none group-hover:text-ut-cyan transition-colors font-heading">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-[10px] text-ut-text-secondary mt-1 capitalize flex items-center gap-1 justify-end">
                  <Crown className="w-3 h-3 text-ut-gold" />
                  {user.role}
                </p>
              </div>
              
              {/* Avatar avec anneau gradient style UT */}
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-ut-cyan via-ut-purple to-ut-gold p-[2px]">
                  <img
                    src={user.photo_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100"}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-10 h-10 rounded-xl object-cover ut-bg"
                  />
                </div>
                
                {/* Status indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-ut-green rounded-full border-2 border-ut-surface" style={{ boxShadow: '0 0 8px rgba(0,255,136,0.6)' }} />
              </div>
            </div>
          </div>
        </header>

        {/* ═══ MAIN WORKSPACE ═══ */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto relative">
          {/* Background subtil pour le contenu style stade */}
          <div className="absolute inset-0 pointer-events-none bg-stadium opacity-50" />
          
          {/* Contenu de la page */}
          <div className="relative z-10">
            {children}
          </div>
        </main>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* OVERLAY MOBILE (quand sidebar ouverte)                          */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

    </div>
  );
}
