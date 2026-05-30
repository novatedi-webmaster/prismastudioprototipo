import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Mail, MailOpen, Archive, Trash2, Search, 
  Filter, Check, Clock, User, Phone, Tag, Calendar, ChevronRight, Inbox as InboxIcon,
  ArchiveRestore
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

// Type Definitions
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  body: string;
  category: 'General' | 'Citas' | 'Obras' | 'Presupuesto' | 'Prensa';
  date: string;
  unread: boolean;
  archived: boolean;
}

// Initial Mock Messages
const initialMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Elena Rostova',
    email: 'elena.rostova@galerierust.com',
    phone: '+34 612 894 332',
    subject: 'Consulta sobre adquisición de "Maternidad II"',
    body: 'Estimado Antonio,\n\nEscribo desde la Galerie Rust en Ginebra. Uno de nuestros coleccionistas privados está sumamente interesado en su obra "Maternidad II" de bronce fundido. Quisiéramos saber si la pieza sigue disponible para adquisición, los plazos de envío y si tiene certificado de autenticidad emitido por su taller.\n\nAtentamente,\nElena Rostova',
    category: 'Obras',
    date: '2026-05-30T10:15:00Z',
    unread: true,
    archived: false
  },
  {
    id: 'msg-2',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@ayto-madrid.es',
    phone: '+34 915 881 000',
    subject: 'Propuesta de monumento urbano para plaza pública',
    body: 'Hola Sr. Carballo,\n\nNos ponemos en contacto del Área de Obras y Equipamientos del Ayuntamiento para evaluar la viabilidad de una escultura monumental en bronce para una rotonda rehabilitada en el norte de Madrid. Adjunto los planos preliminares del espacio. Nos encantaría agendar una cita previa en su taller para discutir presupuestos y plazos.\n\nSaludos cordiales,\nCarlos Mendoza',
    category: 'Presupuesto',
    date: '2026-05-29T16:45:00Z',
    unread: true,
    archived: false
  },
  {
    id: 'msg-3',
    name: 'Dr. Alejandro Ortiz',
    email: 'a.ortiz.neuro@gmail.com',
    phone: '+34 655 431 298',
    subject: 'Solicitud de visita al taller el próximo sábado',
    body: 'Buenas tardes Antonio. Sigo de cerca tu trabajo en piedra caliza y mármol de Carrara. Me gustaría visitar tu taller este sábado 6 de junio por la mañana si tu agenda lo permite, con el fin de ver tus últimas creaciones en persona para mi colección clínica.\n\nUn saludo,\nAlejandro Ortiz',
    category: 'Citas',
    date: '2026-05-28T09:30:00Z',
    unread: false,
    archived: false
  },
  {
    id: 'msg-4',
    name: 'Miriam G. Góngora',
    email: 'miriam@elcultural-arte.es',
    phone: '+34 600 781 122',
    subject: 'Entrevista para suplemento semanal El Cultural',
    body: 'Estimado maestro, estamos coordinando un reportaje especial sobre escultores españoles contemporáneos que mantienen viva la talla directa en piedra. Sería un honor poder entrevistarlo y tomar un breve fotorreportaje en su taller durante los primeros días de junio.\n\nEspero sus comentarios,\nMiriam',
    category: 'Prensa',
    date: '2026-05-25T11:00:00Z',
    unread: false,
    archived: false
  },
  {
    id: 'msg-5',
    name: 'Ruiz de Gaona S.L.',
    email: 'compras@ruizdegaonapatrimonio.com',
    phone: '+34 944 231 454',
    subject: 'Restauración de relieves en madera noble',
    body: 'Estimado Antonio, nos han recomendado su maestría en el trabajo de madera de olivo y roble. Disponemos de un relieve del siglo XVIII que requiere restauración y reintegración de volúmenes en algunas figuras. Queríamos consultar si realiza trabajos de esta índole y un presupuesto aproximado.\n\nAtentamente,\nOficina de compras',
    category: 'General',
    date: '2026-05-24T14:20:00Z',
    unread: false,
    archived: true
  }
];

// Helper to persist messages state in sessionStorage for the prototype
const SESSION_KEY = 'prisma_inbox_messages';

export default function InboxManager() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : initialMessages;
  });

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'archived'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Sync state with URL parameter if any
  useEffect(() => {
    if (id) {
      setSelectedId(id);
      // Mark as read automatically when opened via URL
      setMessages(prev => {
        const updated = prev.map(m => m.id === id ? { ...m, unread: false } : m);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
        return updated;
      });
      // Emit custom event to notify Sidebar unread count to update asynchronously
      setTimeout(() => {
        window.dispatchEvent(new Event('inbox-updated'));
      }, 0);
    }
  }, [id]);

  const saveToStorage = (updated: ContactMessage[]) => {
    setMessages(updated);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    // Emit custom event to notify Sidebar unread count to update asynchronously
    setTimeout(() => {
      window.dispatchEvent(new Event('inbox-updated'));
    }, 0);
  };

  // Filter messages
  const filteredMessages = messages.filter(m => {
    const matchesSearch = 
      m.name.toLowerCase().includes(search.toLowerCase()) || 
      m.subject.toLowerCase().includes(search.toLowerCase()) || 
      m.body.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = 
      filterType === 'all' ? !m.archived :
      filterType === 'unread' ? m.unread && !m.archived :
      m.archived; // archived

    const matchesCategory = 
      filterCategory === 'all' ? true : m.category === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  const selectedMessage = messages.find(m => m.id === selectedId);

  // Actions
  const handleSelect = (msgId: string) => {
    navigate(`/inbox/${msgId}`);
  };

  const toggleUnread = (msgId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = messages.map(m => m.id === msgId ? { ...m, unread: !m.unread } : m);
    saveToStorage(updated);
    toast.success(updated.find(m => m.id === msgId)?.unread ? 'Mensaje marcado como no leído.' : 'Mensaje marcado como leído.');
  };

  const toggleArchive = (msgId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = messages.map(m => m.id === msgId ? { ...m, archived: !m.archived } : m);
    saveToStorage(updated);
    const item = updated.find(m => m.id === msgId);
    toast.success(item?.archived ? 'Mensaje archivado.' : 'Mensaje recuperado de la bandeja.');
    if (selectedId === msgId) {
      navigate('/inbox');
      setSelectedId(null);
    }
  };

  const handleDelete = (msgId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm('¿Seguro que deseas eliminar este mensaje de forma permanente?')) {
      const updated = messages.filter(m => m.id !== msgId);
      saveToStorage(updated);
      toast.success('Mensaje eliminado.');
      if (selectedId === msgId) {
        navigate('/inbox');
        setSelectedId(null);
      }
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getCategoryBadgeClass = (category: string) => {
    switch(category) {
      case 'Obras': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'Presupuesto': return 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20';
      case 'Citas': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'Prensa': return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
      default: return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20';
    }
  };

  return (
    <div className="h-[calc(100vh-130px)] flex flex-col md:flex-row gap-5 -m-6 overflow-hidden">
      {/* LEFT LIST PANEL */}
      <div className="w-full md:w-[400px] lg:w-[450px] border-r bg-background flex flex-col shrink-0">
        
        {/* HEADER & FILTERS */}
        <div className="p-4 border-b space-y-3 shrink-0 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <InboxIcon size={18} className="text-violet-500" />
              <h1 className="font-extrabold text-base tracking-tight">Mensajes</h1>
            </div>
            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-bold">
              {messages.filter(m => m.unread && !m.archived).length} No leídos
            </Badge>
          </div>

          {/* SEARCH */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
            <Input 
              placeholder="Buscar remitente, asunto..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* QUICK TYPE TABS */}
          <div className="grid grid-cols-3 gap-1 p-0.5 bg-muted rounded-lg text-[11px] font-bold">
            <button 
              onClick={() => { setFilterType('all'); setSelectedId(null); navigate('/inbox'); }}
              className={`py-1.5 rounded-md transition-all ${filterType === 'all' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Recibidos
            </button>
            <button 
              onClick={() => { setFilterType('unread'); setSelectedId(null); navigate('/inbox'); }}
              className={`py-1.5 rounded-md transition-all ${filterType === 'unread' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              No Leídos
            </button>
            <button 
              onClick={() => { setFilterType('archived'); setSelectedId(null); navigate('/inbox'); }}
              className={`py-1.5 rounded-md transition-all ${filterType === 'archived' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Archivados
            </button>
          </div>

          {/* CATEGORIES DROPDOWN */}
          <div className="flex items-center gap-2 text-xs">
            <Filter size={12} className="text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">Categoría:</span>
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="grow bg-transparent border-none focus:outline-none focus:ring-0 text-xs font-bold text-foreground cursor-pointer"
            >
              <option value="all">Todas las categorías</option>
              <option value="Obras">Obras / Adquisiciones</option>
              <option value="Presupuesto">Presupuestos / Proyectos</option>
              <option value="Citas">Citas / Visitas Taller</option>
              <option value="Prensa">Prensa / Reportajes</option>
              <option value="General">General / Dudas</option>
            </select>
          </div>
        </div>

        {/* MESSAGES LIST */}
        <div className="grow overflow-y-auto divide-y">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12 px-4 text-muted-foreground space-y-2">
              <Mail className="mx-auto text-muted-foreground/30 h-10 w-10 stroke-[1.5]" />
              <p className="text-xs font-semibold">No se encontraron mensajes</p>
              <p className="text-[10px] text-muted-foreground/70">Intenta cambiar los filtros o realizar otra búsqueda.</p>
            </div>
          ) : (
            filteredMessages.map((m) => {
              const isSelected = m.id === selectedId;
              return (
                <div
                  key={m.id}
                  onClick={() => handleSelect(m.id)}
                  className={`p-4 cursor-pointer text-left transition-all relative ${
                    isSelected 
                      ? 'bg-muted/80 border-l-4 border-violet-500' 
                      : m.unread 
                        ? 'bg-violet-500/[0.02] hover:bg-muted/30 border-l-4 border-amber-500/60' 
                        : 'hover:bg-muted/30 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-xs truncate ${m.unread ? 'font-black text-foreground' : 'font-semibold text-muted-foreground'}`}>
                      {m.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0 font-medium">
                      {formatDate(m.date)}
                    </span>
                  </div>

                  <p className={`text-xs truncate mt-1 ${m.unread ? 'font-bold text-foreground' : 'text-zinc-600 dark:text-zinc-400'}`}>
                    {m.subject}
                  </p>

                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1.5 leading-snug">
                    {m.body}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="outline" className={`text-[9px] px-1.5 py-0.5 font-bold ${getCategoryBadgeClass(m.category)}`}>
                      {m.category}
                    </Badge>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Interactive utility actions */}
                      <button 
                        onClick={(e) => toggleUnread(m.id, e)} 
                        title={m.unread ? "Marcar como leído" : "Marcar como no leído"}
                        className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                      >
                        {m.unread ? <MailOpen size={12} /> : <Mail size={12} />}
                      </button>
                    </div>
                  </div>

                  {m.unread && (
                    <div className="absolute right-4 bottom-4 w-2 h-2 rounded-full bg-amber-500" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT DETAIL PANEL */}
      <div className="grow bg-background flex flex-col min-w-0">
        {selectedMessage ? (
          <div className="grow flex flex-col h-full overflow-hidden">
            {/* ACTION BAR */}
            <div className="p-4 border-b flex items-center justify-between shrink-0 bg-muted/10">
              <div className="flex items-center gap-1.5">
                <Button 
                  variant="outline" 
                  size="xs" 
                  onClick={() => toggleUnread(selectedMessage.id)}
                  className="text-xs h-8"
                >
                  {selectedMessage.unread ? <MailOpen size={14} className="mr-1.5" /> : <Mail size={14} className="mr-1.5" />}
                  {selectedMessage.unread ? 'Leído' : 'No Leído'}
                </Button>

                <Button 
                  variant="outline" 
                  size="xs" 
                  onClick={() => toggleArchive(selectedMessage.id)}
                  className="text-xs h-8"
                >
                  {selectedMessage.archived ? <ArchiveRestore size={14} className="mr-1.5" /> : <Archive size={14} className="mr-1.5" />}
                  {selectedMessage.archived ? 'Recuperar' : 'Archivar'}
                </Button>

                <Button 
                  variant="outline" 
                  size="xs" 
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="text-xs h-8 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 size={14} className="mr-1.5" />
                  Eliminar
                </Button>
              </div>

              {/* REPLY BUTTON */}
              <a 
                href={`mailto:${selectedMessage.email}?subject=RE: ${encodeURIComponent(selectedMessage.subject)}`}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-semibold h-8 px-3 transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Responder por Email
              </a>
            </div>

            {/* MESSAGE METADATA */}
            <div className="p-6 border-b bg-muted/5 space-y-4 shrink-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-extrabold tracking-tight">{selectedMessage.subject}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={`text-[10px] px-2 py-0.5 font-extrabold ${getCategoryBadgeClass(selectedMessage.category)}`}>
                      {selectedMessage.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={12} />
                      {formatDate(selectedMessage.date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sender Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 border rounded-xl bg-background/50">
                <div className="flex items-center gap-2 text-xs">
                  <User size={13} className="text-muted-foreground shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-muted-foreground leading-none">Remitente</p>
                    <p className="font-bold truncate mt-1">{selectedMessage.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Mail size={13} className="text-muted-foreground shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-muted-foreground leading-none">Email</p>
                    <a href={`mailto:${selectedMessage.email}`} className="font-bold text-violet-500 hover:underline truncate mt-1 block">
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Phone size={13} className="text-muted-foreground shrink-0" />
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-muted-foreground leading-none">Teléfono</p>
                    <p className="font-bold truncate mt-1">{selectedMessage.phone || 'No provisto'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* BODY TEXT */}
            <div className="grow overflow-y-auto p-6 text-left">
              <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                {selectedMessage.body}
              </div>
            </div>
          </div>
        ) : (
          <div className="grow flex items-center justify-center p-6 text-muted-foreground">
            <div className="text-center space-y-3 max-w-sm">
              <div className="p-4 bg-muted/40 rounded-full w-16 h-16 flex items-center justify-center mx-auto border border-dashed">
                <Mail className="text-muted-foreground/40 h-8 w-8 stroke-[1.5]" />
              </div>
              <p className="text-xs font-extrabold text-foreground">Ningún mensaje seleccionado</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Selecciona un mensaje de la bandeja de entrada para leer su contenido, responder o gestionarlo.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
