import { useState, useEffect } from 'react';
import { mockApi } from '../../lib/mock-api';
import { usePublicTheme } from '../../lib/contexts/PublicThemeContext';
import type { MarketplaceItem, License } from '../../lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { 
  ShoppingBag, ShieldAlert, Sparkles, Download, Check, 
  RefreshCw, Layers, Palette, Cpu, Info, CheckCircle 
} from 'lucide-react';
import { toast } from 'sonner';

export default function Marketplace() {
  const { refreshThemes } = usePublicTheme();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [license, setLicense] = useState<License | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'section' | 'theme' | 'module'>('all');
  const [activeItem, setActiveItem] = useState<MarketplaceItem | null>(null);
  const [isInstalling, setIsInstalling] = useState<string | null>(null);

  const loadData = async () => {
    const list = await mockApi.marketplace.list();
    setItems(list);
    const lic = await mockApi.license.get();
    setLicense(lic);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInstall = async (item: MarketplaceItem) => {
    setIsInstalling(item.id);
    const actionText = item.state === 'update' ? 'Actualizando' : 'Instalando';
    const successText = item.state === 'update' ? 'actualizado' : 'instalado';
    const t = toast.loading(`${actionText} "${item.name}" de forma soberana...`);
    
    try {
      await mockApi.marketplace.install(item.id);
      setIsInstalling(null);
      toast.dismiss(t);
      toast.success(`"${item.name}" ${successText} correctamente en tu instancia.`);
      await loadData();
      await refreshThemes(); // Recargar temas si se instaló un tema
    } catch {
      setIsInstalling(null);
      toast.dismiss(t);
      toast.error('Fallo en la conexión segura con el Builder Central.');
    }
  };

  // Filter list
  const filteredItems = items.filter(it => {
    if (selectedFilter === 'all') return true;
    return it.kind === selectedFilter;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Marketplace</h1>
          <p className="text-sm text-muted-foreground">Expande las capacidades de tu Prisma con nuevos diseños y funcionalidades modulares.</p>
        </div>

        {/* LICENSE BADGE STATUS */}
        {license && (
          <div className="flex items-center gap-3 p-3 border rounded-xl bg-background shadow-sm shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-left">
              <div className="text-xs font-bold flex items-center gap-1">
                Licencia {license.plan}
                <Badge variant="outline" className="text-[9px] py-0 border-emerald-200 text-emerald-600 bg-emerald-50/50">Activa</Badge>
              </div>
              <p className="text-[10px] text-muted-foreground">Próxima validación: {license.renewsAt}</p>
            </div>
          </div>
        )}
      </div>

      {/* SECURITY BANNER - SOBRE & DISCRETO */}
      <Card className="border-indigo-100 dark:border-indigo-950 bg-indigo-50/30 dark:bg-indigo-950/10">
        <CardContent className="p-4 flex gap-3 text-left">
          <div className="p-2 h-fit bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <ShieldAlert size={18} />
          </div>
          <div className="space-y-1 grow">
            <h4 className="text-sm font-bold flex items-center gap-1.5">
              <span>Actualización de Seguridad Disponible</span>
              <Badge variant="secondary" className="text-[9px] bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200 font-bold border-none">Prisma Core v2.4.1</Badge>
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Hay una optimización recomendada para el cifrado del formulario de contacto. Esta actualización no afecta a tus datos ni detiene tu sitio web público.
            </p>
          </div>
          <Button size="xs" variant="outline" className="shrink-0 text-xs border-indigo-200 hover:bg-indigo-50" onClick={() => toast.success('Prisma Core actualizado a la versión v2.4.1 de forma segura.')}>
            Actualizar Core
          </Button>
        </CardContent>
      </Card>

      {/* REVELATORY EXPANSION ALERT BADGE */}
      <Card className="border-sky-100 dark:border-sky-950 bg-sky-50/40 dark:bg-sky-950/10">
        <CardContent className="p-4 flex gap-3 text-left">
          <div className="p-2 h-fit bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-lg">
            <Sparkles size={18} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold flex items-center gap-1.5">
              <span>Instala Formas, Conserva tu Alma (Contenido)</span>
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Al descargar o actualizar un componente o plantilla desde nuestro catálogo, tu Prisma simplemente adquiere un <span className="font-semibold text-foreground">nuevo preset de representación</span>. No necesitas copiar ni volver a escribir tus obras de arte; se auto-adaptarán al nuevo preset instantáneamente.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap gap-1.5 justify-start">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            selectedFilter === 'all' ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'hover:bg-muted text-muted-foreground bg-background'
          }`}
        >
          Todo el Catálogo
        </button>
        <button
          onClick={() => setSelectedFilter('theme')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all gap-1.5 flex items-center ${
            selectedFilter === 'theme' ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'hover:bg-muted text-muted-foreground bg-background'
          }`}
        >
          <Palette size={12} /> Temas Estéticos
        </button>
        <button
          onClick={() => setSelectedFilter('section')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all gap-1.5 flex items-center ${
            selectedFilter === 'section' ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'hover:bg-muted text-muted-foreground bg-background'
          }`}
        >
          <Layers size={12} /> Secciones de Página
        </button>
        <button
          onClick={() => setSelectedFilter('module')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all gap-1.5 flex items-center ${
            selectedFilter === 'module' ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'hover:bg-muted text-muted-foreground bg-background'
          }`}
        >
          <Cpu size={12} /> Módulos Funcionales
        </button>
      </div>

      {/* LISTING GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => {
          const isPending = isInstalling === item.id;

          return (
            <Card key={item.id} className="hover:shadow-md transition-all flex flex-col justify-between text-left">
              <div>
                <div className="h-44 overflow-hidden relative bg-muted border-b">
                  <img src={item.thumbnailUrl} alt={item.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 bg-background text-foreground border rounded-full">
                    {item.kind === 'theme' ? 'Tema' : item.kind === 'section' ? 'Sección' : 'Módulo'}
                  </span>
                </div>
                <CardHeader className="p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold">{item.name}</CardTitle>
                    <Badge variant="outline" className="text-[9px] font-mono font-normal">v{item.version}</Badge>
                  </div>
                  <CardDescription className="text-xs line-clamp-3 leading-relaxed pt-1">
                    {item.description}
                  </CardDescription>
                </CardHeader>
              </div>

              <CardFooter className="p-4 border-t bg-zinc-50/50 dark:bg-zinc-900/10 flex items-center justify-between gap-4">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setActiveItem(item)}
                  className="text-xs"
                >
                  Detalles
                </Button>

                {item.state === 'installed' ? (
                  <Badge variant="secondary" className="gap-1 bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-none">
                    <Check size={12} /> Instalado
                  </Badge>
                ) : item.state === 'update' ? (
                  <Button 
                    size="sm" 
                    onClick={() => handleInstall(item)} 
                    disabled={isPending}
                    className="gap-1 text-xs"
                  >
                    <RefreshCw size={12} className={isPending ? 'animate-spin' : ''} />
                    {isPending ? 'Actualizando' : 'Actualizar'}
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={() => handleInstall(item)} 
                    disabled={isPending}
                    className="gap-1 text-xs font-semibold"
                  >
                    <Download size={12} />
                    {isPending ? 'Instalando' : 'Instalar'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* DIALOG: ITEM DETAILS */}
      <Dialog open={!!activeItem} onOpenChange={(open) => !open && setActiveItem(null)}>
        <DialogContent className="max-w-md">
          {activeItem && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-lg">{activeItem.name}</DialogTitle>
                  <Badge variant="secondary" className="text-[10px] font-mono">v{activeItem.version}</Badge>
                </div>
                <DialogDescription className="pt-2 text-left text-xs leading-relaxed text-muted-foreground">
                  {activeItem.description}
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-4">
                <div className="h-44 overflow-hidden rounded-lg bg-muted">
                  <img src={activeItem.thumbnailUrl} alt={activeItem.name} className="w-full h-full object-cover" />
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-900 p-3 rounded-lg border text-xs text-left space-y-2">
                  <p className="font-bold flex items-center gap-1.5">
                    <Info size={14} className="text-primary" />
                    Especificación de integración
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Este componente se conecta de forma limpia a tu instancia de Prisma sin sobreescribir tus carpetas locales ni requerir actualizaciones de Node.js.
                  </p>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button type="button" variant="ghost" onClick={() => setActiveItem(null)}>Cerrar</Button>
                {activeItem.state !== 'installed' && (
                  <Button 
                    type="button" 
                    onClick={() => {
                      const item = activeItem;
                      setActiveItem(null);
                      handleInstall(item);
                    }}
                    className="gap-1"
                  >
                    {activeItem.state === 'update' ? 'Actualizar ahora' : 'Instalar en mi Prisma'}
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
