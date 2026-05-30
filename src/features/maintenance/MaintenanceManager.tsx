import { useState, useEffect } from 'react';
import { 
  Settings, Save, Eye, AlertTriangle, ShieldAlert, Mail, 
  Phone, Globe, Hammer, CheckCircle, ShieldCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

// Persistent State Helper
const SESSION_KEY = 'prisma_maintenance_mode';

interface MaintenanceConfig {
  active: boolean;
  title: string;
  message: string;
  returnDate: string;
  showEmail: boolean;
  showWhatsapp: boolean;
}

const defaultConfig: MaintenanceConfig = {
  active: false,
  title: 'Portal de Antonio Carballo en Mantenimiento',
  message: 'Estamos catalogando nuevas piezas en el taller de escultura y mejorando la galería multimedia. Estaremos de vuelta muy pronto con colecciones inéditas de talla directa en mármol y bronce.',
  returnDate: '2026-06-05',
  showEmail: true,
  showWhatsapp: true
};

export default function MaintenanceManager() {
  const [config, setConfig] = useState<MaintenanceConfig>(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : defaultConfig;
  });

  const saveToStorage = (updated: MaintenanceConfig) => {
    setConfig(updated);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    // Emit global event to let App.tsx know if it should show status banner
    window.dispatchEvent(new Event('maintenance-updated'));
  };

  const handleToggle = (active: boolean) => {
    const updated = { ...config, active };
    saveToStorage(updated);
    if (active) {
      toast.warning('Modo mantenimiento ACTIVO. Tu portal público ahora responderá con código 503.');
    } else {
      toast.success('Modo mantenimiento DESACTIVADO. Tu portal público vuelve a estar visible para todos.');
    }
  };

  const handleChange = (field: keyof MaintenanceConfig, val: string | boolean) => {
    saveToStorage({
      ...config,
      [field]: val
    });
  };

  const handleSave = () => {
    toast.success('Configuración de mantenimiento guardada de forma segura.');
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* HIGHLIGHTED WARNING BANNER WHEN ACTIVE */}
      {config.active && (
        <div className="p-4 border border-amber-300 dark:border-amber-950 bg-amber-500/10 rounded-2xl flex gap-3.5 items-start">
          <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5 animate-bounce" />
          <div className="overflow-hidden text-xs">
            <p className="font-extrabold text-amber-800 dark:text-amber-400">AVISO: Portal en Modo Mantenimiento</p>
            <p className="text-amber-600 dark:text-amber-500 mt-1">
              Todos los visitantes públicos están viendo la pantalla de cortesía 503. Puedes seguir editando el panel con total normalidad; la restricción solo se aplica al portal público.
            </p>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-black tracking-tight">Modo Mantenimiento</h1>
        <p className="text-xs text-muted-foreground">Desactiva el portal público temporalmente mientras trabajas en cambios estructurales.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT CONFIGURATION PANEL (Col-span 6) */}
        <Card className="lg:col-span-6">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Settings size={16} className="text-violet-500" />
              Configurar Bloqueo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            
            {/* BIG SWITCH TOGGLE */}
            <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/20">
              <div className="overflow-hidden">
                <p className="font-extrabold text-xs">Modo Mantenimiento (Cortesía 503)</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Activa o desactiva la pantalla de bloqueo público</p>
              </div>
              <Switch checked={config.active} onCheckedChange={handleToggle} />
            </div>

            {/* TITLE INPUT */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-muted-foreground">Título de Cabecera</label>
              <Input 
                value={config.title} 
                onChange={(e) => handleChange('title', e.target.value)}
                className="h-9 text-xs font-semibold"
                placeholder="Ej. Sitio en Mantenimiento"
              />
            </div>

            {/* MESSAGE INPUT */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-muted-foreground">Mensaje Explicativo</label>
              <Textarea 
                value={config.message} 
                onChange={(e) => handleChange('message', e.target.value)}
                className="text-xs min-h-[100px]"
                placeholder="Explica a tus visitantes por qué no está disponible el sitio..."
              />
            </div>

            {/* RETURN DATE */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-muted-foreground">Fecha Estimada de Vuelta</label>
              <Input 
                type="date"
                value={config.returnDate} 
                onChange={(e) => handleChange('returnDate', e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            {/* CONTACT METHODS SHOW */}
            <div className="space-y-3 pt-2">
              <label className="text-[10px] uppercase font-bold text-muted-foreground">Métodos de Contacto Visibles</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 border rounded-xl bg-background text-xs">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Mail size={12} className="text-muted-foreground" />
                    Mostrar Email
                  </span>
                  <Switch checked={config.showEmail} onCheckedChange={(val) => handleChange('showEmail', val)} />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-xl bg-background text-xs">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Phone size={12} className="text-muted-foreground" />
                    Mostrar Whatsapp
                  </span>
                  <Switch checked={config.showWhatsapp} onCheckedChange={(val) => handleChange('showWhatsapp', val)} />
                </div>
              </div>
            </div>

            {/* SAVE BUTTON */}
            <div className="flex justify-end pt-4 border-t border-dashed">
              <Button onClick={handleSave} className="text-xs font-bold h-9">
                <Save size={14} className="mr-1.5" />
                Guardar Configuración
              </Button>
            </div>

          </CardContent>
        </Card>

        {/* RIGHT PREVIEW OF 503 COURTESY PAGE (Col-span 6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Eye size={14} className="text-muted-foreground" />
            <span className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground">Vista Previa de la Página Pública 503</span>
          </div>

          <Card className="overflow-hidden border border-zinc-200 shadow-xl bg-zinc-50 dark:bg-zinc-900/40 relative">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center min-h-[480px]">
              
              {/* Simulated Browser window header */}
              <div className="absolute top-0 left-0 right-0 h-8 border-b bg-muted/40 px-4 flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="text-[10px] font-mono text-muted-foreground ml-2">antoniocarballo.art.es (HTTP 503)</span>
              </div>

              {/* Maintenance Icon */}
              <div className="relative w-16 h-16 flex items-center justify-center bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20 mb-6 shadow-inner animate-pulse">
                <Hammer size={32} />
              </div>

              {/* Title */}
              <h2 className="text-lg font-black tracking-tight text-foreground max-w-md">
                {config.title || 'Sitio temporalmente inactivo'}
              </h2>

              {/* Divider */}
              <div className="w-12 h-1 bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full my-4" />

              {/* Message */}
              <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
                {config.message || 'Disculpa las molestias, estamos realizando mejoras técnicas para ofrecerte una mejor experiencia artística.'}
              </p>

              {/* Estimated back info */}
              {config.returnDate && (
                <Badge variant="outline" className="mt-6 font-extrabold px-3 py-1 bg-amber-500/5 text-amber-600 border-amber-500/20 text-[10px]">
                  Regresamos el: {new Date(config.returnDate + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </Badge>
              )}

              {/* Contact methods */}
              {(config.showEmail || config.showWhatsapp) && (
                <div className="flex gap-4 mt-8 pt-6 border-t border-zinc-200/50 dark:border-zinc-800 w-full max-w-xs justify-center text-[10px] font-bold text-muted-foreground">
                  {config.showEmail && (
                    <span className="flex items-center gap-1 hover:text-foreground cursor-pointer">
                      <Mail size={12} className="text-violet-500" />
                      antonio.carballo@art.es
                    </span>
                  )}
                  {config.showWhatsapp && (
                    <span className="flex items-center gap-1 hover:text-foreground cursor-pointer">
                      <Phone size={12} className="text-emerald-500" />
                      +34 600 123 456
                    </span>
                  )}
                </div>
              )}

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
