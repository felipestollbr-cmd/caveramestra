import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialDate?: string;
  initialTime?: string;
  eventToEdit?: any;
}

const AgendaModal = ({ isOpen, onClose, onSuccess, initialDate, initialTime, eventToEdit }: AgendaModalProps) => {
  const todayIso = new Date().toISOString().split('T')[0];
  const getDefaultTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    return `${hours}:00`;
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(initialDate || todayIso);
  const [time, setTime] = useState(initialTime || getDefaultTime());
  const [category, setCategory] = useState('Geral');
  const [duration, setDuration] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isEditing = Boolean(eventToEdit);

  useEffect(() => {
    if (eventToEdit) {
      const eventDate = new Date(eventToEdit.schedule_time);
      setTitle(eventToEdit.title || '');
      setDescription(eventToEdit.description || '');
      setDate(eventDate.toISOString().split('T')[0]);
      setTime(eventDate.toTimeString().slice(0, 5));
      setCategory(eventToEdit.category || 'Geral');
      setDuration(String(eventToEdit.duration || 1));
    } else {
      setTitle('');
      setDescription('');
      setDate(initialDate || todayIso);
      setTime(initialTime || '08:00');
      setCategory('Geral');
      setDuration('1');
    }
  }, [eventToEdit, initialDate, initialTime, todayIso]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Combina a data selecionada com o horário selecionado
      const today = date ? new Date(`${date}T${time}`) : new Date();
      const [hours, minutes] = time.split(':');
      today.setHours(parseInt(hours, 10));
      today.setMinutes(parseInt(minutes, 10));
      today.setSeconds(0);
      
      if (isEditing && eventToEdit?.id) {
        const { error: updateError } = await supabase.from('agenda').update({
          title,
          description,
          schedule_time: today.toISOString(),
          category,
          duration: parseFloat(duration),
        }).eq('id', eventToEdit.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('agenda').insert({
          user_id: user.id,
          title,
          description,
          schedule_time: today.toISOString(),
          category,
          duration: parseFloat(duration)
        });

        if (insertError) throw insertError;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError('Falha ao adicionar compromisso. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!eventToEdit?.id) return;

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.from('agenda').delete().eq('id', eventToEdit.id);
      if (error) throw error;
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError('Falha ao excluir compromisso. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarIcon className="text-caverna-accent" size={24} />
            {isEditing ? 'Editar Compromisso' : 'Novo Compromisso'}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Título do Compromisso</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-caverna-accent/50 focus:ring-1 focus:ring-caverna-accent/50 transition-all font-medium"
              placeholder="Ex: Culto Sede, Treino de Força, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5 flex items-center gap-2">
              <Clock size={16} /> Data e horário
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-caverna-accent/50 focus:ring-1 focus:ring-caverna-accent/50 transition-all font-medium"
              />
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-caverna-accent/50 focus:ring-1 focus:ring-caverna-accent/50 transition-all font-mono"
              />
            </div>
            <div className="relative mt-2">
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-caverna-accent/50 focus:ring-1 focus:ring-caverna-accent/50 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 text-xs pointer-events-none">horas</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-caverna-accent/50 focus:ring-1 focus:ring-caverna-accent/50 transition-all appearance-none"
            >
              <option value="Geral">Geral</option>
              <option value="Ritual">Ritual</option>
              <option value="Treino">Treino</option>
              <option value="Refeição">Refeição</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Descrição (Opcional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-caverna-accent/50 focus:ring-1 focus:ring-caverna-accent/50 transition-all resize-none min-h-[100px]"
              placeholder="Detalhes adicionais..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-caverna-accent text-zinc-900 font-bold py-4 rounded-xl hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Adicionar ao Dia'}
            </button>
            {isEditing && (
              <button
                type="button"
                disabled={loading}
                onClick={handleDelete}
                className="w-full bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Aguarde...' : 'Excluir Compromisso'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgendaModal;
