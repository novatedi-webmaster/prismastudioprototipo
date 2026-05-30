import { useState } from 'react';
import { 
  Users, Shield, Check, X, UserPlus, ShieldAlert, Clock,
  MoreVertical, Edit3, Trash2, Ban, CheckCircle2, AlertTriangle, Save
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'manager' | 'staff';
  lastAccess: string;
  status: 'active' | 'inactive';
}

const initialMembers: TeamMember[] = [
  {
    id: 'team-1',
    name: 'Antonio Carballo',
    email: 'antonio.carballo@art.es',
    role: 'owner',
    lastAccess: 'Hoy, 10:45',
    status: 'active'
  },
  {
    id: 'team-2',
    name: 'Clara Soto',
    email: 'clara.soto@prismaeditor.com',
    role: 'manager',
    lastAccess: 'Ayer, 18:12',
    status: 'active'
  },
  {
    id: 'team-3',
    name: 'Mateo Delgado',
    email: 'mateo.assist@art.es',
    role: 'staff',
    lastAccess: 'Hace 3 días',
    status: 'active'
  }
];

export default function TeamManager() {
  const [activeTab, setActiveTab] = useState<'members' | 'roles'>('members');
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);

  // Invite form state
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'owner' | 'manager' | 'staff'>('staff');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return toast.error('El nombre y el email son obligatorios.');

    const newMember: TeamMember = {
      id: `team-gen-${Date.now()}`,
      name,
      email,
      role,
      lastAccess: 'Nunca',
      status: 'active'
    };

    setMembers(prev => [...prev, newMember]);
    setShowInviteForm(false);
    setName('');
    setEmail('');
    toast.success(`Se ha enviado una invitación por correo a ${email}.`);
  };

  const handleChangeRole = (id: string, currentRole: 'owner' | 'manager' | 'staff') => {
    if (currentRole === 'owner') {
      return toast.error('No se puede cambiar el rol del Owner principal.');
    }
    const nextRole: Record<'manager' | 'staff', 'manager' | 'staff'> = {
      manager: 'staff',
      staff: 'manager'
    };
    const targetRole = currentRole === 'manager' ? 'staff' : 'manager';
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role: targetRole } : m));
    toast.success('Rol de usuario actualizado correctamente.');
  };

  const handleToggleStatus = (id: string, currentRole: 'owner' | 'manager' | 'staff', currentStatus: 'active' | 'inactive') => {
    if (currentRole === 'owner') {
      return toast.error('No se puede desactivar al Owner principal.');
    }
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status: nextStatus } : m));
    toast.success(nextStatus === 'inactive' ? 'Usuario desactivado correctamente.' : 'Usuario reactivado.');
  };

  const handleDeleteMember = (id: string, currentRole: 'owner' | 'manager' | 'staff') => {
    if (currentRole === 'owner') {
      return toast.error('No se puede eliminar al Owner principal.');
    }
    if (confirm('¿Seguro que deseas revocar el acceso a este miembro?')) {
      setMembers(prev => prev.filter(m => m.id !== id));
      toast.success('Acceso revocado de forma permanente.');
    }
  };

  const getRoleBadgeClass = (r: 'owner' | 'manager' | 'staff') => {
    switch(r) {
      case 'owner': return 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 font-bold';
      case 'manager': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-bold';
      case 'staff': return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20 font-bold';
    }
  };

  // Matrix of permissions for READ-ONLY tab
  const permissionMatrix = [
    { name: 'Ver Dashboard y analíticas', owner: true, manager: true, staff: true },
    { name: 'Ver y gestionar obras / catálogos', owner: true, manager: true, staff: true },
    { name: 'Editar contenidos web y biografía', owner: true, manager: true, staff: false },
    { name: 'Gestionar páginas y enlaces', owner: true, manager: true, staff: false },
    { name: 'Administrar identidad y branding', owner: true, manager: false, staff: false },
    { name: 'Modificar modo mantenimiento', owner: true, manager: true, staff: false },
    { name: 'Invitar miembros y cambiar roles', owner: true, manager: false, staff: false },
    { name: 'Editar facturación y suscripción', owner: true, manager: false, staff: false }
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Equipo & Permisos</h1>
          <p className="text-xs text-muted-foreground">Administra los accesos de tus colaboradores y define sus niveles de autorización.</p>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex bg-muted p-1 rounded-lg text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-3 py-1.5 rounded-md transition-all ${activeTab === 'members' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Miembros del Equipo
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-3 py-1.5 rounded-md transition-all ${activeTab === 'roles' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Roles y Permisos
          </button>
        </div>
      </div>

      {/* TEAM MEMBERS VIEW */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          
          {/* INVITE BUTTON & COUNTER SUMMARY */}
          <div className="flex justify-between items-center bg-muted/20 p-4 border rounded-xl">
            <div className="flex gap-4 text-xs font-semibold">
              <div>
                <span className="text-muted-foreground">Miembros activos: </span>
                <span className="text-foreground font-extrabold">{members.filter(m => m.status === 'active').length}</span>
              </div>
              <div className="text-muted-foreground">|</div>
              <div>
                <span className="text-muted-foreground">Invitaciones pendientes: </span>
                <span className="text-foreground font-extrabold">0</span>
              </div>
            </div>
            <Button size="sm" className="text-xs font-bold h-9" onClick={() => setShowInviteForm(true)}>
              <UserPlus size={14} className="mr-1.5" />
              Invitar Miembro
            </Button>
          </div>

          {/* INVITE IN-LINE MODAL FORM */}
          {showInviteForm && (
            <Card className="border-indigo-150 dark:border-indigo-950 bg-indigo-50/10 dark:bg-indigo-950/5">
              <CardHeader className="py-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <UserPlus size={16} />
                  Invitar Nuevo Colaborador
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInvite} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Nombre</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9 text-xs" placeholder="Ej. Javier Marías" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Email</label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-9 text-xs" placeholder="javier@art.es" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground">Rol Asignado</label>
                    <select 
                      value={role} 
                      onChange={(e) => setRole(e.target.value as 'owner' | 'manager' | 'staff')}
                      className="w-full rounded-md border border-input bg-background px-3 h-9 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="manager">Manager / Gestor</option>
                      <option value="staff">Staff / Asistente</option>
                    </select>
                  </div>
                  <div className="col-span-full flex justify-end gap-2 pt-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowInviteForm(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" size="sm">
                      Enviar Invitación
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* USERS TABLE */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/30 border-b">
                      <th className="p-4 text-left font-bold text-muted-foreground">Usuario</th>
                      <th className="p-4 text-left font-bold text-muted-foreground">Rol</th>
                      <th className="p-4 text-left font-bold text-muted-foreground">Último Acceso</th>
                      <th className="p-4 text-left font-bold text-muted-foreground">Estado</th>
                      <th className="p-4 text-right font-bold text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {members.map((m) => (
                      <tr key={m.id} className="hover:bg-muted/20 transition-all">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                              {m.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-extrabold text-foreground">{m.name}</p>
                              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{m.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={`px-2 py-0.5 capitalize text-[10px] ${getRoleBadgeClass(m.role)}`}>
                            {m.role === 'owner' ? 'Propietario / Owner' : m.role === 'manager' ? 'Gestor / Manager' : 'Asistente / Staff'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className="flex items-center gap-1 font-semibold text-zinc-600 dark:text-zinc-400">
                            <Clock size={11} className="text-muted-foreground" />
                            {m.lastAccess}
                          </span>
                        </td>
                        <td className="p-4">
                          {m.status === 'active' ? (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold">
                              Activo
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-zinc-100 text-zinc-400 dark:bg-zinc-800 border-zinc-200/50 font-bold">
                              Inactivo
                            </Badge>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-1.5">
                          {m.role !== 'owner' && (
                            <>
                              <Button 
                                size="xs" 
                                variant="outline" 
                                onClick={() => handleChangeRole(m.id, m.role)}
                                title="Cambiar rol (Manager <-> Staff)"
                                className="text-xs"
                              >
                                Cambiar Rol
                              </Button>
                              <Button 
                                size="xs" 
                                variant="outline" 
                                onClick={() => handleToggleStatus(m.id, m.role, m.status)}
                                className={m.status === 'active' ? 'text-amber-600 border-amber-100' : 'text-emerald-600 border-emerald-100'}
                              >
                                {m.status === 'active' ? 'Desactivar' : 'Activar'}
                              </Button>
                              <Button 
                                size="xs" 
                                variant="outline" 
                                className="text-destructive border-rose-100 hover:bg-rose-50"
                                onClick={() => handleDeleteMember(m.id, m.role)}
                              >
                                Quitar
                              </Button>
                            </>
                          )}
                          {m.role === 'owner' && (
                            <span className="text-[10px] text-muted-foreground font-bold pr-3">Principal</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

        </div>
      )}

      {/* ROLES MATRIX VIEW */}
      {activeTab === 'roles' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Shield size={16} className="text-violet-500" />
              Matriz de Permisos por Rol
            </CardTitle>
            <CardDescription className="text-xs">Consulta las capacidades autorizadas para cada nivel de perfil de usuario en Prisma Studio.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-muted/30 border-b">
                    <th className="p-4 font-bold text-muted-foreground">Funcionalidad</th>
                    <th className="p-4 text-center font-bold text-muted-foreground w-[120px]">Propietario / Owner</th>
                    <th className="p-4 text-center font-bold text-muted-foreground w-[120px]">Gestor / Manager</th>
                    <th className="p-4 text-center font-bold text-muted-foreground w-[120px]">Asistente / Staff</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {permissionMatrix.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/10 transition-all">
                      <td className="p-4 font-extrabold text-foreground">{row.name}</td>
                      <td className="p-4 text-center">
                        {row.owner ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                            <Check size={11} className="stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
                            <X size={11} className="stroke-[3]" />
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {row.manager ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                            <Check size={11} className="stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
                            <X size={11} className="stroke-[3]" />
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {row.staff ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                            <Check size={11} className="stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
                            <X size={11} className="stroke-[3]" />
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
