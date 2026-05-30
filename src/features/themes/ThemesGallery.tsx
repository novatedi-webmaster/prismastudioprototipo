import { useState, useEffect } from 'react';
import { usePublicTheme } from '../../lib/contexts/PublicThemeContext';
import { useModules } from '../../lib/contexts/ModuleContext';
import { PublicWebPreview } from '../web/PublicWebPreview';
import type { PublicTheme } from '../../lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Palette, Check, ArrowRight, Eye, RefreshCw, LayoutTemplate } from 'lucide-react';
import { toast } from 'sonner';

export default function ThemesGallery() {
  const { themes, activeTheme, changeTheme } = usePublicTheme();
  const { modules, sections } = useModules();

  // Selected theme to PREVIEW in real-time before applying
  const [previewTheme, setPreviewTheme] = useState<PublicTheme | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isApplying, setIsApplying] = useState(false);

  // Initialize previewTheme to the currently active theme once loaded
  useEffect(() => {
    if (activeTheme && !previewTheme) {
      setPreviewTheme(activeTheme);
    }
  }, [activeTheme]);

  const handleApplyTheme = async () => {
    if (!previewTheme) return;
    setIsApplying(true);
    const t = toast.loading(`Aplicando diseño "${previewTheme.name}" y remapeando layouts de secciones...`);
    
    try {
      await changeTheme(previewTheme.id);
      setIsApplying(false);
      toast.dismiss(t);
      toast.success(`Diseño estético "${previewTheme.name}" aplicado a toda tu web pública con éxito.`);
    } catch {
      setIsApplying(false);
      toast.dismiss(t);
      toast.error('Fallo al aplicar el diseño.');
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Diseños / Themes</h1>
          <p className="text-sm text-muted-foreground">Experimenta la separación de contenido y diseño. Cambia el aspecto de tu web pública en un clic.</p>
        </div>
      </div>

      {/* CORE EXPLANATORY REVELATION BANNER */}
      <Card className="border-amber-100 dark:border-amber-950 bg-amber-50/40 dark:bg-amber-950/10">
        <CardContent className="p-4 flex gap-3 text-left">
          <div className="p-2 h-fit bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
            <AlertCircle size={18} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold flex items-center gap-1.5">
              <span>Conservación del Contenido Garantizada</span>
              <Badge variant="outline" className="text-[10px] font-bold py-0 text-amber-600 border-amber-200 bg-white dark:bg-zinc-900">Seguro</Badge>
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Al seleccionar o cambiar de tema, <span className="font-semibold text-foreground">ninguno de tus textos, obras catalogadas ni exposiciones se perderá</span>. El sistema re-mapea automáticamente tus bloques de contenido a las nuevas composiciones de presets del tema seleccionado (vistas divididas, grillas clásicas, galerías asimétricas y paletas de colores exclusivas).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CORE MASTER-DETAIL SPLIT ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN - THEMES SELECTOR (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-base font-bold text-left">Temas instalados</h3>
          <div className="grid grid-cols-1 gap-3">
            {themes.map((t) => {
              const isCurrentlyActive = activeTheme?.id === t.id;
              const isUnderPreview = previewTheme?.id === t.id;

              return (
                <Card 
                  key={t.id} 
                  onClick={() => setPreviewTheme(t)}
                  className={`border transition-all cursor-pointer text-left ${
                    isUnderPreview 
                      ? 'ring-2 ring-primary bg-zinc-50/50 dark:bg-zinc-900/40 shadow-sm' 
                      : 'hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10'
                  }`}
                >
                  <CardContent className="p-4 flex gap-4 items-center">
                    <div className="w-16 h-16 shrink-0 overflow-hidden border rounded-lg bg-muted shadow-inner">
                      <img src={t.thumbnailUrl} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="grow space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm tracking-tight">{t.name}</span>
                        {isCurrentlyActive && (
                          <Badge className="text-[9px] py-0 px-1.5 bg-emerald-500 hover:bg-emerald-600 font-bold border-none text-white">
                            Activo
                          </Badge>
                        )}
                        {!isCurrentlyActive && isUnderPreview && (
                          <Badge variant="outline" className="text-[9px] py-0 px-1.5 font-bold text-primary border-primary">
                            Previsualizando
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        Tipografía: {t.tokens.fontFamily?.split(',')[0]}
                      </p>
                      <div className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-full border shadow-sm" style={{ backgroundColor: t.tokens.bg }} />
                        <span className="w-3 h-3 rounded-full border shadow-sm" style={{ backgroundColor: t.tokens.primary }} />
                        <span className="w-3 h-3 rounded-full border shadow-sm" style={{ backgroundColor: t.tokens.accent }} />
                      </div>
                    </div>
                    <ArrowRight size={14} className={`text-muted-foreground transition-transform ${isUnderPreview ? 'translate-x-1 text-primary' : ''}`} />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {previewTheme && (
            <Card className="text-left bg-zinc-50/20 dark:bg-zinc-900/10 border p-5 space-y-4">
              <div className="space-y-1">
                <h4 className="font-bold text-sm">Contrato de Maquetación de "{previewTheme.name}"</h4>
                <p className="text-xs text-muted-foreground">Este diseño aplica los siguientes presets exclusivos:</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Portada Principal (Hero)</span>
                  <Badge variant="secondary" className="text-[10px] font-mono">{previewTheme.presetMap['hero'] || 'hero-split'}</Badge>
                </div>
                <div className="flex items-center justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Colección de Esculturas</span>
                  <Badge variant="secondary" className="text-[10px] font-mono">{previewTheme.presetMap['gallery'] || 'gallery-grid'}</Badge>
                </div>
                <div className="flex items-center justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Sobre Mí / Biografía</span>
                  <Badge variant="secondary" className="text-[10px] font-mono">{previewTheme.presetMap['about'] || 'about-classic'}</Badge>
                </div>
              </div>

              {activeTheme?.id !== previewTheme.id ? (
                <Button 
                  onClick={handleApplyTheme}
                  disabled={isApplying}
                  className="w-full font-bold shadow-sm"
                >
                  <Palette size={16} className="mr-2" />
                  Aplicar diseño "{previewTheme.name}"
                </Button>
              ) : (
                <div className="text-xs text-emerald-600 font-bold flex items-center justify-center gap-1 py-1 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 rounded-lg">
                  <Check size={14} /> Este diseño está activo actualmente
                </div>
              )}
            </Card>
          )}
        </div>

        {/* RIGHT COLUMN - PREVIEW CONTAINER (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-left flex items-center gap-1.5">
              <LayoutTemplate size={16} /> Previsualización interactiva de {previewTheme?.name}
            </h3>
            <div className="flex gap-1 border p-1 bg-muted rounded-md text-xs">
              <button 
                onClick={() => setPreviewDevice('desktop')}
                className={`px-2.5 py-1 rounded-sm font-semibold transition-all ${previewDevice === 'desktop' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
              >
                Escritorio
              </button>
              <button 
                onClick={() => setPreviewDevice('mobile')}
                className={`px-2.5 py-1 rounded-sm font-semibold transition-all ${previewDevice === 'mobile' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
              >
                Móvil
              </button>
            </div>
          </div>

          <Card className="overflow-hidden border shadow-inner">
            <CardContent className="p-0 bg-zinc-100 dark:bg-zinc-900 flex justify-center">
              <div 
                className={`transition-all duration-300 overflow-y-auto ${
                  previewDevice === 'desktop' 
                    ? 'w-full h-[600px]' 
                    : 'w-[375px] h-[600px] border-x shadow-2xl my-4 rounded-xl'
                }`}
              >
                {previewTheme && (
                  <PublicWebPreview 
                    theme={previewTheme} 
                    modules={modules} 
                    sections={sections} 
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
