import { useQuery } from '@tanstack/react-query';
import { Swords, Calendar, MapPin } from 'lucide-react';
import { api } from '../lib/api';
import PublicNavbar from '../components/PublicNavbar';

interface ChallengeHistoryItem {
  id: number;
  challenger_club_name: string;
  challenger_club_logo: string | null;
  target_club_name: string;
  target_club_logo: string | null;
  proposed_date: string;
  proposed_location: string | null;
}

export default function HistoryFull() {
  const { data: history, isLoading } = useQuery({
    queryKey: ['challenge-history-full'],
    queryFn: async () => (await api.get<ChallengeHistoryItem[]>('/challenges/history?limit=200')).data,
  });

  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen bg-ut-bg text-white px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold font-heading flex items-center gap-2 mb-1">
            <Swords className="w-6 h-6 text-ut-purple" /> Palmarès Inter-2-0
          </h1>
          <p className="text-xs text-ut-text-secondary mb-8">Toutes les confrontations acceptées entre clubs.</p>

          {isLoading && <p className="text-sm text-ut-text-muted">Chargement...</p>}

          <div className="space-y-3">
            {history?.map((h) => (
              <div key={h.id} className="ut-card-legendary flex items-center justify-between p-4">
                <span className="font-semibold text-sm">{h.challenger_club_name}</span>
                <span className="text-ut-text-muted text-xs px-3">vs</span>
                <span className="font-semibold text-sm">{h.target_club_name}</span>
                <div className="flex items-center gap-3 ml-4 text-[11px] text-ut-text-muted">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(h.proposed_date).toLocaleDateString('fr-FR')}</span>
                  {h.proposed_location && <span className="hidden sm:flex items-center gap-1"><MapPin className="w-3 h-3" />{h.proposed_location}</span>}
                </div>
              </div>
            ))}
          </div>

          {!isLoading && history?.length === 0 && (
            <p className="text-sm text-ut-text-muted">Aucune confrontation enregistrée pour l'instant.</p>
          )}
        </div>
      </div>
    </>
  );
}
