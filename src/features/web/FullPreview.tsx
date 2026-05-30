import { useState } from 'react';
import { useModules } from '../../lib/contexts/ModuleContext';
import { usePublicTheme } from '../../lib/contexts/PublicThemeContext';
import { PublicWebPreview } from './PublicWebPreview';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Laptop, Tablet, Smartphone, ExternalLink, Globe, 
  RefreshCw, Info, Lock 
} from 'lucide-react';
import { toast } from 'sonner';

export default function FullPreview() {
  const { modules, sections } = useModules();
  const { activeTheme } = usePublicTheme();
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [reloadKey, setReloadKey] = useState(0);

  const handleReload = () => {
    setReloadKey(prev => prev + 1);
    toast.success('Refrescando vista previa del portal público...');
  };

  const getWidthClass = () => {
    if (device === 'tablet') return 'w-[768px] h-[650px] rounded-xl border-4';
    if (device === 'mobile') return 'w-[375px] h-[650px] rounded-xl border-4';
    return 'w-full h-[700px]';
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* PREVIEW NAVIGATION TOOLBAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b pb-4 shrink-0">
        <div className="text-left space-y-0.5">
          <h1 className="text-xl font-black flex items-center gap-2">
            <Globe size={20} className="text-primary" />
            Vista previa del portal público
          </h1>
          <p className="text-xs text-muted-foreground">Estás viendo la compilación estática instantánea de tu web.</p>
        </div>

        {/* DEVICE SELECTORS */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
          <Button 
            size="xs" 
            variant={device === 'desktop' ? 'secondary' : 'ghost'}
            onClick={() => setDevice('desktop')}
            className="gap-1 text-xs"
          >
            <Laptop size={14} /> Desktop
          </Button>
          <Button 
            size="xs" 
            variant={device === 'tablet' ? 'secondary' : 'ghost'}
            onClick={() => setDevice('tablet')}
            className="gap-1 text-xs"
          >
            <Tablet size={14} /> Tablet
          </Button>
          <Button 
            size="xs" 
            variant={device === 'mobile' ? 'secondary' : 'ghost'}
            onClick={() => setDevice('mobile')}
            className="gap-1 text-xs"
          >
            <Smartphone size={14} /> Móvil
          </Button>
        </div>

        {/* EXTERNAL VIEW TRIGGER */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReload} className="gap-1 text-xs">
            <RefreshCw size={14} />
            Refrescar
          </Button>
          <Button 
            size="sm" 
            onClick={() => {
              toast.info('Se abriría la URL real en producción. Esta simulación en vivo usa el motor de previsualización estática.');
            }}
            className="gap-1 text-xs font-semibold"
          >
            <ExternalLink size={14} />
            Abrir Sitio Real
          </Button>
        </div>
      </div>

      {/* DETAILED MOCK BROWSER CHROMIUM CHROME WINDOW */}
      <div className="grow flex flex-col border rounded-xl overflow-hidden shadow-lg bg-zinc-50 dark:bg-zinc-900">
        {/* MOCK BROWSER BAR */}
        <div className="bg-zinc-100 dark:bg-zinc-800 border-b px-4 py-2 flex items-center gap-3 shrink-0">
          <div className="flex gap-1.5 shrink-0">
            <span className="w-3 w-3 h-3 rounded-full bg-rose-400 block" />
            <span className="w-3 w-3 h-3 rounded-full bg-amber-400 block" />
            <span className="w-3 w-3 h-3 rounded-full bg-emerald-400 block" />
          </div>
          <div className="grow bg-background border px-3 py-1 rounded text-xs text-muted-foreground flex items-center justify-between max-w-xl mx-auto">
            <div className="flex items-center gap-1.5 truncate">
              <Lock size={12} className="text-emerald-500" />
              <span className="font-mono text-[11px] truncate">https://www.escultorcarballo.com/</span>
            </div>
            <Badge variant="outline" className="text-[9px] py-0 text-emerald-600 bg-emerald-50 border-emerald-100 font-bold">Seguro</Badge>
          </div>
        </div>

        {/* CONTAINER AND PREVIEW WINDOW */}
        <div className="grow p-4 bg-zinc-100/50 dark:bg-zinc-950/20 flex justify-center items-start overflow-y-auto">
          <div 
            key={reloadKey}
            className={`transition-all duration-300 shadow-2xl bg-background border-zinc-200 dark:border-zinc-800 overflow-y-auto ${getWidthClass()}`}
          >
            <PublicWebPreview 
              theme={activeTheme} 
              modules={modules} 
              sections={sections} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
