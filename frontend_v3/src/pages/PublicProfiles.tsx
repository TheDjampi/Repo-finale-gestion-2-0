import { useQuery } from '@tanstack/react-query';
import { User, Shield } from 'lucide-react';
import { api } from '../lib/api';
import PublicNavbar from '../components/PublicNavbar';

interface PublicPlayer {
  id: number;
  first_name: string;
  last_name: string;
  position: string | null;
  photo_url: string | null;
  goals: number;
  matches: number;
  club_name: string;
  club_logo: string | null;
}

export default function PublicProfiles() {
  const { data: players, isLoading } = useQuery({
    queryKey: ['public-players'],
    queryFn: async () => (await api.get<PublicPlayer[]>('/players/public')).data,
  });

  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen bg-ut-bg text-white px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold font-heading mb-1">Profils publics</h1>
          <p className="text-xs text-ut-text-secondary mb-8">Joueurs ayant choisi de rendre leur profil visible.</p>

          {isLoading && <p className="text-sm text-ut-text-muted">Chargement...</p>}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {players?.map((p) => (
              <div key={p.id} className="bg-ut-surface border border-ut-border rounded-2xl p-4 flex flex-col items-center text-center hover:border-ut-cyan/40 transition-all">
                <div className="w-16 h-16 rounded-xl bg-ut-bg border border-ut-border flex items-center justify-center mb-3 overflow-hidden">
                  {p.photo_url ? <img src={p.photo_url} alt="" className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-ut-text-muted" />}
                </div>
                <p className="font-semibold text-sm truncate w-full">{p.first_name} {p.last_name}</p>
                <p className="text-[11px] text-ut-text-muted truncate w-full">{p.position ?? 'Poste non défini'}</p>
                <div className="flex items-center gap-1 mt-2 text-[10px] text-ut-cyan">
                  <Shield className="w-3 h-3" /> {p.club_name}
                </div>
                <div className="flex gap-3 mt-2 text-[11px] text-ut-text-secondary">
                  <span>{p.goals} buts</span><span>{p.matches} matchs</span>
                </div>
              </div>
            ))}
          </div>

          {!isLoading && players?.length === 0 && (
            <p className="text-sm text-ut-text-muted">Aucun profil public pour l'instant.</p>
          )}
        </div>
      </div>
    </>
  );
}
