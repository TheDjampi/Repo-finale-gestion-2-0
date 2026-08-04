import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, PlusCircle } from 'lucide-react';
import { api } from '../lib/api';
import PublicNavbar from '../components/PublicNavbar';

export default function ClubRegisterRequest() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', motto: '', description: '', contact_name: '', contact_email: '' });
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await api.post('/clubs/request', form);
      setSent(true);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Impossible d\'envoyer la demande');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (sent) {
    return (
      <>
        <PublicNavbar />
        <div className="min-h-screen bg-ut-bg text-white flex flex-col items-center justify-center px-4 text-center">
          <CheckCircle2 className="w-12 h-12 text-ut-green mb-4" />
          <h1 className="text-xl font-bold font-heading">Demande envoyée !</h1>
          <p className="text-sm text-ut-text-secondary mt-2 max-w-sm">
            Le développeur examinera ta demande et publiera le club une fois validé.
          </p>
          <button onClick={() => navigate('/')} className="mt-6 text-xs font-semibold text-ut-cyan hover:underline">
            Retour à l'accueil
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen bg-ut-bg text-white flex flex-col items-center px-4 py-16">
        <div className="w-full max-w-md bg-ut-surface border border-ut-border rounded-2xl p-8">
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-12 h-12 bg-ut-cyan/10 border border-ut-cyan/20 rounded-xl flex items-center justify-center text-ut-cyan mb-3">
              <PlusCircle className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-bold font-heading">Inscrire mon club</h1>
            <p className="text-xs text-ut-text-secondary mt-1">Ta demande sera examinée avant publication.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-ut-red/10 border border-ut-red/30 text-ut-red text-xs font-medium rounded-xl px-4 py-3">{error}</div>}

            <input required placeholder="Nom du club" value={form.name} onChange={(e) => set('name', e.target.value)}
              className="w-full bg-ut-bg border border-ut-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-ut-cyan" />
            <input placeholder="Devise (optionnel)" value={form.motto} onChange={(e) => set('motto', e.target.value)}
              className="w-full bg-ut-bg border border-ut-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-ut-cyan" />
            <textarea placeholder="Description (optionnel)" value={form.description} onChange={(e) => set('description', e.target.value)} rows={3}
              className="w-full bg-ut-bg border border-ut-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-ut-cyan resize-none" />
            <input required placeholder="Ton nom (contact)" value={form.contact_name} onChange={(e) => set('contact_name', e.target.value)}
              className="w-full bg-ut-bg border border-ut-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-ut-cyan" />
            <input required type="email" placeholder="Ton email (contact)" value={form.contact_email} onChange={(e) => set('contact_email', e.target.value)}
              className="w-full bg-ut-bg border border-ut-border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-ut-cyan" />

            <button type="submit" disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-ut-cyan text-ut-bg text-sm font-bold hover:brightness-110 transition disabled:opacity-50">
              {isSubmitting ? 'Envoi...' : 'Envoyer la demande'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
