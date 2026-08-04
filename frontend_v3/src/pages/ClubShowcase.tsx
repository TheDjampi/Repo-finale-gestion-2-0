import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, LogIn, Shield, User } from 'lucide-react';
import { api } from '../lib/api';
import PublicNavbar from '../components/PublicNavbar';

interface ClubDetail {
  id: number;
  name: string;
  motto: string | null;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  cover_urls: string[] | null;
  primary_color: string;
}

interface PublicMember {
  id: number;
  first_name: string;
  last_name: string;
  position: string | null;
  photo_url: string | null;
  goals: number;
  matches: number;
}

export default function ClubShowcase() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [coverIndex, setCoverIndex] = useState(0);

  const { data: club } = useQuery({
    queryKey: ['club', clubId],
    queryFn: async () => (await api.get<ClubDetail>(`/clubs/${clubId}`)).data,
  });

  const { data: members } = useQuery({
    queryKey: ['club-public-members', clubId],
    queryFn: async () => (await api.get<PublicMember[]>(`/clubs/${clubId}/members`)).data,
  });

  const count = members?.length ?? 0;
  const coverImages = useMemo(() => {
    if (club?.cover_urls?.length) return club.cover_urls;
    if (club?.cover_url) return [club.cover_url];
    return [];
  }, [club]);

  useEffect(() => {
    if (coverImages.length <= 1) return;
    const interval = window.setInterval(() => {
      setCoverIndex((current) => (current + 1) % coverImages.length);
    }, 3500);

    return () => window.clearInterval(interval);
  }, [coverImages.length]);

  function go(i: number) {
    if (!count) return;
    setActive(((i % count) + count) % count);
  }

  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen bg-ut-bg text-white">
        {/* Cover */}
        <div className="relative h-64 sm:h-80 overflow-hidden">
          {coverImages.length > 0 ? (
            <img
              key={coverImages[coverIndex]}
              src={coverImages[coverIndex]}
              alt=""
              className="w-full h-full object-cover transition-opacity duration-700"
            />
          ) : (
            <div
              className="w-full h-full"
              style={{ background: `linear-gradient(135deg, ${club?.primary_color ?? '#00D4FF'}33, #0A0E17)` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ut-bg via-ut-bg/60 to-transparent" />
          <button
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 flex items-center gap-1.5 text-xs font-semibold bg-ut-bg/70 backdrop-blur px-3 py-2 rounded-lg hover:bg-ut-bg transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Retour
          </button>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-ut-surface border border-ut-border flex items-center justify-center shrink-0 overflow-hidden">
                {club?.logo_url ? <img src={club.logo_url} alt="" className="w-full h-full object-cover" /> : <Shield className="w-7 h-7 text-ut-cyan" />}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">{club?.name}</h1>
                {club?.motto && <p className="text-sm text-ut-text-secondary italic">"{club.motto}"</p>}
              </div>
            </div>
            <button
              onClick={() => navigate(`/clubs/${clubId}`)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold bg-ut-cyan text-ut-bg px-4 py-2.5 rounded-lg hover:brightness-110 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" /> Se connecter à ce club
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-10">
          {club?.description && <p className="text-sm text-ut-text-secondary mb-10 max-w-2xl">{club.description}</p>}

          <h2 className="text-lg font-bold font-heading mb-6">Effectif public</h2>

          {count > 0 ? (
            <div className="flex flex-col items-center">
              {/* Carrousel horizontal 3D */}
              <div className="relative w-full h-72 flex items-center justify-center" style={{ perspective: '1200px' }}>
                <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
                  {members!.map((m, i) => {
                    let diff = i - active;
                    if (diff > count / 2) diff -= count;
                    if (diff < -count / 2) diff += count;
                    const isActive = diff === 0;
                    return (
                      <div
                        key={m.id}
                        onClick={() => go(i)}
                        className="absolute top-1/2 left-1/2 w-44 -mt-28 -ml-22 transition-all duration-500 ease-out cursor-pointer"
                        style={{
                          transform: `translateX(${diff * 120}px) translateZ(${isActive ? 0 : -150}px) scale(${isActive ? 1 : 0.8})`,
                          opacity: Math.abs(diff) > 2 ? 0 : 1 - Math.abs(diff) * 0.25,
                          zIndex: 10 - Math.abs(diff),
                        }}
                      >
                        <div className={`bg-ut-surface border rounded-2xl p-4 flex flex-col items-center text-center ${isActive ? 'border-ut-cyan shadow-[0_0_25px_rgba(0,212,255,0.25)]' : 'border-ut-border'}`}>
                          <div className="w-16 h-16 rounded-xl bg-ut-bg border border-ut-border flex items-center justify-center mb-2 overflow-hidden">
                            {m.photo_url ? <img src={m.photo_url} alt="" className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-ut-text-muted" />}
                          </div>
                          <p className="font-semibold text-sm truncate w-full">{m.first_name} {m.last_name}</p>
                          <p className="text-[11px] text-ut-text-muted truncate w-full">{m.position ?? 'Poste non défini'}</p>
                          {isActive && (
                            <div className="flex gap-3 mt-2 text-[11px] text-ut-text-secondary">
                              <span>{m.goals} buts</span><span>{m.matches} matchs</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button onClick={() => go(active - 1)} className="w-9 h-9 rounded-lg bg-ut-surface border border-ut-border flex items-center justify-center hover:border-ut-cyan/50 transition-all">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => go(active + 1)} className="w-9 h-9 rounded-lg bg-ut-surface border border-ut-border flex items-center justify-center hover:border-ut-cyan/50 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-ut-text-muted">Aucun profil public pour ce club pour l'instant.</p>
          )}

          <button
            onClick={() => navigate(`/clubs/${clubId}`)}
            className="sm:hidden w-full mt-8 flex items-center justify-center gap-1.5 text-xs font-bold bg-ut-cyan text-ut-bg px-4 py-3 rounded-lg"
          >
            <LogIn className="w-3.5 h-3.5" /> Se connecter à ce club <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>
  );
}
