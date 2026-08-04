import { Link, useNavigate } from 'react-router-dom';
import { Gamepad2, Newspaper, Swords, Users, PlusCircle, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function PublicNavbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-ut-border/60 bg-ut-bg/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 bg-ut-cyan rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,212,255,0.4)]">
            <Gamepad2 className="w-4.5 h-4.5 text-ut-bg" />
          </div>
          <div className="hidden sm:block leading-none">
            <p className="font-bold text-sm font-heading">Mon 2-0</p>
            <p className="text-[10px] text-ut-text-muted">L'univers des 2-0</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <a href="#actualites" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-ut-text-secondary hover:text-white hover:bg-ut-surface-light transition-all">
            <Newspaper className="w-3.5 h-3.5" /> Actualités
          </a>
          <a href="#historique" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-ut-text-secondary hover:text-white hover:bg-ut-surface-light transition-all">
            <Swords className="w-3.5 h-3.5" /> Historique inter-2-0
          </a>
          <button onClick={() => navigate('/profils-publics')} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-ut-text-secondary hover:text-white hover:bg-ut-surface-light transition-all">
            <Users className="w-3.5 h-3.5" /> Profils publics
          </button>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={toggleTheme} aria-label="Changer de thème" className="p-2 text-ut-text-secondary hover:text-white hover:bg-ut-surface-light rounded-lg transition-all">
            {theme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>
          <button
            onClick={() => navigate('/clubs/inscription')}
            className="flex items-center gap-1.5 text-xs font-bold bg-ut-cyan text-ut-bg px-3.5 py-2 rounded-lg hover:brightness-110 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Inscrire mon club</span>
          </button>
        </div>
      </div>
    </header>
  );
}
