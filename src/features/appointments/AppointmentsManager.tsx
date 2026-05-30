import { useState } from 'react';
import { 
  Calendar as CalendarIcon, Clock, Check, X, AlertCircle, Settings, 
  ChevronLeft, ChevronRight, User, Phone, Mail, Plus, MapPin, Save
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  subject: string;
  status: 'pending' | 'confirmed';
}

const initialAppointments: Appointment[] = [
  {
    id: 'appt-1',
    name: 'Dr. Alejandro Ortiz',
    email: 'a.ortiz.neuro@gmail.com',
    phone: '+34 655 431 298',
    date: '2026-06-06',
    time: '11:00',
    subject: 'Visita de Colección Privada',
    status: 'pending'
  },
  {
    id: 'appt-2',
    name: 'Elena Rostova',
    email: 'elena.rostova@galerierust.com',
    phone: '+34 612 894 332',
    date: '2026-06-03',
    time: '16:30',
    subject: 'Firma de Contrato e Inspección de Maternidad II',
    status: 'confirmed'
  },
  {
    id: 'appt-3',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@ayto-madrid.es',
    phone: '+34 915 881 000',
    date: '2026-06-11',
    time: '10:00',
    subject: 'Reunión Proyecto Escultura de Plaza',
    status: 'confirmed'
  }
];

export default function AppointmentsManager() {
  const [activeTab, setActiveTab] = useState<'list' | 'calendar' | 'config'>('list');
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // June 2026
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-06-06');

  // Config State
  const [days, setDays] = useState({
    lunes: true,
    martes: true,
    miercoles: true,
    jueves: true,
    viernes: true,
    sabado: false,
    domingo: false
  });
  const [startTime, setStart] = useState('09:00');
  const [endTime, setEnd] = useState('18:00');
  const [slotDuration, setDuration] = useState('60');

  // New appointment form modal (simulated in line)
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDate, setNewDate] = useState('2026-06-15');
  const [newTime, setNewTime] = useState('12:00');
  const [newSubject, setNewSubject] = useState('Consulta Escultura');

  const handleConfirm = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'confirmed' } : a));
    toast.success('Cita confirmada correctamente. Se ha notificado al cliente por email.');
  };

  const handleCancel = (id: string) => {
    if (confirm('¿Deseas cancelar esta cita?')) {
      setAppointments(prev => prev.filter(a => a.id !== id));
      toast.error('Cita cancelada.');
    }
  };

  const handleSaveConfig = () => {
    toast.success('Configuración de disponibilidad guardada de forma segura.');
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return toast.error('El nombre es obligatorio.');

    const newAppt: Appointment = {
      id: `appt-gen-${Date.now()}`,
      name: newName,
      email: newEmail,
      phone: newPhone,
      date: newDate,
      time: newTime,
      subject: newSubject,
      status: 'pending'
    };

    setAppointments(prev => [...prev, newAppt]);
    setShowAddForm(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    toast.success('Nueva cita programada con éxito.');
  };

  // Calendar generation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  // Adjust so Monday is first day of the week
  const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells = [];
  for (let i = 0; i < adjustedFirstDay; i++) {
    calendarCells.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(i);
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDateStr = (dayNum: number) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(dayNum).padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
  };

  const appointmentsForSelectedDate = appointments.filter(a => a.date === selectedDateStr);

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Cita Previa</h1>
          <p className="text-xs text-muted-foreground">Gestiona las reservas de coleccionistas y visitas al taller de escultura.</p>
        </div>

        <div className="flex items-center gap-2">
          {/* NAVIGATION TABS */}
          <div className="flex bg-muted p-1 rounded-lg text-xs font-bold shrink-0">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 rounded-md transition-all ${activeTab === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Lista
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-3 py-1.5 rounded-md transition-all ${activeTab === 'calendar' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Calendario
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`px-3 py-1.5 rounded-md transition-all ${activeTab === 'config' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Horarios
            </button>
          </div>

          <Button size="sm" className="text-xs font-bold h-9" onClick={() => setShowAddForm(true)}>
            <Plus size={14} className="mr-1" />
            Nueva Cita
          </Button>
        </div>
      </div>

      {/* NEW APPOINTMENT MODAL / FORM */}
      {showAddForm && (
        <Card className="border-indigo-200 dark:border-indigo-950 bg-indigo-50/10 dark:bg-indigo-950/5">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Plus size={16} />
              Programar Nueva Cita
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAppointment} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Nombre del Solicitante</label>
                <Input size={30} value={newName} onChange={(e) => setNewName(e.target.value)} className="h-9 text-xs" placeholder="Ej. Ana de Armas" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Email</label>
                <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="h-9 text-xs" placeholder="ana@armas.com" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Teléfono</label>
                <Input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="h-9 text-xs" placeholder="+34 666 555 444" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Fecha de la Cita</label>
                <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="h-9 text-xs" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Hora de la Cita</label>
                <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="h-9 text-xs" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Motivo / Asunto</label>
                <Input value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="h-9 text-xs" placeholder="Ej. Encargo mármol" />
              </div>
              <div className="col-span-full flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm">
                  Confirmar y Guardar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* VIEW PANEL */}
      {activeTab === 'list' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/30 border-b">
                    <th className="p-4 text-left font-bold text-muted-foreground">Cliente</th>
                    <th className="p-4 text-left font-bold text-muted-foreground">Fecha y Hora</th>
                    <th className="p-4 text-left font-bold text-muted-foreground">Motivo</th>
                    <th className="p-4 text-left font-bold text-muted-foreground">Estado</th>
                    <th className="p-4 text-right font-bold text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No hay citas agendadas actualmente.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((a) => (
                      <tr key={a.id} className="hover:bg-muted/20 transition-all">
                        <td className="p-4 font-semibold">
                          <div>
                            <p className="text-foreground font-extrabold">{a.name}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{a.email} • {a.phone}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                            <CalendarIcon size={12} className="text-muted-foreground" />
                            <span>{new Date(a.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                            <span className="text-muted-foreground">|</span>
                            <Clock size={12} className="text-muted-foreground" />
                            <span>{a.time}</span>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-muted-foreground">{a.subject}</td>
                        <td className="p-4">
                          {a.status === 'confirmed' ? (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-bold">
                              Confirmada
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-bold animate-pulse">
                              Pendiente
                            </Badge>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-1.5">
                          {a.status === 'pending' && (
                            <Button size="xs" variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50" onClick={() => handleConfirm(a.id)}>
                              <Check size={12} className="mr-1" />
                              Confirmar
                            </Button>
                          )}
                          <Button size="xs" variant="outline" className="text-destructive border-rose-100 hover:bg-rose-50" onClick={() => handleCancel(a.id)}>
                            <X size={12} className="mr-1" />
                            Cancelar
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar Selector (Col-span 7) */}
          <Card className="lg:col-span-7">
            <CardHeader className="py-4 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <CalendarIcon size={16} className="text-violet-500" />
                  {monthNames[month]} {year}
                </CardTitle>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={handlePrevMonth}>
                    <ChevronLeft size={14} />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleNextMonth}>
                    <ChevronRight size={14} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
                <span>Lun</span>
                <span>Mar</span>
                <span>Mié</span>
                <span>Jue</span>
                <span>Vie</span>
                <span>Sáb</span>
                <span>Dom</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {calendarCells.map((day, idx) => {
                  if (day === null) return <div key={`empty-${idx}`} className="h-10 md:h-12 bg-zinc-100/20 dark:bg-zinc-900/10 rounded-lg" />;

                  const dateStr = getDateStr(day);
                  const isSelected = dateStr === selectedDateStr;
                  const dayAppointments = appointments.filter(a => a.date === dateStr);
                  const hasAppts = dayAppointments.length > 0;

                  return (
                    <button
                      key={`day-${day}`}
                      onClick={() => setSelectedDateStr(dateStr)}
                      className={`h-10 md:h-12 border rounded-lg flex flex-col justify-between p-1.5 transition-all text-left relative ${
                        isSelected 
                          ? 'bg-primary border-primary text-primary-foreground shadow-md font-bold' 
                          : 'hover:bg-muted/50 bg-background text-foreground'
                      }`}
                    >
                      <span className="text-xs">{day}</span>
                      {hasAppts && (
                        <div className="flex gap-0.5 mt-auto">
                          {dayAppointments.map(appt => (
                            <div 
                              key={appt.id} 
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSelected 
                                  ? 'bg-white' 
                                  : appt.status === 'confirmed' 
                                    ? 'bg-emerald-500' 
                                    : 'bg-amber-500'
                              }`} 
                            />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Appointments of Selected Day (Col-span 5) */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <Card>
              <CardHeader className="py-4 border-b bg-muted/20">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Citas para el {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {appointmentsForSelectedDate.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground space-y-1">
                    <AlertCircle className="mx-auto text-muted-foreground/30 h-8 w-8 stroke-[1.5]" />
                    <p className="text-xs font-semibold">Sin citas programadas</p>
                    <p className="text-[10px] text-muted-foreground/70">No hay reservas para esta fecha.</p>
                  </div>
                ) : (
                  appointmentsForSelectedDate.map(a => (
                    <div key={a.id} className="p-3.5 border rounded-xl bg-background flex flex-col gap-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="font-extrabold text-xs">{a.name}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{a.email}</p>
                        </div>
                        <Badge variant="outline" className={a.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold' : 'bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold'}>
                          {a.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-muted-foreground py-1.5 border-y border-dashed">
                        <span className="flex items-center gap-1 font-semibold text-foreground">
                          <Clock size={11} className="text-muted-foreground" />
                          {a.time} hs
                        </span>
                        <span className="truncate">{a.subject}</span>
                      </div>

                      <div className="flex justify-end gap-1.5">
                        {a.status === 'pending' && (
                          <Button size="xs" variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50" onClick={() => handleConfirm(a.id)}>
                            Confirmar
                          </Button>
                        )}
                        <Button size="xs" variant="outline" className="text-destructive border-rose-100 hover:bg-rose-50" onClick={() => handleCancel(a.id)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'config' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Settings size={16} className="text-violet-500" />
              Configuración de Disponibilidad
            </CardTitle>
            <CardDescription className="text-xs">Establece tus días laborables, franjas horarias y duración estimada de cada cita.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Days active */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Días Habilitados</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {Object.entries(days).map(([day, enabled]) => (
                  <div key={day} className="flex items-center justify-between p-3 border rounded-xl bg-background">
                    <span className="text-xs font-semibold capitalize">{day}</span>
                    <Switch 
                      checked={enabled} 
                      onCheckedChange={(checked) => setDays(prev => ({ ...prev, [day]: checked }))} 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Hours configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Hora de Inicio</label>
                <Input type="time" value={startTime} onChange={(e) => setStart(e.target.value)} className="h-9 text-xs" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Hora de Cierre</label>
                <Input type="time" value={endTime} onChange={(e) => setEnd(e.target.value)} className="h-9 text-xs" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Duración de la Cita</label>
                <select 
                  value={slotDuration} 
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 h-9 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="30">30 minutos</option>
                  <option value="45">45 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="90">1 hora y media</option>
                  <option value="120">2 horas</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-dashed">
              <Button onClick={handleSaveConfig} className="text-xs font-bold h-9">
                <Save size={14} className="mr-1.5" />
                Guardar Configuración
              </Button>
            </div>

          </CardContent>
        </Card>
      )}
    </div>
  );
}
