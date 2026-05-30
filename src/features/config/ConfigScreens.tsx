import { useState } from 'react';
import { 
  Shield, Key, Smartphone, Users, Download, Trash2, Database, 
  RefreshCw, CheckCircle, Award, CreditCard, ExternalLink, FileText, 
  Scale, Save, AlertCircle, ShieldCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

// =================================═══════════════════════
// 1. SECURITY VIEW (/security)
// =================================═══════════════════════
export function SecuritySettings() {
  const [tfa, setTfa] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error('Todos los campos de contraseña son obligatorios.');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('La nueva contraseña y su confirmación no coinciden.');
    }
    toast.success('Contraseña actualizada de forma segura.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleTfaToggle = (val: boolean) => {
    setTfa(val);
    if (val) {
      toast.success('Doble factor habilitado. Escanea el código QR que se enviaría a tu autenticador.');
    } else {
      toast.info('Autenticación de doble factor desactivada.');
    }
  };

  const sessions = [
    { browser: 'Chrome en macOS Sonoma', ip: '82.122.45.29', current: true, date: 'Activa ahora' },
    { browser: 'Safari en iPhone 15 Pro', ip: '82.122.45.101', current: false, date: 'Hace 4 horas' },
    { browser: 'Firefox en Windows 11', ip: '190.23.94.12', current: false, date: 'Hace 3 días' }
  ];

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Seguridad de la Cuenta</h1>
        <p className="text-xs text-muted-foreground">Gestiona tus credenciales, claves API y las sesiones activas en el panel de control.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PASSWORD FORM */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Key size={16} className="text-violet-500" />
              Cambiar Contraseña
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Contraseña Actual</label>
                <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="h-9 text-xs" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Nueva Contraseña</label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="h-9 text-xs" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-muted-foreground">Confirmar Nueva Contraseña</label>
                <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-9 text-xs" />
              </div>
              <Button type="submit" className="text-xs font-bold h-9 w-full">
                Guardar Contraseña
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 2FA & ACTIVE SESSIONS */}
        <div className="space-y-6">
          {/* 2FA */}
          <Card>
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1.5">
                <p className="font-extrabold text-xs flex items-center gap-1.5">
                  <Smartphone size={15} className="text-violet-500" />
                  Doble Factor (2FA)
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Añade una capa extra de protección solicitando un código temporal en tu móvil al iniciar sesión.
                </p>
              </div>
              <Switch checked={tfa} onCheckedChange={handleTfaToggle} />
            </CardContent>
          </Card>

          {/* SESSIONS */}
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Users size={13} />
                Sesiones Activas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y text-xs">
                {sessions.map((s, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold flex items-center gap-1.5">
                        {s.browser}
                        {s.current && (
                          <Badge variant="outline" className="text-[9px] px-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-black">
                            Actual
                          </Badge>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">IP: {s.ip} • {s.date}</p>
                    </div>
                    {!s.current && (
                      <Button variant="outline" size="xs" onClick={() => toast.success('Sesión remota finalizada.')} className="text-[10px] font-bold h-7">
                        Cerrar
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// =================================═══════════════════════
// 2. BACKUPS VIEW (/backups)
// =================================═══════════════════════
export function BackupSettings() {
  const [creating, setCreating] = useState(false);
  const [backups, setBackups] = useState([
    { id: 'b-1', name: 'backup_prisma_antonio_2026-05-28.zip', size: '42.8 MB', date: '28 de May, 2026' },
    { id: 'b-2', name: 'backup_prisma_antonio_2026-05-15.zip', size: '41.5 MB', date: '15 de May, 2026' }
  ]);
  const [autoBackup, setAutoBackup] = useState('weekly');

  const handleCreateBackup = () => {
    setCreating(true);
    toast.loading('Generando copia de seguridad de bases de datos, biblioteca de medios y plantillas de diseño...');
    setTimeout(() => {
      const newB = {
        id: `b-${Date.now()}`,
        name: `backup_prisma_antonio_${new Date().toISOString().split('T')[0]}.zip`,
        size: '43.1 MB',
        date: 'Hoy (manual)'
      };
      setBackups(prev => [newB, ...prev]);
      setCreating(false);
      toast.dismiss();
      toast.success('Copia de seguridad completada con éxito. Archivo comprimido disponible para descarga.');
    }, 2000);
  };

  const handleDeleteBackup = (id: string) => {
    if (confirm('¿Seguro que deseas eliminar esta copia de seguridad del servidor?')) {
      setBackups(prev => prev.filter(b => b.id !== id));
      toast.success('Copia de seguridad eliminada.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Copias de Seguridad</h1>
          <p className="text-xs text-muted-foreground">Descarga o restaura copias integrales de tu portal artístico para salvaguardar tu patrimonio digital.</p>
        </div>
        <Button onClick={handleCreateBackup} disabled={creating} className="text-xs font-bold h-9">
          <RefreshCw size={14} className={`mr-1.5 ${creating ? 'animate-spin' : ''}`} />
          Crear Copia de Seguridad
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* BACKUP LIST (Col-span 8) */}
        <Card className="lg:col-span-8">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Database size={16} className="text-violet-500" />
              Copias Disponibles en la Nube
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-muted/30 border-b font-bold text-muted-foreground">
                    <th className="p-4">Archivo</th>
                    <th className="p-4">Tamaño</th>
                    <th className="p-4">Fecha</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {backups.map((b) => (
                    <tr key={b.id} className="hover:bg-muted/15 transition-all">
                      <td className="p-4 font-mono font-bold text-foreground">{b.name}</td>
                      <td className="p-4 font-semibold text-muted-foreground">{b.size}</td>
                      <td className="p-4 font-semibold text-muted-foreground">{b.date}</td>
                      <td className="p-4 text-right space-x-1.5">
                        <Button variant="outline" size="xs" onClick={() => toast.success('Descargando archivo comprimido...')} className="text-[10px] font-bold h-7">
                          <Download size={11} className="mr-1" />
                          Descargar
                        </Button>
                        <Button variant="outline" size="xs" onClick={() => toast.success('Restaurando datos del portal a esta versión...')} className="text-[10px] font-bold h-7 border-indigo-100 text-indigo-600 hover:bg-indigo-50">
                          Restaura
                        </Button>
                        <Button variant="outline" size="xs" onClick={() => handleDeleteBackup(b.id)} className="text-[10px] font-bold h-7 border-rose-100 text-destructive hover:bg-rose-50">
                          <Trash2 size={11} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FREQUENCY CONFIG (Col-span 4) */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Automatización</CardTitle>
            <CardDescription className="text-xs">Establece el intervalo para guardar tus datos automáticamente.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5 text-xs">
              <label className="text-[10px] uppercase font-bold text-muted-foreground">Frecuencia de Backup</label>
              <select 
                value={autoBackup} 
                onChange={(e) => {
                  setAutoBackup(e.target.value);
                  toast.success('Intervalo de copia automática actualizado.');
                }}
                className="w-full rounded-md border border-input bg-background px-3 h-9 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
              >
                <option value="daily">Diario (cada medianoche)</option>
                <option value="weekly">Semanal (cada domingo)</option>
                <option value="monthly">Mensual (día 1 del mes)</option>
                <option value="none">Desactivar copias automáticas</option>
              </select>
            </div>

            <div className="p-3 border border-emerald-200 bg-emerald-500/5 rounded-xl text-[11px] font-semibold text-emerald-800 dark:text-emerald-400 flex gap-2">
              <CheckCircle size={14} className="shrink-0 text-emerald-500 mt-0.5" />
              <span>Tus respaldos están cifrados y replicados de forma redundante en 3 servidores europeos.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// =================================═══════════════════════
// 3. LICENSE VIEW (/license)
// =================================═══════════════════════
export function LicenseSettings() {
  const handleUpgrade = () => {
    toast.success('Petición de ampliación de plan a Prisma Soberano Enterprise enviada a ventas.');
  };

  const invoices = [
    { num: 'INV-2026-05', date: '01 de May, 2026', amt: '19,90 €', status: 'Pagado' },
    { num: 'INV-2026-04', date: '01 de Abr, 2026', amt: '19,90 €', status: 'Pagado' },
    { num: 'INV-2026-03', date: '01 de Mar, 2026', amt: '19,90 €', status: 'Pagado' }
  ];

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Suscripción y Licencia</h1>
        <p className="text-xs text-muted-foreground">Revisa tu plan actual, descarga tus facturas emitidas y gestiona tus métodos de pago.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CURRENT PLAN CARD (Col-span 5) */}
        <Card className="lg:col-span-5 relative overflow-hidden">
          {/* Neon background effect */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl" />
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Award size={16} className="text-violet-500" />
              Plan de Licencia Activo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground">Suscripción activa</span>
              <h2 className="text-2xl font-black tracking-tight text-violet-600 dark:text-violet-400 mt-1">Prisma Soberano Pro</h2>
              <p className="text-xs text-muted-foreground mt-1">
                La suite definitiva para escultores profesionales con portafolios de alta fidelidad, IA integrada y analíticas avanzadas de visitas.
              </p>
            </div>

            <div className="border-t border-dashed pt-4 space-y-2.5 text-xs font-semibold">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Importe mensual:</span>
                <span className="text-foreground">19,90 € / mes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fecha de renovación:</span>
                <span className="text-foreground">15 de Enero, 2027</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Método de pago:</span>
                <span className="text-foreground flex items-center gap-1">
                  <CreditCard size={12} className="text-muted-foreground" />
                  Visa terminada en 8920
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <Button onClick={handleUpgrade} className="grow text-xs font-bold h-9">
                Ampliar a Enterprise
              </Button>
              <Button variant="outline" size="sm" onClick={() => toast.info('Para cancelar, por favor ponte en contacto con soporte técnico.')} className="text-xs h-9 text-muted-foreground">
                Cancelar Plan
              </Button>
            </div>

          </CardContent>
        </Card>

        {/* BILLING HISTORY TABLE (Col-span 7) */}
        <Card className="lg:col-span-7">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-sm font-bold">Historial de Facturación</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-muted/30 border-b font-bold text-muted-foreground">
                    <th className="p-4">Factura</th>
                    <th className="p-4">Fecha de Emisión</th>
                    <th className="p-4">Importe</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">PDF</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {invoices.map((i, idx) => (
                    <tr key={idx} className="hover:bg-muted/15 transition-all">
                      <td className="p-4 font-mono font-bold text-foreground">{i.num}</td>
                      <td className="p-4 font-semibold text-muted-foreground">{i.date}</td>
                      <td className="p-4 font-extrabold text-foreground">{i.amt}</td>
                      <td className="p-4">
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold">
                          {i.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => toast.success('Abriendo PDF en otra pestaña...')}>
                          <Download size={13} className="text-muted-foreground" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

// =================================═══════════════════════
// 4. LEGAL SETTINGS VIEW (/legal)
// =================================═══════════════════════
export function LegalSettings() {
  const [selectedDoc, setSelectedDoc] = useState<'aviso' | 'privacidad' | 'cookies'>('aviso');
  const [avisoLegal, setAvisoLegal] = useState(
    '1. DATOS IDENTIFICATIVOS: En cumplimiento con el deber de información recogido en artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico, a continuación se reflejan los siguientes datos: el propietario de este portal web es Antonio Carballo (en adelante Antonio Carballo), con domicilio a estos efectos en Calle de la Escultura 12, Madrid, con N.I.F.: 01234567-X. Correo electrónico de contacto: antonio.carballo@art.es.'
  );
  const [privacidad, setPrivacidad] = useState(
    'DE CONFORMIDAD con el Reglamento (UE) 2016/679 relativo a la protección de las personas físicas en lo que respecta al tratamiento de datos personales, informamos de que los datos de contacto facilitados a través de nuestros formularios serán incorporados a ficheros titularidad de Antonio Carballo con la finalidad exclusiva de responder consultas, gestionar citas previas y facturación de obras de arte.'
  );
  const [cookies, setCookies] = useState(
    'ESTE PORTAL WEB utiliza cookies técnicas y analíticas de sesión propias y de terceros para recopilar estadísticas anónimas de visitas de forma totalmente integrada y respetuosa con tu privacidad. No instalamos cookies de rastreo comercial ni enviamos datos a redes de publicidad.'
  );

  const handleSaveDoc = () => {
    toast.success('Documentos legales actualizados correctamente para el footer del sitio.');
  };

  const getDocValue = () => {
    if (selectedDoc === 'aviso') return avisoLegal;
    if (selectedDoc === 'privacidad') return privacidad;
    return cookies;
  };

  const handleDocChange = (val: string) => {
    if (selectedDoc === 'aviso') setAvisoLegal(val);
    else if (selectedDoc === 'privacidad') setPrivacidad(val);
    else setCookies(val);
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Textos Legales</h1>
        <p className="text-xs text-muted-foreground">Redacta las condiciones obligatorias de privacidad y cookies que regulan tu sitio según la legislación vigente.</p>
      </div>

      <Card>
        <CardHeader className="pb-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Scale size={16} className="text-violet-500" />
              Editor de Documentos Regulatorios
            </CardTitle>
            {/* DOC SELECTOR */}
            <div className="flex bg-muted p-1 rounded-lg text-xs font-bold shrink-0">
              <button
                onClick={() => setSelectedDoc('aviso')}
                className={`px-3 py-1 rounded-md transition-all ${selectedDoc === 'aviso' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Aviso Legal
              </button>
              <button
                onClick={() => setSelectedDoc('privacidad')}
                className={`px-3 py-1 rounded-md transition-all ${selectedDoc === 'privacidad' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Privacidad
              </button>
              <button
                onClick={() => setSelectedDoc('cookies')}
                className={`px-3 py-1 rounded-md transition-all ${selectedDoc === 'cookies' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Cookies
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          
          <div className="space-y-1.5 text-xs">
            <label className="text-[10px] uppercase font-bold text-muted-foreground">
              {selectedDoc === 'aviso' ? 'Contenido del Aviso Legal' : selectedDoc === 'privacidad' ? 'Política de Privacidad (RGPD)' : 'Política de Cookies'}
            </label>
            <Textarea 
              value={getDocValue()} 
              onChange={(e) => handleDocChange(e.target.value)}
              className="min-h-[220px] font-sans text-xs leading-relaxed text-zinc-700 dark:text-zinc-300"
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
              <AlertCircle size={12} className="text-muted-foreground" />
              Se enlazan de forma automatizada en el pie de página de tu web pública.
            </span>
            <Button onClick={handleSaveDoc} className="text-xs font-bold h-9">
              <Save size={14} className="mr-1.5" />
              Guardar Documento
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
